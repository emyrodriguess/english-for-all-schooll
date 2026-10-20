begin;

alter function public.create_contract_with_invoices(jsonb) security invoker;
alter function public.renew_contract(uuid, jsonb) security invoker;
alter function public.cancel_contract(uuid, date) security invoker;
alter function public.register_payment(uuid, numeric, date, text, text, public.record_origin) security invoker;
alter function public.assign_schedule(uuid, public.assignment_type, uuid, uuid, date, date) security invoker;
alter function public.join_class(uuid, uuid, date) security invoker;
alter function public.end_class_membership(uuid, date) security invoker;
alter function public.record_individual_lesson(jsonb) security invoker;
alter function public.record_class_lesson(jsonb, jsonb) security invoker;
alter function public.cancel_student(uuid, date) security invoker;
alter function public.complete_password_change() security invoker;
alter function public.run_finance_automation() security invoker;

grant execute on function private.assert_active_admin() to authenticated;
grant execute on function private.generate_contract_invoices(uuid, integer) to authenticated;
grant execute on function private.process_finance_automation() to authenticated;

commit;
