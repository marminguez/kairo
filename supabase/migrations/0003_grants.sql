-- Permisos de acceso a las tablas.
-- Los proyectos nuevos de Supabase no conceden permisos automáticamente a los roles de la API,
-- así que sin esto aparece "permission denied for table patients".
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.patients, public.reports, public.messages to anon, authenticated;
grant all on public.patients, public.reports, public.messages to service_role;
