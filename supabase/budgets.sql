create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  monthly_budget numeric not null check (monthly_budget >= 0),
  created_at timestamptz not null default now(),
  constraint budgets_user_id_key unique (user_id)
);

alter table public.budgets enable row level security;

create policy "Users can read their own budget"
  on public.budgets
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budget"
  on public.budgets
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budget"
  on public.budgets
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
