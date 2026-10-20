begin;

create or replace function public.release_schedule_assignment(
  target_assignment_id uuid,
  effective_on date
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare actor_id uuid := private.assert_active_admin();
begin
  update public.schedule_assignments
  set
    active = false,
    end_date = greatest(start_date, effective_on),
    updated_by = actor_id
  where id = target_assignment_id and active;

  if not found then
    raise exception 'Ocupação ativa não encontrada';
  end if;
end;
$$;

revoke all on function public.release_schedule_assignment(uuid, date) from public, anon;
grant execute on function public.release_schedule_assignment(uuid, date) to authenticated;

commit;
