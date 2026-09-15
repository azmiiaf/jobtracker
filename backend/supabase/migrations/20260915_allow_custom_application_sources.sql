alter table public.applications
  drop constraint if exists applications_source_check;

alter table public.applications
  add constraint applications_source_check
  check (length(trim(source)) > 0);