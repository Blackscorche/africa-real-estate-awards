
-- ===== Roles & profiles =====
create type public.app_role as enum ('admin', 'member');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  organisation text,
  country text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;

create policy "Users read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "Users update own profile" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "Admins grant roles" on public.user_roles for insert to authenticated with check (public.is_admin());
create policy "Admins revoke roles" on public.user_roles for delete to authenticated using (public.is_admin() and user_id <> auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'member') on conflict do nothing;
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- ===== Public content tables (anyone reads, admins write) =====
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default '',
  title text not null,
  highlight text not null default '',
  body text not null default '',
  cta_label text not null default '',
  cta_link text not null default '',
  alt_label text not null default '',
  alt_link text not null default '',
  image_url text,
  panel text not null default 'image' check (panel in ('image','countdown','tiers')),
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.home_cards (
  id uuid primary key default gen_random_uuid(),
  tag text not null default '',
  title text not null,
  body text not null default '',
  cta_label text not null default 'Explore',
  link text not null default '/',
  image_url text,
  highlighted boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.award_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  group_name text not null default 'General',
  description text not null default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.award_timeline (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  date_text text not null,
  body text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.judges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null default '',
  organisation text not null default '',
  bio text not null default '',
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  section text not null default 'general' check (section in ('general','awards','institute','magazine')),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.ticket_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  currency text not null default 'NGN',
  seats int not null default 1,
  description text not null default '',
  perks text[] not null default '{}',
  featured boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tag text not null default 'News',
  excerpt text not null default '',
  body text not null default '',
  image_url text,
  author text not null default 'Newsroom',
  read_time text not null default '4 min',
  featured boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.magazine_issues (
  id uuid primary key default gen_random_uuid(),
  issue_label text not null,
  title text not null,
  description text not null default '',
  cover_url text,
  digital_url text,
  is_current boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.magazine_stories (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references public.magazine_issues(id) on delete set null,
  slug text not null unique,
  title text not null,
  tag text not null default 'Feature',
  excerpt text not null default '',
  body text not null default '',
  image_url text,
  is_lead boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.people_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null default '',
  city text not null default '',
  quote text not null default '',
  bio text not null default '',
  body text not null default '',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mark text not null default '',
  accent text not null default '',
  logo_url text,
  website text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.membership_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  audience text not null default '',
  price numeric not null default 0,
  currency text not null default 'NGN',
  perks text[] not null default '{}',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  duration text not null default '',
  mode text not null default '',
  description text not null default '',
  starts_on date,
  price numeric not null default 0,
  currency text not null default 'NGN',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['site_settings','nav_links','hero_slides','home_cards','award_categories','award_timeline','judges','faqs','ticket_packages','news_articles','magazine_issues','magazine_stories','people_profiles','partners','membership_tiers','programmes']
  loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Admins manage %s" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

create policy "Public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Public reads nav" on public.nav_links for select to anon, authenticated using (active);
create policy "Public reads slides" on public.hero_slides for select to anon, authenticated using (active);
create policy "Public reads cards" on public.home_cards for select to anon, authenticated using (true);
create policy "Public reads categories" on public.award_categories for select to anon, authenticated using (active);
create policy "Public reads timeline" on public.award_timeline for select to anon, authenticated using (true);
create policy "Public reads judges" on public.judges for select to anon, authenticated using (true);
create policy "Public reads faqs" on public.faqs for select to anon, authenticated using (true);
create policy "Public reads packages" on public.ticket_packages for select to anon, authenticated using (active);
create policy "Public reads news" on public.news_articles for select to anon, authenticated using (published);
create policy "Public reads issues" on public.magazine_issues for select to anon, authenticated using (true);
create policy "Public reads stories" on public.magazine_stories for select to anon, authenticated using (published);
create policy "Public reads profiles" on public.people_profiles for select to anon, authenticated using (published);
create policy "Public reads partners" on public.partners for select to anon, authenticated using (true);
create policy "Public reads tiers" on public.membership_tiers for select to anon, authenticated using (true);
create policy "Public reads programmes" on public.programmes for select to anon, authenticated using (active);

-- ===== Nominations & votes =====
create table public.nominees (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.award_categories(id) on delete cascade,
  name text not null,
  company text not null default '',
  citation text not null default '',
  image_url text,
  status text not null default 'published' check (status in ('published','shortlisted','winner','hidden')),
  vote_count int not null default 0,
  submitted_by uuid,
  created_at timestamptz not null default now()
);
create unique index nominees_unique_name on public.nominees (category_id, lower(btrim(name)));
grant select on public.nominees to anon, authenticated;
grant insert, update, delete on public.nominees to authenticated;
grant all on public.nominees to service_role;
alter table public.nominees enable row level security;
create policy "Public reads visible nominees" on public.nominees for select to anon, authenticated using (status <> 'hidden' or public.is_admin() or submitted_by = auth.uid());
create policy "Admins manage nominees" on public.nominees for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table public.nomination_details (
  id uuid primary key default gen_random_uuid(),
  nominee_id uuid not null references public.nominees(id) on delete cascade,
  submitted_by uuid,
  nominator_name text not null default '',
  nominator_email text not null,
  nominator_phone text not null default '',
  reason text not null default '',
  created_at timestamptz not null default now()
);
grant select, delete on public.nomination_details to authenticated;
grant all on public.nomination_details to service_role;
alter table public.nomination_details enable row level security;
create policy "Admins and owners read nomination details" on public.nomination_details for select to authenticated using (public.is_admin() or submitted_by = auth.uid());
create policy "Admins delete nomination details" on public.nomination_details for delete to authenticated using (public.is_admin());

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid not null references public.award_categories(id) on delete cascade,
  nominee_id uuid not null references public.nominees(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, category_id)
);
grant select, delete on public.votes to authenticated;
grant all on public.votes to service_role;
alter table public.votes enable row level security;
create policy "Users read own votes" on public.votes for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "Admins delete votes" on public.votes for delete to authenticated using (public.is_admin());

create or replace function public.recount_votes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    update public.nominees set vote_count = greatest(vote_count - 1, 0) where id = old.nominee_id;
    return old;
  end if;
  update public.nominees set vote_count = vote_count + 1 where id = new.nominee_id;
  return new;
end; $$;
create trigger votes_count after insert or delete on public.votes for each row execute function public.recount_votes();

create or replace function public.submit_nomination(
  _category_id uuid, _name text, _company text, _nominator_name text, _email text, _phone text, _reason text
) returns uuid language plpgsql security definer set search_path = public as $$
declare _id uuid; _open boolean;
begin
  select coalesce((value->>'nominations_open')::boolean, true) into _open from public.site_settings where key = 'awards';
  if _open is false then raise exception 'Nominations are closed'; end if;
  if not exists (select 1 from public.award_categories where id = _category_id and active) then raise exception 'Unknown category'; end if;
  if length(btrim(coalesce(_name,''))) < 2 then raise exception 'Nominee name is required'; end if;
  select id into _id from public.nominees where category_id = _category_id and lower(btrim(name)) = lower(btrim(_name));
  if _id is null then
    insert into public.nominees (category_id, name, company, submitted_by)
    values (_category_id, btrim(_name), btrim(coalesce(_company,'')), auth.uid()) returning id into _id;
  end if;
  insert into public.nomination_details (nominee_id, submitted_by, nominator_name, nominator_email, nominator_phone, reason)
  values (_id, auth.uid(), coalesce(_nominator_name,''), _email, coalesce(_phone,''), coalesce(_reason,''));
  return _id;
end; $$;
grant execute on function public.submit_nomination(uuid, text, text, text, text, text, text) to anon, authenticated;

create or replace function public.cast_vote(_nominee_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare _cat uuid; _open boolean; _existing uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to vote'; end if;
  select coalesce((value->>'voting_open')::boolean, true) into _open from public.site_settings where key = 'awards';
  if _open is false then raise exception 'Voting is closed'; end if;
  select category_id into _cat from public.nominees where id = _nominee_id and status <> 'hidden';
  if _cat is null then raise exception 'Nominee not found'; end if;
  select nominee_id into _existing from public.votes where user_id = auth.uid() and category_id = _cat;
  if _existing is not null then raise exception 'You have already voted in this category'; end if;
  insert into public.votes (user_id, category_id, nominee_id) values (auth.uid(), _cat, _nominee_id);
  return _cat;
end; $$;
revoke execute on function public.cast_vote(uuid) from anon, public;
grant execute on function public.cast_vote(uuid) to authenticated;

-- ===== Submissions =====
create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  tier text not null,
  full_name text not null,
  email text not null,
  phone text not null default '',
  organisation text not null default '',
  country text not null default '',
  message text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note text not null default '',
  created_at timestamptz not null default now()
);

create table public.programme_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  programme_id uuid references public.programmes(id) on delete set null,
  programme_title text not null default '',
  full_name text not null,
  email text not null,
  phone text not null default '',
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table public.ticket_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  package_id uuid references public.ticket_packages(id) on delete set null,
  package_name text not null default '',
  quantity int not null default 1 check (quantity between 1 and 50),
  full_name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  full_name text not null default '',
  email text not null,
  format text not null default 'Digital only',
  source text not null default 'magazine' check (source in ('magazine','newsletter')),
  created_at timestamptz not null default now(),
  unique (email, source)
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  kind text not null default 'contact' check (kind in ('contact','advertising','sponsorship','profile_request')),
  full_name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new','handled')),
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['membership_applications','programme_registrations','ticket_orders','subscriptions','enquiries']
  loop
    execute format('grant insert on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Anyone submits %s" on public.%I for insert to anon, authenticated with check (user_id is null or user_id = auth.uid())', t, t);
    execute format('create policy "Owners and admins read %s" on public.%I for select to authenticated using (user_id = auth.uid() or public.is_admin())', t, t);
    execute format('create policy "Admins update %s" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
    execute format('create policy "Admins delete %s" on public.%I for delete to authenticated using (public.is_admin())', t, t);
  end loop;
end $$;

-- ===== Storage policies for uploaded images =====
create policy "Public reads media" on storage.objects for select using (bucket_id = 'media');
create policy "Admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "Admins update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "Admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
