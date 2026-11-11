-- Make media uploads work on a clean or migrated project. The bucket stays
-- private; content rows store signed links created by the admin image field.
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do update set public = false;

drop policy if exists "Public reads media" on storage.objects;
drop policy if exists "Admins read media" on storage.objects;
create policy "Admins read media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- Dedicated portal roles. Existing accounts keep their roles; assign the new
-- jury/nominee/voter roles with the admin SQL supplied after deployment.
alter type public.app_role add value if not exists 'jury';
alter type public.app_role add value if not exists 'nominee';
alter type public.app_role add value if not exists 'voter';

-- Accounts begin as voters. Member, nominee and jury access must be assigned
-- intentionally by an administrator rather than being granted at sign-up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'voter') on conflict do nothing;
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end;
$$;
