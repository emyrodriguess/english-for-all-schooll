begin;

create or replace function public.create_student_with_guardian(
  student_data jsonb,
  guardian_data jsonb default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  student_id uuid;
  guardian_id uuid;
  contact_type public.financial_contact_type := coalesce(
    nullif(student_data ->> 'financial_contact_type', '')::public.financial_contact_type,
    'student'
  );
begin
  insert into public.students (
    full_name, birth_date, email, whatsapp, status, financial_contact_type,
    administrative_notes, origin, created_by, updated_by
  ) values (
    student_data ->> 'full_name',
    nullif(student_data ->> 'birth_date', '')::date,
    nullif(student_data ->> 'email', ''),
    student_data ->> 'whatsapp',
    coalesce(nullif(student_data ->> 'status', '')::public.student_status, 'active'),
    'student',
    nullif(student_data ->> 'administrative_notes', ''),
    coalesce(nullif(student_data ->> 'origin', '')::public.record_origin, 'manual'),
    actor_id,
    actor_id
  ) returning id into student_id;

  if guardian_data is not null and guardian_data <> 'null'::jsonb then
    insert into public.guardians (
      student_id, full_name, email, whatsapp, relationship, active, created_by, updated_by
    ) values (
      student_id,
      guardian_data ->> 'full_name',
      nullif(guardian_data ->> 'email', ''),
      guardian_data ->> 'whatsapp',
      nullif(guardian_data ->> 'relationship', ''),
      true,
      actor_id,
      actor_id
    ) returning id into guardian_id;
  end if;

  if contact_type = 'guardian' then
    if guardian_id is null then raise exception 'Informe o responsável financeiro'; end if;
    update public.students
    set financial_contact_type = 'guardian', financial_guardian_id = guardian_id, updated_by = actor_id
    where id = student_id;
  end if;

  return student_id;
end;
$$;

revoke all on function public.create_student_with_guardian(jsonb, jsonb) from public, anon;
grant execute on function public.create_student_with_guardian(jsonb, jsonb) to authenticated;

commit;
