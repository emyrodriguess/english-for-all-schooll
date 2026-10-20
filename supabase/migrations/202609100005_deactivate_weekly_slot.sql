begin;

create or replace function public.deactivate_weekly_slot(
  target_slot_id uuid,
  effective_on date
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin();
begin
  update public.weekly_slots
  set active = false, updated_by = actor_id
  where id = target_slot_id and active;

  if not found then
    raise exception 'Horário ativo não encontrado';
  end if;

  update public.schedule_assignments
  set
    active = false,
    end_date = greatest(start_date, effective_on),
    updated_by = actor_id
  where weekly_slot_id = target_slot_id and active;
end;
$$;

revoke all on function public.deactivate_weekly_slot(uuid, date) from public, anon;
grant execute on function public.deactivate_weekly_slot(uuid, date) to authenticated;

commit;
