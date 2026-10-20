begin;

create extension if not exists pg_trgm with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;

alter table public.profiles
  add column if not exists must_change_password boolean not null default true;

alter table public.import_jobs
  add column if not exists storage_key text,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by uuid references public.profiles(id);

create type public.import_row_status as enum ('valid', 'invalid', 'imported', 'skipped');

create table public.import_job_rows (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.import_jobs(id),
  row_number integer not null check (row_number > 0),
  status public.import_row_status not null,
  raw_data jsonb not null default '{}'::jsonb,
  normalized_data jsonb,
  validation_errors jsonb not null default '[]'::jsonb,
  duplicate_candidates jsonb not null default '[]'::jsonb,
  imported_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  unique (import_job_id, row_number)
);

alter table public.whatsapp_collection_messages
  add column if not exists idempotency_key text,
  add column if not exists available_at timestamptz not null default now();

update public.whatsapp_collection_messages
set idempotency_key = 'invoice-overdue:' || invoice_id::text
where idempotency_key is null;

alter table public.whatsapp_collection_messages
  alter column idempotency_key set not null;

create unique index if not exists whatsapp_collection_messages_idempotency_idx
  on public.whatsapp_collection_messages(idempotency_key);

create index if not exists import_job_rows_job_status_idx
  on public.import_job_rows(import_job_id, status, row_number);
create index if not exists import_job_rows_created_by_idx
  on public.import_job_rows(created_by);
create index if not exists import_job_rows_updated_by_idx
  on public.import_job_rows(updated_by);
create index if not exists import_jobs_updated_by_idx
  on public.import_jobs(updated_by);
create index if not exists class_memberships_class_status_idx
  on public.class_memberships(class_id, status, joined_at desc);
create index if not exists schedule_assignments_slot_active_idx
  on public.schedule_assignments(weekly_slot_id, active, start_date, end_date);
create index if not exists contracts_status_end_date_idx
  on public.contracts(status, end_date) where end_date is not null;
create index if not exists students_status_name_idx
  on public.students(status, full_name);
create index if not exists students_full_name_trgm_idx
  on public.students using gin (full_name extensions.gin_trgm_ops);
create index if not exists students_email_trgm_idx
  on public.students using gin (email extensions.gin_trgm_ops) where email is not null;
create index if not exists classes_name_trgm_idx
  on public.classes using gin (name extensions.gin_trgm_ops);

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, must_change_password)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1), 'Usuário'),
    coalesce((new.raw_user_meta_data ->> 'must_change_password')::boolean, true)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function private.assert_active_admin()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.is_active_admin() then
    raise exception 'Acesso administrativo não autorizado' using errcode = '42501';
  end if;
  return actor_id;
end;
$$;

revoke all on function private.assert_active_admin() from public, anon, authenticated;
grant execute on function private.assert_active_admin() to service_role;

create or replace function private.set_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    new.created_by = coalesce(new.created_by, actor_id);
  end if;
  new.updated_by = coalesce(actor_id, new.updated_by, new.created_by);
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'students', 'guardians', 'contracts', 'weekly_slots', 'classes',
    'schedule_assignments', 'class_memberships', 'invoices', 'payments',
    'lesson_records', 'lesson_student_notes', 'import_jobs', 'import_job_rows'
  ] loop
    execute format('drop trigger if exists set_%I_audit_fields on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_audit_fields before insert or update on public.%I for each row execute function private.set_audit_fields()',
      table_name,
      table_name
    );
  end loop;
end $$;

drop trigger if exists set_import_jobs_updated_at on public.import_jobs;
create trigger set_import_jobs_updated_at
before update on public.import_jobs
for each row execute function public.set_updated_at();

create trigger set_import_job_rows_updated_at
before update on public.import_job_rows
for each row execute function public.set_updated_at();

create or replace function private.validate_student_financial_guardian()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.financial_contact_type = 'guardian' then
    if new.financial_guardian_id is null or not exists (
      select 1
      from public.guardians g
      where g.id = new.financial_guardian_id
        and g.student_id = new.id
        and g.active
        and g.archived_at is null
    ) then
      raise exception 'O contato financeiro deve ser um responsável ativo do aluno';
    end if;
  end if;
  return new;
end;
$$;

create constraint trigger validate_student_financial_guardian
after insert or update of financial_contact_type, financial_guardian_id on public.students
deferrable initially deferred
for each row execute function private.validate_student_financial_guardian();

