-- Guarda qué motor graduó los síntomas: 'ia' (Claude) o 'local' (palabras clave).
alter table public.reports add column if not exists engine text check (engine in ('ia', 'local'));
