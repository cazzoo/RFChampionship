-- Create a table for public user profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  first_name text,
  last_name text,
  age int,
  avatar_url text,
  steam_id text,
  favorite_number int,
  locale text,
  roles text[] default '{ROLE_USER}'
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, roles)
  values (new.id, new.email, '{ROLE_USER}');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Core Tables
create table if not exists games ( id bigserial primary key, name text not null, short_name text, description text );
create table if not exists tracks ( id bigserial primary key, game_id bigint references games(id) on delete cascade, name text not null, description text );
create table if not exists vehicles ( id bigserial primary key, game_id bigint references games(id) on delete cascade, name text not null, description text );
create table if not exists championships ( id bigserial primary key, game_id bigint references games(id) on delete cascade, name text not null, description text, championship_agreed boolean default false, registration_in_progress boolean default false );
create table if not exists events ( id bigserial primary key, championship_id bigint references championships(id) on delete cascade, track_id bigint references tracks(id) on delete set null, name text not null, description text, list_broadcast text );
create table if not exists type_sessions ( id bigserial primary key, name text not null unique );
create table if not exists sessions ( id bigserial primary key, event_id bigint references events(id) on delete cascade, type_session_id bigint references type_sessions(id), name text not null, description text, begin_date timestamptz, end_date timestamptz );
create table if not exists teams ( id bigserial primary key, championship_id bigint references championships(id) on delete cascade, name text not null, description text );
create table if not exists registrations ( id bigserial primary key, user_id uuid references auth.users(id) on delete cascade, championship_id bigint references championships(id) on delete cascade, team_id bigint references teams(id) on delete set null, vehicle_id bigint references vehicles(id) on delete set null, type text, unique(user_id, championship_id) );
create table if not exists rules ( id bigserial primary key, game_id bigint references games(id) on delete cascade, name text not null, points integer[] );
create table if not exists results ( id bigserial primary key, user_id uuid references auth.users(id) on delete cascade, session_id bigint references sessions(id) on delete cascade, rule_id bigint references rules(id) on delete set null, "position" integer, comments text );
create table if not exists setups ( id bigserial primary key, user_id uuid references auth.users(id) on delete cascade, vehicle_id bigint references vehicles(id) on delete cascade, track_id bigint references tracks(id) on delete cascade, name text not null, description text, setup_data jsonb, version integer default 1, parent_setup_id bigint references setups(id) on delete set null, is_template boolean NOT NULL DEFAULT false, is_public boolean NOT NULL DEFAULT false );

-- Enable RLS for all tables
alter table games enable row level security;
alter table tracks enable row level security;
alter table vehicles enable row level security;
alter table championships enable row level security;
alter table events enable row level security;
alter table type_sessions enable row level security;
alter table sessions enable row level security;
alter table teams enable row level security;
alter table registrations enable row level security;
alter table rules enable row level security;
alter table results enable row level security;
alter table setups enable row level security;

-- Public read access policies
drop policy if exists "Allow public read access" on games;
create policy "Allow public read access" on games for select using (true);
-- (Repeat for tracks, vehicles, championships, events, type_sessions, sessions, teams, rules, results)

-- Setups RLS policies
drop policy if exists "Allow users to view their own or public setups" on setups;
create policy "Allow users to view their own or public setups" on public.setups for select using (auth.uid() = user_id OR is_public = true);
drop policy if exists "Allow users to insert their own setups" on setups;
create policy "Allow users to insert their own setups" on public.setups for insert with check (auth.uid() = user_id);
drop policy if exists "Allow users to update their own setups" on setups;
create policy "Allow users to update their own setups" on public.setups for update using (auth.uid() = user_id);
drop policy if exists "Allow users to delete their own setups" on setups;
create policy "Allow users to delete their own setups" on public.setups for delete using (auth.uid() = user_id);

-- Admin full access policies
drop policy if exists "Allow admin full access on setups" on setups;
create policy "Allow admin full access on setups" on public.setups for all using ((SELECT 'ROLE_ADMIN' = ANY(roles) FROM public.profiles WHERE id = auth.uid())) with check ((SELECT 'ROLE_ADMIN' = ANY(roles) FROM public.profiles WHERE id = auth.uid()));

-- Remove the old function if it exists
DROP FUNCTION IF EXISTS get_setup_history(bigint);