create or replace function private.validate_active_student_relation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_student_id uuid;
begin
  if tg_table_name = 'class_memberships' then
    target_student_id := new.student_id;
  elsif new.assignment_type = 'student' then
    target_student_id := new.student_id;
  else
    return new;
  end if;

  if (tg_table_name = 'class_memberships' and new.status = 'active')
     or (tg_table_name = 'schedule_assignments' and new.active) then
    if not exists (
      select 1 from public.students s
      where s.id = target_student_id and s.status = 'active' and s.archived_at is null
    ) then
      raise exception 'Somente alunos ativos podem receber turma ou horário';
    end if;
  end if;
  return new;
end;
$$;

create trigger validate_active_student_membership
before insert or update on public.class_memberships
for each row execute function private.validate_active_student_relation();

create trigger validate_active_student_schedule
before insert or update on public.schedule_assignments
for each row execute function private.validate_active_student_relation();

create or replace function private.invoice_due_date(reference_month date, due_day smallint)
returns date
language sql
immutable
set search_path = ''
as $$
  select (
    date_trunc('month', reference_month)::date
    + (least(
        due_day::integer,
        extract(day from (date_trunc('month', reference_month) + interval '1 month - 1 day'))::integer
      ) - 1)
  )::date;
$$;

create or replace function private.generate_contract_invoices(
  target_contract_id uuid,
  horizon_months integer default 3
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  contract_row public.contracts%rowtype;
  start_month date;
  final_month date;
  inserted_count integer := 0;
begin
  select * into contract_row
  from public.contracts
  where id = target_contract_id
  for update;

  if not found or contract_row.status <> 'active' then
    return 0;
  end if;

  if not exists (
    select 1 from public.students s
    where s.id = contract_row.student_id and s.status = 'active' and s.archived_at is null
  ) then
    return 0;
  end if;

  start_month := date_trunc('month', contract_row.billing_start_date)::date;
  final_month := case
    when contract_row.end_date is not null
      then date_trunc('month', contract_row.end_date)::date
    else (date_trunc('month', (now() at time zone 'America/Sao_Paulo')::date)
      + make_interval(months => greatest(horizon_months, 0)))::date
  end;

  if final_month < start_month then
    return 0;
  end if;

  insert into public.invoices (
    student_id,
    contract_id,
    reference_month,
    due_date,
    amount,
    status,
    origin,
    created_by,
    updated_by
  )
  select
    contract_row.student_id,
    contract_row.id,
    month_value::date,
    private.invoice_due_date(month_value::date, contract_row.due_day),
    case
      when month_value::date = start_month and contract_row.first_invoice_amount is not null
        then contract_row.first_invoice_amount
      else contract_row.monthly_amount
    end,
    'pending'::public.invoice_status,
    contract_row.origin,
    contract_row.created_by,
    contract_row.updated_by
  from generate_series(start_month::timestamp, final_month::timestamp, interval '1 month') month_value
  on conflict (contract_id, reference_month) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function private.generate_contract_invoices(uuid, integer) from public, anon, authenticated;

create or replace function public.create_contract_with_invoices(contract_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  new_id uuid;
begin
  insert into public.contracts (
    student_id, modality, weekly_frequency, contract_type, start_date,
    billing_start_date, end_date, monthly_amount, first_invoice_amount,
    due_day, status, document_storage_key, notes, origin, created_by, updated_by
  ) values (
    (contract_data ->> 'student_id')::uuid,
    contract_data ->> 'modality',
    (contract_data ->> 'weekly_frequency')::smallint,
    contract_data ->> 'contract_type',
    (contract_data ->> 'start_date')::date,
    (contract_data ->> 'billing_start_date')::date,
    nullif(contract_data ->> 'end_date', '')::date,
    (contract_data ->> 'monthly_amount')::numeric,
    nullif(contract_data ->> 'first_invoice_amount', '')::numeric,
    (contract_data ->> 'due_day')::smallint,
    'active',
    nullif(contract_data ->> 'document_storage_key', ''),
    nullif(contract_data ->> 'notes', ''),
    coalesce(nullif(contract_data ->> 'origin', '')::public.record_origin, 'manual'),
    actor_id,
    actor_id
  ) returning id into new_id;

  perform private.generate_contract_invoices(new_id, 3);
  return new_id;
end;
$$;

create or replace function public.renew_contract(current_contract_id uuid, contract_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  old_contract public.contracts%rowtype;
  new_start date := (contract_data ->> 'start_date')::date;
  new_id uuid;
begin
  select * into old_contract from public.contracts where id = current_contract_id for update;
  if not found then raise exception 'Contrato não encontrado'; end if;
  if new_start <= old_contract.start_date then raise exception 'A renovação deve começar após o contrato atual'; end if;

  update public.contracts
  set status = 'completed', end_date = new_start - 1, updated_by = actor_id
  where id = current_contract_id;

  update public.invoices
  set status = 'cancelled', updated_by = actor_id
  where contract_id = current_contract_id
    and reference_month >= date_trunc('month', new_start)::date
    and status = 'pending';

  new_id := public.create_contract_with_invoices(contract_data || jsonb_build_object('student_id', old_contract.student_id));
  return new_id;
end;
$$;

create or replace function public.cancel_contract(target_contract_id uuid, effective_date date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  contract_row public.contracts%rowtype;
begin
  select * into contract_row from public.contracts where id = target_contract_id for update;
  if not found then raise exception 'Contrato não encontrado'; end if;
  if effective_date < contract_row.start_date then raise exception 'Data efetiva anterior ao início do contrato'; end if;

  update public.contracts
  set status = 'cancelled', cancelled_at = now(), cancellation_effective_date = effective_date,
      end_date = greatest(start_date, effective_date), updated_by = actor_id
  where id = target_contract_id;

  update public.invoices
  set status = 'cancelled', updated_by = actor_id
  where contract_id = target_contract_id
    and reference_month > date_trunc('month', effective_date)::date
    and status = 'pending';
end;
$$;

create or replace function public.register_payment(
  target_invoice_id uuid,
  payment_amount numeric,
  paid_on date,
  receipt_key text default null,
  payment_notes text default null,
  payment_origin public.record_origin default 'manual'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  invoice_row public.invoices%rowtype;
  payment_id uuid;
begin
  select * into invoice_row from public.invoices where id = target_invoice_id for update;
  if not found then raise exception 'Cobrança não encontrada'; end if;
  if invoice_row.status = 'cancelled' then raise exception 'Cobrança cancelada não aceita pagamento'; end if;
  if invoice_row.status = 'paid' or exists (select 1 from public.payments where invoice_id = target_invoice_id) then
    raise exception 'Esta cobrança já foi paga';
  end if;
  if payment_amount <> invoice_row.amount then
    raise exception 'O pagamento deve quitar o valor integral da cobrança';
  end if;

  insert into public.payments (
    invoice_id, amount, payment_date, receipt_storage_key, notes, origin, created_by, updated_by
  ) values (
    target_invoice_id, payment_amount, paid_on, nullif(receipt_key, ''),
    nullif(payment_notes, ''), payment_origin, actor_id, actor_id
  ) returning id into payment_id;
  return payment_id;
end;
$$;

create or replace function public.assign_schedule(
  target_slot_id uuid,
  target_type public.assignment_type,
  target_student_id uuid,
  target_class_id uuid,
  effective_from date,
  effective_until date default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  assignment_id uuid;
begin
  if not exists (select 1 from public.weekly_slots where id = target_slot_id and active) then
    raise exception 'Horário não encontrado ou inativo';
  end if;

  insert into public.schedule_assignments (
    weekly_slot_id, assignment_type, student_id, class_id, start_date, end_date,
    active, created_by, updated_by
  ) values (
    target_slot_id, target_type, target_student_id, target_class_id, effective_from,
    effective_until, effective_until is null or effective_until >= (now() at time zone 'America/Sao_Paulo')::date,
    actor_id, actor_id
  ) returning id into assignment_id;
  return assignment_id;
end;
$$;

create or replace function public.join_class(target_class_id uuid, target_student_id uuid, joined_on date)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  membership_id uuid;
begin
  if not exists (select 1 from public.classes where id = target_class_id and status = 'active') then
    raise exception 'Turma não encontrada ou inativa';
  end if;
  insert into public.class_memberships (
    class_id, student_id, joined_at, status, created_by, updated_by
  ) values (target_class_id, target_student_id, joined_on, 'active', actor_id, actor_id)
  returning id into membership_id;
  return membership_id;
end;
$$;

create or replace function public.end_class_membership(target_membership_id uuid, left_on date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin();
begin
  update public.class_memberships
  set left_at = left_on, status = 'ended', updated_by = actor_id
  where id = target_membership_id and status = 'active';
  if not found then raise exception 'Participação ativa não encontrada'; end if;
end;
$$;

create or replace function public.record_individual_lesson(lesson_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin(); lesson_id uuid;
begin
  insert into public.lesson_records (
    lesson_date, student_id, lesson_name, content, observations, lesson_report, homework,
    origin, created_by, updated_by
  ) values (
    (lesson_data ->> 'lesson_date')::date,
    (lesson_data ->> 'student_id')::uuid,
    nullif(lesson_data ->> 'lesson_name', ''),
    nullif(lesson_data ->> 'content', ''),
    nullif(lesson_data ->> 'observations', ''),
    nullif(lesson_data ->> 'lesson_report', ''),
    nullif(lesson_data ->> 'homework', ''),
    coalesce(nullif(lesson_data ->> 'origin', '')::public.record_origin, 'manual'),
    actor_id, actor_id
  ) returning id into lesson_id;
  return lesson_id;
end;
$$;

create or replace function public.record_class_lesson(lesson_data jsonb, student_notes jsonb default '[]'::jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin(); lesson_id uuid;
begin
  insert into public.lesson_records (
    lesson_date, class_id, lesson_name, content, observations, lesson_report, homework,
    origin, created_by, updated_by
  ) values (
    (lesson_data ->> 'lesson_date')::date,
    (lesson_data ->> 'class_id')::uuid,
    nullif(lesson_data ->> 'lesson_name', ''),
    nullif(lesson_data ->> 'content', ''),
    nullif(lesson_data ->> 'observations', ''),
    nullif(lesson_data ->> 'lesson_report', ''),
    nullif(lesson_data ->> 'homework', ''),
    coalesce(nullif(lesson_data ->> 'origin', '')::public.record_origin, 'manual'),
    actor_id, actor_id
  ) returning id into lesson_id;

  insert into public.lesson_student_notes (
    lesson_record_id, student_id, individual_report, observations, homework, created_by, updated_by
  )
  select lesson_id, note.student_id, nullif(note.individual_report, ''),
         nullif(note.observations, ''), nullif(note.homework, ''), actor_id, actor_id
  from jsonb_to_recordset(student_notes) as note(
    student_id uuid, individual_report text, observations text, homework text
  )
  where exists (
    select 1 from public.class_memberships membership
    where membership.class_id = (lesson_data ->> 'class_id')::uuid
      and membership.student_id = note.student_id
      and membership.joined_at <= (lesson_data ->> 'lesson_date')::date
      and (membership.left_at is null or membership.left_at >= (lesson_data ->> 'lesson_date')::date)
  );
  return lesson_id;
end;
$$;

create or replace function public.cancel_student(target_student_id uuid, effective_date date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin();
begin
  perform 1 from public.students where id = target_student_id for update;
  if not found then raise exception 'Aluno não encontrado'; end if;

  update public.students
  set status = 'cancelled', cancelled_at = now(), cancellation_effective_date = effective_date,
      updated_by = actor_id
  where id = target_student_id;

  update public.contracts
  set status = 'cancelled', cancelled_at = now(), cancellation_effective_date = effective_date,
      end_date = greatest(start_date, effective_date), updated_by = actor_id
  where student_id = target_student_id and status = 'active';

  update public.class_memberships
  set status = 'ended', left_at = greatest(joined_at, effective_date), updated_by = actor_id
  where student_id = target_student_id and status = 'active';

  update public.schedule_assignments
  set active = false, end_date = greatest(start_date, effective_date), updated_by = actor_id
  where student_id = target_student_id and active;

  update public.invoices
  set status = 'cancelled', updated_by = actor_id
  where student_id = target_student_id
    and reference_month > date_trunc('month', effective_date)::date
    and status = 'pending';
end;
$$;

create or replace function public.complete_password_change()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin();
begin
  update public.profiles set must_change_password = false where id = actor_id;
end;
$$;

create or replace function private.process_finance_automation()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  business_today date := (now() at time zone 'America/Sao_Paulo')::date;
  overdue_count integer := 0;
  message_count integer := 0;
  invoice_count integer := 0;
  generated_count integer;
  contract_row record;
begin
  update public.invoices invoice
  set status = 'overdue', updated_at = now()
  where invoice.status = 'pending'
    and invoice.due_date < business_today
    and exists (
      select 1 from public.students student
      where student.id = invoice.student_id and student.status = 'active'
    );
  get diagnostics overdue_count = row_count;

  for contract_row in
    select id from public.contracts where status = 'active' and end_date is null
  loop
    generated_count := private.generate_contract_invoices(contract_row.id, 3);
    invoice_count := invoice_count + generated_count;
  end loop;

  insert into public.whatsapp_collection_messages (
    invoice_id, recipient_type, recipient_phone, message_snapshot,
    status, idempotency_key, available_at
  )
  select
    invoice.id,
    student.financial_contact_type,
    case when student.financial_contact_type = 'guardian' then guardian.whatsapp else student.whatsapp end,
    format(
      'Olá, %s. A mensalidade de %s, no valor de %s, está aguardando regularização. Esta mensagem ficará pendente até a integração do WhatsApp ser ativada.',
      case when student.financial_contact_type = 'guardian' then guardian.full_name else student.full_name end,
      to_char(invoice.reference_month, 'MM/YYYY'),
      to_char(invoice.amount, 'FM999G999G990D00')
    ),
    'pending',
    'invoice-overdue:' || invoice.id::text,
    now()
  from public.invoices invoice
  join public.students student on student.id = invoice.student_id
  left join public.guardians guardian
    on guardian.id = student.financial_guardian_id and guardian.active and guardian.archived_at is null
  where invoice.status = 'overdue'
    and student.status = 'active'
    and (
      (student.financial_contact_type = 'student' and student.whatsapp is not null)
      or (student.financial_contact_type = 'guardian' and guardian.whatsapp is not null)
    )
  on conflict (invoice_id) do nothing;
  get diagnostics message_count = row_count;

  return jsonb_build_object(
    'business_date', business_today,
    'overdue_invoices', overdue_count,
    'generated_invoices', invoice_count,
    'queued_messages', message_count
  );
end;
$$;

create or replace function public.run_finance_automation()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.assert_active_admin();
  return private.process_finance_automation();
end;
$$;

revoke all on function public.create_contract_with_invoices(jsonb) from public, anon;
revoke all on function public.renew_contract(uuid, jsonb) from public, anon;
revoke all on function public.cancel_contract(uuid, date) from public, anon;
revoke all on function public.register_payment(uuid, numeric, date, text, text, public.record_origin) from public, anon;
revoke all on function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) from public, anon;
revoke all on function public.join_class(uuid, uuid, date) from public, anon;
revoke all on function public.end_class_membership(uuid, date) from public, anon;
revoke all on function public.record_individual_lesson(jsonb) from public, anon;
revoke all on function public.record_class_lesson(jsonb, jsonb) from public, anon;
revoke all on function public.cancel_student(uuid, date) from public, anon;
revoke all on function public.complete_password_change() from public, anon;
revoke all on function public.run_finance_automation() from public, anon;

grant execute on function public.create_contract_with_invoices(jsonb) to authenticated;
grant execute on function public.renew_contract(uuid, jsonb) to authenticated;
grant execute on function public.cancel_contract(uuid, date) to authenticated;
grant execute on function public.register_payment(uuid, numeric, date, text, text, public.record_origin) to authenticated;
grant execute on function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) to authenticated;
grant execute on function public.join_class(uuid, uuid, date) to authenticated;
grant execute on function public.end_class_membership(uuid, date) to authenticated;
grant execute on function public.record_individual_lesson(jsonb) to authenticated;
grant execute on function public.record_class_lesson(jsonb, jsonb) to authenticated;
grant execute on function public.cancel_student(uuid, date) to authenticated;
grant execute on function public.complete_password_change() to authenticated;
grant execute on function public.run_finance_automation() to authenticated;

alter table public.import_job_rows enable row level security;

create policy import_job_rows_select on public.import_job_rows
for select to authenticated using ((select private.is_active_admin()));
create policy import_job_rows_insert on public.import_job_rows
for insert to authenticated with check ((select private.is_active_admin()));
create policy import_job_rows_update on public.import_job_rows
for update to authenticated using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imports', 'imports', false, 10485760, array['text/csv', 'application/csv', 'text/plain'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists internal_files_select on storage.objects;
drop policy if exists internal_files_insert on storage.objects;
drop policy if exists internal_files_update on storage.objects;

create policy internal_files_select on storage.objects
for select to authenticated
using (bucket_id in ('contracts', 'payment-receipts', 'imports') and (select private.is_active_admin()));

create policy internal_files_insert on storage.objects
for insert to authenticated
with check (bucket_id in ('contracts', 'payment-receipts', 'imports') and (select private.is_active_admin()));

create policy internal_files_update on storage.objects
for update to authenticated
using (bucket_id in ('contracts', 'payment-receipts', 'imports') and (select private.is_active_admin()))
with check (bucket_id in ('contracts', 'payment-receipts', 'imports') and (select private.is_active_admin()));

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'english-for-all-finance-hourly' limit 1;
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'english-for-all-finance-hourly',
    '5 * * * *',
    'select private.process_finance_automation();'
  );
end $$;

commit;
