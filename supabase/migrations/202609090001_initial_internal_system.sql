begin;

create extension if not exists btree_gist with schema extensions;

create type public.internal_role as enum ('admin');
create type public.student_status as enum ('active', 'inactive', 'cancelled');
create type public.financial_contact_type as enum ('student', 'guardian');
create type public.contract_status as enum ('active', 'completed', 'cancelled');
create type public.assignment_type as enum ('student', 'class');
create type public.class_status as enum ('active', 'inactive');
create type public.membership_status as enum ('active', 'ended');
create type public.invoice_status as enum ('pending', 'overdue', 'paid', 'cancelled');
create type public.message_status as enum ('pending', 'processing', 'sent', 'failed');
create type public.import_module as enum ('students', 'contracts', 'schedule', 'finance', 'planner', 'classes');
create type public.import_status as enum ('processing', 'awaiting_confirmation', 'completed', 'failed');
create type public.record_origin as enum ('manual', 'import');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  role public.internal_role not null default 'admin',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1), 'Usuário')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and active and role = 'admin'
  );
$$;

create table public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 150),
  birth_date date,
  email text,
  whatsapp text not null check (char_length(whatsapp) between 8 and 30),
  status public.student_status not null default 'active',
  financial_contact_type public.financial_contact_type not null default 'student',
  financial_guardian_id uuid,
  administrative_notes text,
  origin public.record_origin not null default 'manual',
  cancelled_at timestamptz,
  cancellation_effective_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  unique (id, financial_guardian_id),
  check (
    (financial_contact_type = 'student' and financial_guardian_id is null)
    or financial_contact_type = 'guardian'
  ),
  check ((status = 'cancelled') = (cancellation_effective_date is not null))
);

create table public.guardians (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  full_name text not null check (char_length(full_name) between 1 and 150),
  email text,
  whatsapp text not null check (char_length(whatsapp) between 8 and 30),
  relationship text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  unique (id, student_id)
);

alter table public.students
  add constraint students_financial_guardian_owner_fk
  foreign key (financial_guardian_id, id)
  references public.guardians(id, student_id)
  deferrable initially deferred;

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  modality text not null check (char_length(modality) between 1 and 50),
  weekly_frequency smallint not null check (weekly_frequency between 1 and 7),
  contract_type text not null check (char_length(contract_type) between 1 and 50),
  start_date date not null,
  billing_start_date date not null,
  end_date date,
  monthly_amount numeric(12,2) not null check (monthly_amount >= 0),
  first_invoice_amount numeric(12,2) check (first_invoice_amount >= 0),
  due_day smallint not null check (due_day between 1 and 31),
  status public.contract_status not null default 'active',
  document_storage_key text,
  notes text,
  cancelled_at timestamptz,
  cancellation_effective_date date,
  origin public.record_origin not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  check (end_date is null or end_date >= start_date),
  check (billing_start_date >= start_date),
  check (end_date is null or billing_start_date <= end_date),
  check ((status = 'cancelled') = (cancellation_effective_date is not null)),
  exclude using gist (
    student_id with =,
    daterange(start_date, coalesce(end_date, 'infinity'::date), '[]') with &&
  ) where (status = 'active')
);

create table public.weekly_slots (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null,
  start_minute integer generated always as ((extract(epoch from start_time) / 60)::integer) stored,
  end_minute integer generated always as ((extract(epoch from end_time) / 60)::integer) stored,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  check (end_time > start_time),
  exclude using gist (
    weekday with =,
    int4range(start_minute, end_minute, '[)') with &&
  ) where (active)
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  status public.class_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz
);

create table public.schedule_assignments (
  id uuid primary key default gen_random_uuid(),
  weekly_slot_id uuid not null references public.weekly_slots(id),
  assignment_type public.assignment_type not null,
  student_id uuid references public.students(id),
  class_id uuid references public.classes(id),
  start_date date not null,
  end_date date,
  active boolean not null default true,
  active_period daterange generated always as (daterange(start_date, coalesce(end_date, 'infinity'::date), '[]')) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  check (end_date is null or end_date >= start_date),
  check (
    (assignment_type = 'student' and student_id is not null and class_id is null)
    or (assignment_type = 'class' and class_id is not null and student_id is null)
  ),
  exclude using gist (weekly_slot_id with =, active_period with &&) where (active)
);

create table public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id),
  student_id uuid not null references public.students(id),
  joined_at date not null,
  left_at date,
  status public.membership_status not null default 'active',
  active_period daterange generated always as (daterange(joined_at, coalesce(left_at, 'infinity'::date), '[]')) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  check (left_at is null or left_at >= joined_at),
  check ((status = 'active') = (left_at is null)),
  exclude using gist (class_id with =, student_id with =, active_period with &&)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  contract_id uuid not null references public.contracts(id),
  reference_month date not null check (reference_month = date_trunc('month', reference_month)::date),
  due_date date not null,
  amount numeric(12,2) not null check (amount >= 0),
  status public.invoice_status not null default 'pending',
  origin public.record_origin not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  unique (contract_id, reference_month)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null unique references public.invoices(id),
  amount numeric(12,2) not null check (amount >= 0),
  payment_date date not null,
  receipt_storage_key text,
  notes text,
  origin public.record_origin not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

