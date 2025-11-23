-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  university text,
  major text,
  year_of_study text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs Table
create table if not exists public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  responsibilities text[],
  required_skills jsonb,
  required_knowledge text[],
  domain text,
  level text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Job Matches Table
create table if not exists public.job_matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  match_percentage numeric,
  fit_tags text[],
  reasons_for_fit jsonb,
  skill_gaps jsonb,
  knowledge_gaps jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills Table
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_name text not null,
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Knowledge Domains Table
create table if not exists public.knowledge_domains (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  domain text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Personality Table
create table if not exists public.personality (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mbti text,
  disc text,
  working_style text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Career Preferences Table
create table if not exists public.career_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  career_target text,
  interest_domains text[],
  work_environment text,
  time_horizon text check (time_horizon in ('3 months', '6 months', '12 months')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Learning Tasks Table
create table if not exists public.learning_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  task_description text not null,
  week_number integer,
  estimated_hours integer,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.job_matches enable row level security;
alter table public.skills enable row level security;
alter table public.knowledge_domains enable row level security;
alter table public.personality enable row level security;
alter table public.career_preferences enable row level security;
alter table public.learning_tasks enable row level security;

-- Create Policies (Basic)

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Jobs: Everyone can view jobs (public read)
create policy "Public jobs are viewable by everyone" on public.jobs for select using (true);
-- Allow authenticated users to insert jobs (for seeding purposes - in prod restrict this)
create policy "Authenticated users can insert jobs" on public.jobs for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can delete jobs" on public.jobs for delete using (auth.role() = 'authenticated');


-- Job Matches: Users can view/manage their own matches
create policy "Users can view own matches" on public.job_matches for select using (auth.uid() = user_id);
create policy "Users can insert own matches" on public.job_matches for insert with check (auth.uid() = user_id);

-- Skills: Users can view/manage their own skills
create policy "Users can view own skills" on public.skills for select using (auth.uid() = user_id);
create policy "Users can insert own skills" on public.skills for insert with check (auth.uid() = user_id);
create policy "Users can update own skills" on public.skills for update using (auth.uid() = user_id);
create policy "Users can delete own skills" on public.skills for delete using (auth.uid() = user_id);

-- Knowledge Domains: Users can view/manage their own domains
create policy "Users can view own knowledge" on public.knowledge_domains for select using (auth.uid() = user_id);
create policy "Users can insert own knowledge" on public.knowledge_domains for insert with check (auth.uid() = user_id);
create policy "Users can delete own knowledge" on public.knowledge_domains for delete using (auth.uid() = user_id);

-- Personality: Users can view/manage their own personality
create policy "Users can view own personality" on public.personality for select using (auth.uid() = user_id);
create policy "Users can insert own personality" on public.personality for insert with check (auth.uid() = user_id);
create policy "Users can update own personality" on public.personality for update using (auth.uid() = user_id);

-- Career Preferences: Users can view/manage their own preferences
create policy "Users can view own preferences" on public.career_preferences for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.career_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on public.career_preferences for update using (auth.uid() = user_id);

-- Learning Tasks: Users can view/manage their own tasks
create policy "Users can view own tasks" on public.learning_tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.learning_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.learning_tasks for update using (auth.uid() = user_id);
