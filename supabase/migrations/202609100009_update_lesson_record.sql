begin;

create or replace function public.update_lesson_record(
  lesson_data jsonb,
  student_notes jsonb default '[]'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := private.assert_active_admin();
  record_id uuid := (lesson_data ->> 'record_id')::uuid;
  note record;
begin
  update public.lesson_records
  set
    lesson_date = (lesson_data ->> 'lesson_date')::date,
    lesson_name = nullif(lesson_data ->> 'lesson_name', ''),
    content = nullif(lesson_data ->> 'content', ''),
    observations = nullif(lesson_data ->> 'observations', ''),
    lesson_report = nullif(lesson_data ->> 'lesson_report', ''),
    homework = nullif(lesson_data ->> 'homework', ''),
    updated_by = actor_id
  where id = record_id and archived_at is null;

  if not found then
    raise exception 'Registro pedagógico não encontrado';
  end if;

  for note in
    select * from jsonb_to_recordset(coalesce(student_notes, '[]'::jsonb)) as value(
      id uuid,
      individual_report text,
      observations text,
      homework text
    )
  loop
    update public.lesson_student_notes
    set
      individual_report = nullif(note.individual_report, ''),
      observations = nullif(note.observations, ''),
      homework = nullif(note.homework, ''),
      updated_by = actor_id
    where id = note.id and lesson_record_id = record_id;
  end loop;
end;
$$;

revoke all on function public.update_lesson_record(jsonb, jsonb) from public, anon;
grant execute on function public.update_lesson_record(jsonb, jsonb) to authenticated;

commit;
