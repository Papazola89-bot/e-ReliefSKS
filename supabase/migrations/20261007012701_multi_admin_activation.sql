-- Multi-admin activation hardening.
-- Only an already-active ADMIN for the same school may activate another confirmed Auth user.
create or replace function public.admin_activate_admin_by_email(
  p_email text,
  p_staff_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_school_id uuid;
  v_target_user_id uuid;
  v_email_confirmed_at timestamptz;
  v_existing_school_id uuid;
  v_staff_name text;
begin
  select up.school_id
    into v_school_id
  from public.user_profiles up
  where up.auth_user_id = v_actor
    and up.app_role = 'ADMIN'
    and up.active = true
  limit 1;

  if v_school_id is null then
    raise exception 'Akses Admin diperlukan' using errcode = '42501';
  end if;

  if nullif(trim(p_email), '') is null then
    raise exception 'Email wajib diisi' using errcode = '22023';
  end if;

  select u.id, u.email_confirmed_at
    into v_target_user_id, v_email_confirmed_at
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  limit 1;

  if v_target_user_id is null then
    raise exception 'Akaun Auth dengan email ini belum wujud';
  end if;

  if v_email_confirmed_at is null then
    raise exception 'Email pengguna belum disahkan';
  end if;

  select up.school_id
    into v_existing_school_id
  from public.user_profiles up
  where up.auth_user_id = v_target_user_id;

  if v_existing_school_id is not null and v_existing_school_id <> v_school_id then
    raise exception 'Akaun ini telah dikaitkan dengan sekolah lain' using errcode = '42501';
  end if;

  if p_staff_id is not null then
    select s.display_name
      into v_staff_name
    from public.staff s
    where s.id = p_staff_id
      and s.school_id = v_school_id
      and s.active = true;

    if v_staff_name is null then
      raise exception 'Guru tidak sah atau tidak aktif';
    end if;

    if exists (
      select 1
      from public.user_profiles up
      where up.staff_id = p_staff_id
        and up.auth_user_id <> v_target_user_id
    ) then
      raise exception 'Guru ini telah dipautkan kepada akaun lain';
    end if;
  end if;

  insert into public.user_profiles (
    auth_user_id, school_id, staff_id, app_role, active
  )
  values (
    v_target_user_id, v_school_id, p_staff_id, 'ADMIN', true
  )
  on conflict (auth_user_id) do update
  set school_id = excluded.school_id,
      staff_id = excluded.staff_id,
      app_role = 'ADMIN',
      active = true,
      updated_at = now()
  where public.user_profiles.school_id = v_school_id;

  if not found then
    raise exception 'Akaun tidak boleh diaktifkan untuk sekolah ini' using errcode = '42501';
  end if;

  insert into public.audit_logs (
    school_id, actor_user_id, action, entity_type, entity_id, payload
  )
  values (
    v_school_id,
    v_actor,
    'ADMIN_ACCESS_ACTIVATED',
    'user_profile',
    v_target_user_id::text,
    jsonb_build_object(
      'staff_id', p_staff_id,
      'staff_name', v_staff_name
    )
  );

  return jsonb_build_object(
    'success', true,
    'auth_user_id', v_target_user_id,
    'staff_id', p_staff_id,
    'staff_name', v_staff_name
  );
end;
$$;

revoke all on function public.admin_activate_admin_by_email(text, uuid) from public;
revoke execute on function public.admin_activate_admin_by_email(text, uuid) from anon;
grant execute on function public.admin_activate_admin_by_email(text, uuid) to authenticated;
