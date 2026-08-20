-- Index op titel, om te testen of de CODEOWNERS-regel op migraties werkt.
create index if not exists items_title_idx on public.items (title);
