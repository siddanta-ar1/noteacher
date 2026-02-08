-- Create comments table
create table comments (
  id uuid primary key default uuid_generate_v4(),
  node_id uuid not null references nodes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  type text check (type in ('question', 'solution', 'general')) default 'general',
  is_resolved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster queries
create index comments_node_id_idx on comments(node_id);
create index comments_user_id_idx on comments(user_id);

-- RLS Policies
alter table comments enable row level security;

-- Allow read access to all authenticated users
create policy "Comments are viewable by everyone."
  on comments for select
  using ( true );

-- Allow insert access only to authenticated users
create policy "Users can insert their own comments."
  on comments for insert
  with check ( auth.uid() = user_id );

-- Allow update access only to the comment author
create policy "Users can update their own comments."
  on comments for update
  using ( auth.uid() = user_id );

-- Allow delete access only to the comment author
create policy "Users can delete their own comments."
  on comments for delete
  using ( auth.uid() = user_id );
