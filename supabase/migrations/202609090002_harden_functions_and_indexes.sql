begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

alter function public.handle_new_auth_user() set schema private;
alter function public.is_active_admin() set schema private;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;
revoke all on function private.is_active_admin() from public, anon;
grant execute on function private.is_active_admin() to authenticated, service_role;

create index students_financial_guardian_owner_idx on public.students(financial_guardian_id, id);
create index students_created_by_idx on public.students(created_by);
create index students_updated_by_idx on public.students(updated_by);
create index guardians_created_by_idx on public.guardians(created_by);
create index guardians_updated_by_idx on public.guardians(updated_by);
create index contracts_created_by_idx on public.contracts(created_by);
create index contracts_updated_by_idx on public.contracts(updated_by);
create index weekly_slots_created_by_idx on public.weekly_slots(created_by);
create index weekly_slots_updated_by_idx on public.weekly_slots(updated_by);
create index classes_created_by_idx on public.classes(created_by);
create index classes_updated_by_idx on public.classes(updated_by);
create index schedule_assignments_created_by_idx on public.schedule_assignments(created_by);
create index schedule_assignments_updated_by_idx on public.schedule_assignments(updated_by);
create index class_memberships_created_by_idx on public.class_memberships(created_by);
create index class_memberships_updated_by_idx on public.class_memberships(updated_by);
create index invoices_created_by_idx on public.invoices(created_by);
create index invoices_updated_by_idx on public.invoices(updated_by);
create index payments_created_by_idx on public.payments(created_by);
create index payments_updated_by_idx on public.payments(updated_by);
create index lesson_records_created_by_idx on public.lesson_records(created_by);
create index lesson_records_updated_by_idx on public.lesson_records(updated_by);
create index lesson_student_notes_created_by_idx on public.lesson_student_notes(created_by);
create index lesson_student_notes_updated_by_idx on public.lesson_student_notes(updated_by);
create index import_jobs_created_by_idx on public.import_jobs(created_by);

commit;
