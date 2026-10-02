-- Reviewed adapter for the requested public, name-selected Guest workflow.
-- Existing tables, RLS, guest_submit_unavailability and Relief Engine are unchanged.
create function public.guest_staff_directory()
returns table (id uuid, staff_code text, display_name text)
language sql stable security definer set search_path = ''
as $$
 select s.id,s.staff_code,s.display_name from public.staff s
 join public.schools sc on sc.id=s.school_id
 where sc.code='SK_SEMANGAR' and sc.active and s.active
 order by s.display_name;
$$;
revoke all on function public.guest_staff_directory() from public;
grant execute on function public.guest_staff_directory() to anon, authenticated;

create function public.guest_submit_by_staff(
 p_staff_id uuid,p_date date,p_absence_code text,p_reason text,
 p_program_name text default null,p_organizer text default null,
 p_event_level text default null,p_venue text default null,
 p_start_period smallint default null,p_end_period smallint default null,
 p_is_emergency boolean default false)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
 v_staff record; v_token uuid; v_result jsonb;
begin
 select s.id,s.school_id,s.display_name into v_staff
 from public.staff s join public.schools sc on sc.id=s.school_id
 where s.id=p_staff_id and s.active and sc.active and sc.code='SK_SEMANGAR'
 for update of s;
 if v_staff.id is null then raise exception 'Guru tidak sah atau tidak aktif'; end if;
 if p_date is null then raise exception 'Tarikh wajib diisi'; end if;
 if nullif(trim(p_reason),'') is null then raise exception 'Sebab / program wajib diisi'; end if;
 select gat.token into v_token from public.guest_access_tokens gat
 where gat.staff_id=v_staff.id and gat.school_id=v_staff.school_id and gat.active
 and (gat.expires_at is null or gat.expires_at>now());
 if v_token is null then
  update public.guest_access_tokens set active=false,revoked_at=now()
  where staff_id=v_staff.id and active and expires_at<=now();
  insert into public.guest_access_tokens(school_id,staff_id)
  values(v_staff.school_id,v_staff.id) returning token into v_token;
 end if;
 v_result:=public.guest_submit_unavailability(v_token,p_date,p_absence_code,p_reason,
  p_program_name,p_organizer,p_event_level,p_venue,p_start_period,p_end_period,
  coalesce(p_is_emergency,false) or upper(trim(p_absence_code))='MC');
 return v_result || jsonb_build_object('display_name',v_staff.display_name,'staff_id',v_staff.id);
end;
$$;
revoke all on function public.guest_submit_by_staff(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) from public;
grant execute on function public.guest_submit_by_staff(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) to anon,authenticated;
