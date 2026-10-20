begin;

-- The trigger is shared by tables with different row shapes. Accessing a
-- field belonging to the other table raises "record new has no field".
create or replace function private.validate_active_student_relation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_student_id uuid;
begin
  if tg_table_name = 'class_memberships' then
    if new.status <> 'active' then
      return new;
    end if;
    target_student_id := new.student_id;
  elsif tg_table_name = 'schedule_assignments' then
    if not new.active or new.assignment_type <> 'student' then
      return new;
    end if;
    target_student_id := new.student_id;
  else
    return new;
  end if;

  if not exists (
    select 1 from public.students s
    where s.id = target_student_id and s.status = 'active' and s.archived_at is null
  ) then
    raise exception 'Somente alunos ativos podem receber turma ou horário';
  end if;

  return new;
end;
$$;

-- These mutations must be able to write all related private records as one
-- operation. They still authenticate the caller with assert_active_admin(),
-- while SECURITY DEFINER keeps RLS from denying their own insert after the
-- caller has already been authorized.
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
  if effective_until is not null and effective_until < effective_from then
    raise exception 'A data final não pode ser anterior à data inicial';
  end if;

  if not exists (
    select 1 from public.weekly_slots
    where id = target_slot_id and active and archived_at is null
  ) then
    raise exception 'Horário não encontrado ou inativo';
  end if;

  if target_type = 'student' then
    if target_student_id is null or target_class_id is not null then
      raise exception 'Selecione exatamente um aluno para esta ocupação';
    end if;
    if not exists (
      select 1 from public.students
      where id = target_student_id and status = 'active' and archived_at is null
    ) then
      raise exception 'Somente alunos ativos podem receber turma ou horário';
    end if;
  elsif target_type = 'class' then
    if target_class_id is null or target_student_id is not null then
      raise exception 'Selecione exatamente uma turma para esta ocupação';
    end if;
    if not exists (
      select 1 from public.classes
      where id = target_class_id and status = 'active' and archived_at is null
    ) then
      raise exception 'Turma não encontrada ou inativa';
    end if;
  else
    raise exception 'Tipo de ocupação inválido';
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

create or replace function public.join_class(
  target_class_id uuid,
  target_student_id uuid,
  joined_on date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  membership_id uuid;
begin
  if not exists (
    select 1 from public.classes
    where id = target_class_id and status = 'active' and archived_at is null
  ) then
    raise exception 'Turma não encontrada ou inativa';
  end if;

  if not exists (
    select 1 from public.students
    where id = target_student_id and status = 'active' and archived_at is null
  ) then
    raise exception 'Somente alunos ativos podem receber turma ou horário';
  end if;

  if exists (
    select 1 from public.class_memberships
    where class_id = target_class_id
      and student_id = target_student_id
      and status = 'active'
  ) then
    raise exception 'O aluno já participa desta turma';
  end if;

  insert into public.class_memberships (
    class_id, student_id, joined_at, status, created_by, updated_by
  ) values (
    target_class_id, target_student_id, joined_on, 'active', actor_id, actor_id
  ) returning id into membership_id;

  return membership_id;
end;
$$;

revoke all on function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) from public, anon;
revoke all on function public.join_class(uuid, uuid, date) from public, anon;
grant execute on function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) to authenticated;
grant execute on function public.join_class(uuid, uuid, date) to authenticated;

commit;
