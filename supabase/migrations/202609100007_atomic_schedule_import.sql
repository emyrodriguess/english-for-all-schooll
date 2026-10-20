begin;

create or replace function public.import_schedule_row(row_data jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  slot_id uuid;
  assignment_kind public.assignment_type := nullif(row_data ->> 'assignment_type', '')::public.assignment_type;
begin
  insert into public.weekly_slots (
    weekday, start_time, end_time, created_by, updated_by
  ) values (
    (row_data ->> 'weekday')::smallint,
    (row_data ->> 'start_time')::time,
    (row_data ->> 'end_time')::time,
    actor_id,
    actor_id
  ) returning id into slot_id;

  if assignment_kind is not null then
    perform public.assign_schedule(
      slot_id,
      assignment_kind,
      case when assignment_kind = 'student' then (row_data ->> 'target_id')::uuid else null end,
      case when assignment_kind = 'class' then (row_data ->> 'target_id')::uuid else null end,
      (row_data ->> 'start_date')::date,
      nullif(row_data ->> 'end_date', '')::date
    );
  end if;

  return slot_id;
end;
$$;

revoke all on function public.import_schedule_row(jsonb) from public, anon;
grant execute on function public.import_schedule_row(jsonb) to authenticated;

commit;
