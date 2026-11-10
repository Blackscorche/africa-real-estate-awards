-- Public content tables: add an admin-controlled visibility flag and only expose visible rows to visitors.
ALTER TABLE public.award_timeline ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.membership_tiers ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.home_cards ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.magazine_issues ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.judges ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Public reads timeline" ON public.award_timeline;
CREATE POLICY "Public reads timeline" ON public.award_timeline FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads tiers" ON public.membership_tiers;
CREATE POLICY "Public reads tiers" ON public.membership_tiers FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads cards" ON public.home_cards;
CREATE POLICY "Public reads cards" ON public.home_cards FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads partners" ON public.partners;
CREATE POLICY "Public reads partners" ON public.partners FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads faqs" ON public.faqs;
CREATE POLICY "Public reads faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads issues" ON public.magazine_issues;
CREATE POLICY "Public reads issues" ON public.magazine_issues FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads judges" ON public.judges;
CREATE POLICY "Public reads judges" ON public.judges FOR SELECT TO anon, authenticated USING (published);

DROP POLICY IF EXISTS "Public reads settings" ON public.site_settings;
CREATE POLICY "Public reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (is_public);

-- Media bucket: no blanket read. Visitors view images through the signed links saved with content;
-- only admins (who upload and sign files) can read objects directly.
DROP POLICY IF EXISTS "Public reads media" ON storage.objects;
CREATE POLICY "Admins read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_admin());