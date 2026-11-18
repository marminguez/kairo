-- Kairo · esquema inicial
-- Solo datos FICTICIOS de demo. Las políticas abiertas al rol anon son para el prototipo del hackathon;
-- en un entorno real se sustituyen por autenticación y políticas por paciente/profesional.

create table if not exists public.patients (
  id text primary key,
  name text not null,
  age int not null,
  sex text not null check (sex in ('F', 'M')),
  diagnosis text not null,
  drug_id text not null,
  dose text not null,
  cycle_start date not null,
  next_visit date not null,
  oncologist text not null
);

create table if not exists public.reports (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  created_at timestamptz not null default now(),
  source text not null check (source in ('voz', 'texto', 'seed')),
  raw_text text not null default '',
  symptoms jsonb not null default '[]',
  measurements jsonb not null default '{}',
  triage jsonb not null
);

create table if not exists public.messages (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  created_at timestamptz not null default now(),
  sender text not null check (sender in ('paciente', 'enfermeria', 'sistema')),
  body text not null,
  report_id text references public.reports(id) on delete set null
);

create index if not exists reports_patient_created_idx on public.reports (patient_id, created_at desc);
create index if not exists messages_patient_created_idx on public.messages (patient_id, created_at);

alter table public.patients enable row level security;
alter table public.reports enable row level security;
alter table public.messages enable row level security;

create policy "demo_all_patients" on public.patients for all to anon using (true) with check (true);
create policy "demo_all_reports" on public.reports for all to anon using (true) with check (true);
create policy "demo_all_messages" on public.messages for all to anon using (true) with check (true);

-- Tiempo real para el panel de enfermería
alter publication supabase_realtime add table public.patients, public.reports, public.messages;
