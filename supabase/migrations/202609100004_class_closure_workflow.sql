begin;

create or replace function public.end_class(target_class_id uuid, effective_date date)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin();
begin
  update public.classes set status = 'inactive', updated_by = actor_id
  where id = target_class_id and status = 'active';
  if not found then raise exception 'Turma ativa não encontrada'; end if;

  update public.class_memberships
  set status = 'ended', left_at = greatest(joined_at, effective_date), updated_by = actor_id
  where class_id = target_class_id and status = 'active';

  update public.schedule_assignments
  set active = false, end_date = greatest(start_date, effective_date), updated_by = actor_id
  where class_id = target_class_id and active;
end;
$$;

revoke all on function public.end_class(uuid, date) from public, anon;
grant execute on function public.end_class(uuid, date) to authenticated;

commit;
