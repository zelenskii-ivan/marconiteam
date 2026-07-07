create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  status text not null default 'active' check (status in ('active', 'blocked', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists user_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  contact_type text not null check (contact_type in ('phone', 'email')),
  contact_value text not null,
  is_verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (contact_type, contact_value)
);

create table if not exists auth_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  channel text not null check (channel in ('sms', 'email_magic_link')),
  target text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  status text not null default 'pending' check (status in ('pending', 'verified', 'expired', 'cancelled')),
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_token_hash text not null,
  ip inet,
  user_agent text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  consent_type text not null check (consent_type in ('personal_data', 'marketing')),
  document_version text not null,
  granted boolean not null,
  ip inet,
  user_agent text,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null,
  city text not null,
  street text not null,
  building text not null,
  entrance text,
  floor text,
  apartment text,
  comment text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  external_order_id text,
  total_amount numeric(12,2) not null,
  currency text not null default 'RUB',
  status text not null,
  placed_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  sku text not null,
  title_snapshot text not null,
  qty numeric(10,3) not null,
  unit_price numeric(12,2) not null
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  sku text not null,
  created_at timestamptz not null default now(),
  unique (user_id, sku)
);

create table if not exists privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  request_type text not null check (request_type in ('export', 'delete', 'revoke_marketing', 'other')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed', 'rejected')),
  requested_by_user boolean not null default true,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id) on delete set null,
  target_user_id uuid references users(id) on delete set null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_contacts_user_id on user_contacts(user_id);
create index if not exists idx_sessions_user_id on sessions(user_id);
create index if not exists idx_sessions_token_hash on sessions(session_token_hash);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_addresses_user_id on addresses(user_id);
create index if not exists idx_favorites_user_id on favorites(user_id);
create index if not exists idx_consents_user_id on consents(user_id);
create index if not exists idx_privacy_requests_user_id on privacy_requests(user_id);
