-- Retire direct token-based Guest submission endpoints.
-- The current public flow uses guest_submit_by_staff(), which internally calls
-- guest_submit_unavailability() as the SECURITY DEFINER owner.
revoke execute on function public.guest_submit_daily_attendance(uuid,date,text,text,smallint,smallint,text) from anon, authenticated;
revoke execute on function public.guest_submit_unavailability(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) from anon, authenticated;
