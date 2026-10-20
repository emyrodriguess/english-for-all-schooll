begin;

-- Public RPCs are the only supported mutation boundary. Each function already
-- starts by calling private.assert_active_admin() and pins search_path to an
-- empty value; SECURITY DEFINER lets that check run before privileged writes.
alter function public.create_student_with_guardian(jsonb, jsonb) security definer;
alter function public.create_contract_with_invoices(jsonb) security definer;
alter function public.renew_contract(uuid, jsonb) security definer;
alter function public.cancel_contract(uuid, date) security definer;
alter function public.register_payment(uuid, numeric, date, text, text, public.record_origin) security definer;
alter function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) security definer;
alter function public.join_class(uuid, uuid, date) security definer;
alter function public.end_class_membership(uuid, date) security definer;
alter function public.end_class(uuid, date) security definer;
alter function public.deactivate_weekly_slot(uuid, date) security definer;
alter function public.release_schedule_assignment(uuid, date) security definer;
alter function public.import_schedule_row(jsonb) security definer;
alter function public.record_individual_lesson(jsonb) security definer;
alter function public.record_class_lesson(jsonb, jsonb) security definer;
alter function public.update_lesson_record(jsonb, jsonb) security definer;
alter function public.cancel_student(uuid, date) security definer;
alter function public.complete_password_change() security definer;
alter function public.run_finance_automation() security definer;

-- Prevent authenticated users from invoking privileged helpers directly.
-- is_active_admin remains executable because RLS policies evaluate it for the
-- requesting role; the private schema itself is not discoverable by that role.
revoke all on schema private from public, anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_active_admin() to authenticated, service_role;

revoke all on function public.create_student_with_guardian(jsonb, jsonb) from public, anon;
revoke all on function public.create_contract_with_invoices(jsonb) from public, anon;
revoke all on function public.renew_contract(uuid, jsonb) from public, anon;
revoke all on function public.cancel_contract(uuid, date) from public, anon;
revoke all on function public.register_payment(uuid, numeric, date, text, text, public.record_origin) from public, anon;
revoke all on function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) from public, anon;
revoke all on function public.join_class(uuid, uuid, date) from public, anon;
revoke all on function public.end_class_membership(uuid, date) from public, anon;
revoke all on function public.end_class(uuid, date) from public, anon;
revoke all on function public.deactivate_weekly_slot(uuid, date) from public, anon;
revoke all on function public.release_schedule_assignment(uuid, date) from public, anon;
revoke all on function public.import_schedule_row(jsonb) from public, anon;
revoke all on function public.record_individual_lesson(jsonb) from public, anon;
revoke all on function public.record_class_lesson(jsonb, jsonb) from public, anon;
revoke all on function public.update_lesson_record(jsonb, jsonb) from public, anon;
revoke all on function public.cancel_student(uuid, date) from public, anon;
revoke all on function public.complete_password_change() from public, anon;
revoke all on function public.run_finance_automation() from public, anon;

grant execute on function public.create_student_with_guardian(jsonb, jsonb) to authenticated;
grant execute on function public.create_contract_with_invoices(jsonb) to authenticated;
grant execute on function public.renew_contract(uuid, jsonb) to authenticated;
grant execute on function public.cancel_contract(uuid, date) to authenticated;
grant execute on function public.register_payment(uuid, numeric, date, text, text, public.record_origin) to authenticated;
grant execute on function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) to authenticated;
grant execute on function public.join_class(uuid, uuid, date) to authenticated;
grant execute on function public.end_class_membership(uuid, date) to authenticated;
grant execute on function public.end_class(uuid, date) to authenticated;
grant execute on function public.deactivate_weekly_slot(uuid, date) to authenticated;
grant execute on function public.release_schedule_assignment(uuid, date) to authenticated;
grant execute on function public.import_schedule_row(jsonb) to authenticated;
grant execute on function public.record_individual_lesson(jsonb) to authenticated;
grant execute on function public.record_class_lesson(jsonb, jsonb) to authenticated;
grant execute on function public.update_lesson_record(jsonb, jsonb) to authenticated;
grant execute on function public.cancel_student(uuid, date) to authenticated;
grant execute on function public.complete_password_change() to authenticated;
grant execute on function public.run_finance_automation() to authenticated;

commit;
