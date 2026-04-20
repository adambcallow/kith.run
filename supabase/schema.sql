-- Kith Database Schema

-- Profiles
create table profiles (
  id           uuid references auth.users primary key,
  username     text unique not null,
  full_name    text,
  avatar_url   text,
  bio          text,
  city         text default 'Dubai',
  pace_min     int,
  pace_max     int,
  strava_id    text,
  garmin_id    text,
  created_at   timestamptz default now()
);

-- Friendships
create table friendships (
  id           uuid primary key default gen_random_uuid(),
  user_a       uuid references profiles(id) not null,
  user_b       uuid references profiles(id) not null,
  status       text check (status in ('pending', 'accepted')) default 'pending',
  created_at   timestamptz default now(),
  unique(user_a, user_b)
);

-- Runs
create table runs (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid references profiles(id) not null,
  title           text,
  start_lat       float not null,
  start_lng       float not null,
  start_place     text not null,
  scheduled_at    timestamptz not null,
  distance_km     float not null,
  pace_min_target int,
  pace_max_target int,
  note            text,
  visibility      text check (visibility in ('public', 'crew')) default 'crew',
  is_live         boolean default false,
  expires_at      timestamptz,
  strava_activity_id text,
  route_geojson   jsonb,
  status          text check (status in ('upcoming', 'active', 'completed')) default 'upcoming',
  created_at      timestamptz default now()
);

-- Run Participants
create table run_participants (
  id        uuid primary key default gen_random_uuid(),
  run_id    uuid references runs(id) on delete cascade not null,
  user_id   uuid references profiles(id) not null,
  joined_at timestamptz default now(),
  unique(run_id, user_id)
);

-- Reactions
create table reactions (
  id         uuid primary key default gen_random_uuid(),
  run_id     uuid references runs(id) on delete cascade not null,
  user_id    uuid references profiles(id) not null,
  emoji      text not null,
  created_at timestamptz default now(),
  unique(run_id, user_id, emoji)
);

-- Notifications
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id) not null,
  type       text not null,
  payload    jsonb default '{}',
  read       boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index idx_runs_creator on runs(creator_id);
create index idx_runs_scheduled on runs(scheduled_at);
create index idx_runs_status on runs(status);
create index idx_run_participants_run on run_participants(run_id);
create index idx_run_participants_user on run_participants(user_id);
create index idx_friendships_users on friendships(user_a, user_b);
create index idx_notifications_user on notifications(user_id, read);

-- RLS Policies
alter table profiles enable row level security;
alter table friendships enable row level security;
alter table runs enable row level security;
alter table run_participants enable row level security;
alter table reactions enable row level security;
alter table notifications enable row level security;

-- Profiles: visible to all authenticated users
create policy "profiles_select" on profiles for select
  to authenticated using (true);

create policy "profiles_insert" on profiles for insert
  to authenticated with check (id = auth.uid());

create policy "profiles_update" on profiles for update
  to authenticated using (id = auth.uid());

-- Runs: public runs visible to all, crew runs visible to creator and mutual friends
create policy "runs_select" on runs for select
  to authenticated using (
    visibility = 'public'
    or creator_id = auth.uid()
    or exists (
      select 1 from friendships
      where status = 'accepted'
      and ((user_a = auth.uid() and user_b = creator_id)
        or (user_b = auth.uid() and user_a = creator_id))
    )
  );

create policy "runs_insert" on runs for insert
  to authenticated with check (creator_id = auth.uid());

create policy "runs_update" on runs for update
  to authenticated using (creator_id = auth.uid());

-- Run Participants
create policy "run_participants_select" on run_participants for select
  to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from runs where id = run_id
      and (creator_id = auth.uid() or visibility = 'public')
    )
  );

create policy "run_participants_insert" on run_participants for insert
  to authenticated with check (user_id = auth.uid());

create policy "run_participants_delete" on run_participants for delete
  to authenticated using (user_id = auth.uid());

-- Friendships
create policy "friendships_select" on friendships for select
  to authenticated using (user_a = auth.uid() or user_b = auth.uid());

create policy "friendships_insert" on friendships for insert
  to authenticated with check (user_a = auth.uid());

create policy "friendships_update" on friendships for update
  to authenticated using (user_a = auth.uid() or user_b = auth.uid());

-- Reactions
create policy "reactions_select" on reactions for select
  to authenticated using (true);

create policy "reactions_insert" on reactions for insert
  to authenticated with check (user_id = auth.uid());

create policy "reactions_delete" on reactions for delete
  to authenticated using (user_id = auth.uid());

-- Notifications
create policy "notifications_select" on notifications for select
  to authenticated using (user_id = auth.uid());

create policy "notifications_update" on notifications for update
  to authenticated using (user_id = auth.uid());

-- Enable Realtime for run_participants
alter publication supabase_realtime add table run_participants;
