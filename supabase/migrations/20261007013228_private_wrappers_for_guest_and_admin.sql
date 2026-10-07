-- Move privileged Guest/Admin implementations out of the exposed public schema.
create schema if not exists guest_private authorization postgres;
revoke all on schema guest_private from public;
grant usage on schema guest_private to anon, authenticated;

create or replace function guest_private.guest_staff_directory()
returns table (id uuid, staff_code text, display_name text)
language sql stable security definer set search_path = ''
as $$
  select s.id, s.staff_code, s.display_name
  from public.staff s
  join public.schools sc on sc.id = s.school_id
  where sc.code = 'SK_SEMANGAR' and sc.active and s.active
  order by s.display_name;
$$;
revoke all on function guest_private.guest_staff_directory() from public;
grant execute on function guest_private.guest_staff_directory() to anon, authenticated;

create or replace function public.guest_staff_directory()
returns table (id uuid, staff_code text, display_name text)
language sql stable security invoker set search_path = ''
as $$ select * from guest_private.guest_staff_directory(); $$;
revoke all on function public.guest_staff_directory() from public;
grant execute on function public.guest_staff_directory() to anon, authenticated;

create or replace function guest_private.guest_submit_by_staff(
  p_staff_id uuid, p_date date, p_absence_code text, p_reason text,
  p_program_name text default null, p_organizer text default null,
  p_event_level text default null, p_venue text default null,
  p_start_period smallint default null, p_end_period smallint default null,
  p_is_emergency boolean default false
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_staff record; v_token uuid; v_result jsonb;
begin
  select s.id, s.school_id, s.display_name into v_staff
  from public.staff s join public.schools sc on sc.id = s.school_id
  where s.id = p_staff_id and s.active and sc.active and sc.code = 'SK_SEMANGAR'
  for update of s;

  if v_staff.id is null then raise exception 'Guru tidak sah atau tidak aktif'; end if;
  if p_date is null then raise exception 'Tarikh wajib diisi'; end if;
  if nullif(trim(p_reason), '') is null then raise exception 'Sebab / program wajib diisi'; end if;

  select gat.token into v_token
  from public.guest_access_tokens gat
  where gat.staff_id = v_staff.id and gat.school_id = v_staff.school_id and gat.active
    and (gat.expires_at is null or gat.expires_at > now());

  if v_token is null then
    update public.guest_access_tokens set active = false, revoked_at = now()
    where staff_id = v_staff.id and active and expires_at <= now();

    insert into public.guest_access_tokens(school_id, staff_id)
    values (v_staff.school_id, v_staff.id) returning token into v_token;
  end if;

  v_result := public.guest_submit_unavailability(
    v_token, p_date, p_absence_code, p_reason,
    p_program_name, p_organizer, p_event_level, p_venue,
    p_start_period, p_end_period,
    coalesce(p_is_emergency, false) or upper(trim(p_absence_code)) = 'MC'
  );

  return v_result || jsonb_build_object(
    'display_name', v_staff.display_name,
    'staff_id', v_staff.id
  );
end;
$$;
revoke all on function guest_private.guest_submit_by_staff(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) from public;
grant execute on function guest_private.guest_submit_by_staff(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) to anon, authenticated;

create or replace function public.guest_submit_by_staff(
  p_staff_id uuid, p_date date, p_absence_code text, p_reason text,
  p_program_name text default null, p_organizer text default null,
  p_event_level text default null, p_venue text default null,
  p_start_period smallint default null, p_end_period smallint default null,
  p_is_emergency boolean default false
)
returns jsonb
language sql security invoker set search_path = ''
as $$
  select guest_private.guest_submit_by_staff(
    p_staff_id, p_date, p_absence_code, p_reason,
    p_program_name, p_organizer, p_event_level, p_venue,
    p_start_period, p_end_period, p_is_emergency
  );
$$;
revoke all on function public.guest_submit_by_staff(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) from public;
grant execute on function public.guest_submit_by_staff(uuid,date,text,text,text,text,text,text,smallint,smallint,boolean) to anon, authenticated;

create or replace function app_private.admin_activate_admin_by_email(
  p_email text, p_staff_id uuid default null
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_school_id uuid;
  v_target_user_id uuid;
  v_email_confirmed_at timestamptz;
  v_existing_school_id uuid;
  v_staff_name text;
begin
  select up.school_id into v_school_id
  from public.user_profiles up
  where up.auth_user_id = v_actor and up.app_role = 'ADMIN' and up.active = true
  limit 1;

  if v_school_id is null then raise exception 'Akses Admin diperlukan' using errcode = '42501'; end if;
  if nullif(trim(p_email), '') is null then raise exception 'Email wajib diisi' using errcode = '22023'; end if;

  select u.id, u.email_confirmed_at into v_target_user_id, v_email_confirmed_at
  from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;

  if v_target_user_id is null then raise exception 'Akaun Auth dengan email ini belum wujud'; end if;
  if v_email_confirmed_at is null then raise exception 'Email pengguna belum disahkan'; end if;

  select up.school_id into v_existing_school_id
  from public.user_profiles up where up.auth_user_id = v_target_user_id;

  if v_existing_school_id is not null and v_existing_school_id <> v_school_id then
    raise exception 'Akaun ini telah dikaitkan dengan sekolah lain' using errcode = '42501';
  end if;

  if p_staff_id is not null then
    select s.display_name into v_staff_name
    from public.staff s
    where s.id = p_staff_id and s.school_id = v_school_id and s.active = true;

    if v_staff_name is null then raise exception 'Guru tidak sah atau tidak aktif'; end if;

    if exists (
      select 1 from public.user_profiles up
      where up.staff_id = p_staff_id and up.auth_user_id <> v_target_user_id
    ) then raise exception 'Guru ini telah dipautkan kepada akaun lain'; end if;
  end if;

  insert into public.user_profiles(auth_user_id, school_id, staff_id, app_role, active)
  values (v_target_user_id, v_school_id, p_staff_id, 'ADMIN', true)
  on conflict (auth_user_id) do update
  set school_id = excluded.school_id,
      staff_id = excluded.staff_id,
      app_role = 'ADMIN',
      active = true,
      updated_at = now()
  where public.user_profiles.school_id = v_school_id;

  if not found then raise exception 'Akaun tidak boleh diaktifkan untuk sekolah ini' using errcode = '42501'; end if;

  insert into public.audit_logs(school_id, actor_user_id, action, entity_type, entity_id, payload)
  values (
    v_school_id, v_actor, 'ADMIN_ACCESS_ACTIVATED', 'user_profile',
    v_target_user_id::text,
    jsonb_build_object('staff_id', p_staff_id, 'staff_name', v_staff_name)
  );

  return jsonb_build_object(
    'success', true,
    'auth_user_id', v_target_user_id,
    'staff_id', p_staff_id,
    'staff_name', v_staff_name
  );
end;
$$;
revoke all on function app_private.admin_activate_admin_by_email(text, uuid) from public;
grant execute on function app_private.admin_activate_admin_by_email(text, uuid) to authenticated;

create or replace function public.admin_activate_admin_by_email(
  p_email text, p_staff_id uuid default null
)
returns jsonb
language sql security invoker set search_path = ''
as $$ select app_private.admin_activate_admin_by_email(p_email, p_staff_id); $$;
revoke all on function public.admin_activate_admin_by_email(text, uuid) from public;
grant execute on function public.admin_activate_admin_by_email(text, uuid) to authenticated;

revoke execute on function public.guest_resolve_token(uuid) from anon, authenticated;
revoke execute on function public.guest_get_my_week(uuid,date) from anon, authenticated;
