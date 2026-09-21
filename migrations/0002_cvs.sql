-- Published CVs: one row per user, public read via unguessable slug
create table if not exists cvs (
  id          text primary key,
  user_id     text not null unique,
  slug        text not null unique,
  title       text not null,
  data        text not null,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists cvs_slug_idx on cvs (slug);
create index if not exists cvs_user_id_idx on cvs (user_id);