create function public.validate_payment()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_amount numeric(12,2);
  target_status public.invoice_status;
begin
  select amount, status into target_amount, target_status
  from public.invoices where id = new.invoice_id for update;
  if not found then raise exception 'Cobrança não encontrada'; end if;
  if target_status = 'cancelled' then raise exception 'Cobrança cancelada não aceita pagamento'; end if;
  if new.amount <> target_amount then raise exception 'O pagamento deve quitar o valor integral da cobrança'; end if;
  return new;
end;
$$;

create trigger validate_payment_before_write
before insert or update on public.payments
for each row execute function public.validate_payment();

create function public.sync_invoice_payment_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.invoices set status = 'paid', updated_at = now(), updated_by = new.updated_by
  where id = new.invoice_id;
  return new;
end;
$$;

create trigger sync_invoice_after_payment
after insert on public.payments
for each row execute function public.sync_invoice_payment_status();

create table public.whatsapp_collection_messages (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null unique references public.invoices(id),
  recipient_type public.financial_contact_type not null,
  recipient_phone text not null,
  message_snapshot text not null,
  status public.message_status not null default 'pending',
  attempt_count integer not null default 0 check (attempt_count >= 0),
  provider_message_id text,
  sent_at timestamptz,
  last_attempt_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_records (
  id uuid primary key default gen_random_uuid(),
  lesson_date date not null,
  class_id uuid references public.classes(id),
  student_id uuid references public.students(id),
  lesson_name text check (lesson_name is null or char_length(lesson_name) <= 150),
  content text,
  observations text,
  lesson_report text,
  homework text,
  origin public.record_origin not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  check (num_nonnulls(class_id, student_id) = 1)
);

create table public.lesson_student_notes (
  id uuid primary key default gen_random_uuid(),
  lesson_record_id uuid not null references public.lesson_records(id),
  student_id uuid not null references public.students(id),
  individual_report text,
  observations text,
  homework text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  archived_at timestamptz,
  unique (lesson_record_id, student_id)
);

create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  module public.import_module not null,
  file_name text not null,
  status public.import_status not null default 'processing',
  total_rows integer not null default 0 check (total_rows >= 0),
  valid_rows integer not null default 0 check (valid_rows >= 0),
  invalid_rows integer not null default 0 check (invalid_rows >= 0),
  imported_rows integer not null default 0 check (imported_rows >= 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  check (valid_rows + invalid_rows <= total_rows),
  check (imported_rows <= valid_rows)
);

create index guardians_student_id_idx on public.guardians(student_id);
create index contracts_student_id_idx on public.contracts(student_id);
create index schedule_assignments_student_id_idx on public.schedule_assignments(student_id) where student_id is not null;
create index schedule_assignments_class_id_idx on public.schedule_assignments(class_id) where class_id is not null;
create index class_memberships_student_id_idx on public.class_memberships(student_id);
create index invoices_student_reference_idx on public.invoices(student_id, reference_month desc);
create index invoices_status_due_date_idx on public.invoices(status, due_date);
create index lesson_records_student_date_idx on public.lesson_records(student_id, lesson_date desc) where student_id is not null;
create index lesson_records_class_date_idx on public.lesson_records(class_id, lesson_date desc) where class_id is not null;
create index lesson_student_notes_student_id_idx on public.lesson_student_notes(student_id);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles', 'students', 'guardians', 'contracts', 'weekly_slots', 'classes',
    'schedule_assignments', 'class_memberships', 'invoices', 'payments',
    'whatsapp_collection_messages', 'lesson_records', 'lesson_student_notes', 'import_jobs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create policy %I on public.%I for select to authenticated using ((select public.is_active_admin()))', table_name || '_select', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select public.is_active_admin()))', table_name || '_insert', table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select public.is_active_admin())) with check ((select public.is_active_admin()))', table_name || '_update', table_name);
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles', 'students', 'guardians', 'contracts', 'weekly_slots', 'classes',
    'schedule_assignments', 'class_memberships', 'invoices', 'payments',
    'whatsapp_collection_messages', 'lesson_records', 'lesson_student_notes'
  ] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('contracts', 'contracts', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']),
  ('payment-receipts', 'payment-receipts', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy internal_files_select on storage.objects
for select to authenticated
using (bucket_id in ('contracts', 'payment-receipts') and (select public.is_active_admin()));

create policy internal_files_insert on storage.objects
for insert to authenticated
with check (bucket_id in ('contracts', 'payment-receipts') and (select public.is_active_admin()));

create policy internal_files_update on storage.objects
for update to authenticated
using (bucket_id in ('contracts', 'payment-receipts') and (select public.is_active_admin()))
with check (bucket_id in ('contracts', 'payment-receipts') and (select public.is_active_admin()));

commit;
