# SQL pendiente — Update 25b (user_context)

Correr en Supabase SQL Editor antes de testear la memoria de Elion.

```sql
create table if not exists public.user_context (
  user_id uuid references auth.users on delete cascade primary key,
  notes text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.user_context enable row level security;

create policy "Users manage own context" on public.user_context
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

> Las tablas `chat_conversations` y `chat_messages` ya fueron creadas previamente.
> Si `user_context` no existe, `api/user-context.js` responde `{ notes: '' }` en GET
> y `503 context_not_ready` en PATCH — la app sigue funcionando sin crashear.
