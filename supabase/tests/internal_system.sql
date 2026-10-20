begin;

do $$
declare
  private_tables text[] := array[
    'profiles', 'students', 'guardians', 'contracts', 'weekly_slots',
    'schedule_assignments', 'classes', 'class_memberships', 'invoices',
    'payments', 'whatsapp_collection_messages', 'lesson_records',
    'lesson_student_notes', 'import_jobs', 'import_job_rows'
  ];
  table_name text;
  active_default text;
begin
  foreach table_name in array private_tables loop
    if not exists (
      select 1 from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = table_name and c.relrowsecurity
    ) then
      raise exception 'RLS ausente em public.%', table_name;
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = table_name
    ) then
      raise exception 'Policy ausente em public.%', table_name;
    end if;
  end loop;

  select pg_get_expr(d.adbin, d.adrelid)
  into active_default
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
  join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
  where n.nspname = 'public' and c.relname = 'profiles' and a.attname = 'active';

  if active_default is distinct from 'false' then
    raise exception 'Novos perfis precisam nascer inativos';
  end if;

  if exists (
    select 1 from storage.buckets
    where id in ('contracts', 'payment-receipts', 'imports') and public
  ) then
    raise exception 'Buckets internos não podem ser públicos';
  end if;

  if not has_function_privilege('authenticated', 'private.is_active_admin()', 'execute') then
    raise exception 'A função de RLS precisa permanecer disponível para authenticated';
  end if;

  if exists (
    select 1
    from pg_proc procedure
    join pg_namespace namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'private'
      and procedure.proname <> 'is_active_admin'
      and has_function_privilege('authenticated', procedure.oid, 'execute')
  ) then
    raise exception 'Somente a função de RLS pode ser executada por authenticated no schema private';
  end if;

  if exists (
    select 1
    from pg_proc procedure
    join pg_namespace namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.proname in (
        'create_student_with_guardian', 'create_contract_with_invoices',
        'renew_contract', 'cancel_contract', 'register_payment',
        'assign_schedule', 'join_class', 'end_class_membership', 'end_class',
        'deactivate_weekly_slot', 'release_schedule_assignment',
        'import_schedule_row', 'record_individual_lesson',
        'record_class_lesson', 'update_lesson_record', 'cancel_student',
        'complete_password_change', 'run_finance_automation'
      )
      and not procedure.prosecdef
  ) then
    raise exception 'Toda RPC mutável do backoffice deve executar como SECURITY DEFINER';
  end if;

  if private.invoice_due_date(date '2026-02-01', 31::smallint) <> date '2026-02-28' then
    raise exception 'Cálculo do último dia do mês está incorreto';
  end if;

  if not exists (
    select 1 from cron.job
    where jobname = 'english-for-all-finance-hourly' and active
  ) then
    raise exception 'Automação financeira não está ativa';
  end if;
end;
$$;

rollback;
