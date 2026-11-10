
insert into public.site_settings (key, value) values
('brand', jsonb_build_object(
  'name','Africa Real Estate Awards','short_mark','ARE','short_accent','A',
  'tagline','Institute of Real Estate Management, Leadership and Professionals',
  'email','hello@africarealestateawards.com','phone','+234 800 000 0000',
  'address','Lekki Phase 1, Lagos, Nigeria',
  'instagram','','linkedin','','x','','facebook','',
  'header_cta_label','Nominate','header_cta_link','/awards#nominate')),
('announcement', jsonb_build_object(
  'enabled',true,'label','Advertisement · 970 × 90',
  'text','Your brand here — reach Africa''s property leaders.',
  'link_label','Advertise with us','link_url','/advertise')),
('home', jsonb_build_object(
  'magazine_eyebrow','Advertisement · Africa Real Estate Magazine',
  'magazine_title','Issue 12 is out. Subscribe today.',
  'magazine_text','Quarterly print & digital — cover stories, deep-dives and the awards edition.',
  'stats_title','A continent-wide network',
  'stat1_value','30+','stat1_label','Countries represented',
  'stat2_value','12','stat2_label','Award categories',
  'stat3_value','1,200+','stat3_label','Members & alumni',
  'stat4_value','4','stat4_label','Issues a year',
  'gala_eyebrow','The 2026 Gala','gala_title','One rooftop night above the lagoon.',
  'gala_text','Black-tie dinner, live announcements and the continent''s property leaders under one sky. Tables are limited.',
  'gala_image','/__l5e/assets-v1/09718e30-3ba1-41b7-908b-ccd467043bf2/gala-rooftop.jpg')),
('awards', jsonb_build_object(
  'eyebrow','(b) Awards · 2026 edition','title','One night above the lagoon.',
  'intro','Africa Real Estate Magazine & Awards celebrates the projects and people moving African property forward.',
  'event_date','2026-12-13T18:00:00+01:00','venue','Lekki Colosseum','venue_detail','Rooftop · Lagos, Nigeria',
  'status_text','Nominations open','status_detail','Public & peer nominations',
  'nominations_open',true,'voting_open',true,'show_vote_counts',true,
  'hero_image','/__l5e/assets-v1/60529f94-d35c-4541-bdc6-c55fd2e20399/trophy.jpg',
  'tickets_title','Book your seat at the gala',
  'tickets_text','Reserve individual seats or a branded corporate table. Our events team confirms every booking by email within 48 hours.')),
('institute', jsonb_build_object(
  'eyebrow','(a) The Institute','title','Raising the standard of the profession.',
  'intro','The Institute of Real Estate Management, Leadership and Professionals trains, certifies and connects the people who build Africa.',
  'hero_image','/__l5e/assets-v1/c12c3d39-6ff7-4418-964a-8880582dfaf5/institute-training.jpg')),
('news', jsonb_build_object(
  'eyebrow','(c) Africa Real Estate News','title','The newsroom.',
  'intro','Markets, policy, finance and the stories behind Africa''s skylines.')),
('magazine', jsonb_build_object(
  'eyebrow','(d) Magazine · Print & digital','title','Africa Real Estate Magazine.',
  'intro','The Institute''s quarterly journal — long-form cover stories, market deep-dives and the annual awards edition, distributed across the continent.',
  'subscribe_note','Published quarterly by the Institute of Real Estate Management, Leadership and Professionals.',
  'next_issue_text','The next issue ships on 2 January 2027.')),
('profiles', jsonb_build_object(
  'eyebrow','Media wing · Profiles','title','The people moving the industry.',
  'intro','Africa Real Estate News profiles the leaders, builders and investors redefining property across the continent.')),
('advertise', jsonb_build_object(
  'eyebrow','Partner with us','title','Put your brand in front of Africa''s property leaders.',
  'intro','Sponsorship of the Awards, advertising in the Magazine and newsroom, and bespoke partnerships with the Institute.',
  'option1_title','Awards sponsorship','option1_text','Category naming rights, gala branding and a corporate table.',
  'option2_title','Magazine advertising','option2_text','Full-page, spread and cover-wrap placements in print and digital.',
  'option3_title','Digital campaigns','option3_text','Homepage takeovers, newsletter features and sponsored profiles.')),
('footer', jsonb_build_object(
  'about','Institute of Real Estate Management, Leadership and Professionals.',
  'bottom_line','Lagos · 13 Dec 2026 · Africa Real Estate Awards'));

insert into public.nav_links (label, url, sort_order) values
('Institute','/institute',1),('Awards','/awards',2),('News','/news',3),('Magazine','/magazine',4),('Profiles','/profiles',5),('Advertise','/advertise',6);

insert into public.hero_slides (eyebrow, title, highlight, body, cta_label, cta_link, alt_label, alt_link, panel, image_url, sort_order) values
('Institute of Real Estate Management, Leadership & Professionals','Lead the industry,','certified.','Accredited leadership programmes, CPD tracks and a vetted professional network for Africa''s real estate leaders.','Join the Institute','/institute#join','Explore training','/institute#programmes','tiers','/__l5e/assets-v1/c12c3d39-6ff7-4418-964a-8880582dfaf5/institute-training.jpg',1),
('Africa Real Estate Magazine & Awards · 13 Dec 2026','The continent''s finest,','honoured.','One rooftop night at Lekki Colosseum, Lagos. Nominate and vote across 12 categories.','Nominate now','/awards#nominate','Vote for nominees','/awards#vote','countdown','/__l5e/assets-v1/09718e30-3ba1-41b7-908b-ccd467043bf2/gala-rooftop.jpg',2);

insert into public.home_cards (tag, title, body, cta_label, link, highlighted, sort_order) values
('(a) Institute','Membership & Training','Accredited leadership programmes, CPD tracks and a vetted professional network.','Become a member','/institute',false,1),
('(b) Awards','The 2026 Gala','Nominate across 12 categories before the deadline. Rooftop ceremony, 13 Dec.','Open nominations','/awards',true,2),
('(c) News','Africa Real Estate News','Daily market coverage and long-form profiles of the people moving the industry.','Read the newsroom','/news',false,3),
('(d) Magazine','Africa Real Estate Magazine','Quarterly print & digital journalism — cover stories, deep-dives and the awards edition.','Open the magazine','/magazine',false,4);

insert into public.award_categories (name, group_name, description, sort_order) values
('Developer of the Year','Residential','For the developer whose portfolio set the standard for quality, delivery and buyer trust this year.',1),
('Luxury Residential Project','Residential','A completed high-end residential scheme that excels in design, finish and amenity.',2),
('Affordable Housing Champion','Residential','Delivering dignified homes at prices working families can reach.',3),
('Commercial Development of the Year','Commercial','Office, retail or logistics schemes with outstanding design and occupancy.',4),
('Mixed-Use Landmark','Commercial','Projects that blend living, working and leisure into a single destination.',5),
('Real Estate Firm of the Year','Commercial','Agencies, valuers and advisory firms leading on service and results.',6),
('Green Building Excellence','Sustainability','Measurable energy, water and materials performance — certified or verified.',7),
('Smart City Innovation','Sustainability','Technology and planning that make cities work better for residents.',8),
('PropTech Disruptor','Sustainability','Start-ups and platforms changing how Africa buys, rents and manages property.',9),
('Woman in Real Estate','Leadership','Honouring a woman whose leadership is reshaping the industry.',10),
('Young Real Estate Leader (Under 35)','Leadership','A rising professional already making an outsized impact.',11),
('Lifetime Achievement','Leadership','A career that has defined African real estate for a generation.',12);

insert into public.award_timeline (label, date_text, body, sort_order) values
('Nominations open','1 Aug 2026','Public and peer nominations open across all 12 categories.',1),
('Nominations close','31 Oct 2026','Final day to put a name forward.',2),
('Shortlist announced','15 Nov 2026','The jury publishes finalists; public voting continues.',3),
('Voting closes','6 Dec 2026','Public votes count toward 30% of the final score.',4),
('Gala night','13 Dec 2026','Winners announced live at Lekki Colosseum Rooftop.',5);

insert into public.judges (name, title, organisation, bio, image_url, sort_order) values
('Folake Adeyemi','Chair of the Jury','Fellow of the Institute','Two decades in development finance across West Africa; former head of real estate lending at a pan-African bank.','/__l5e/assets-v1/1f6158b5-a707-4814-9d2c-ee1647cfeda3/judge-folake.jpg',1),
('Daniel Otieno','Juror','Urban planner, Nairobi','Led master-planning for three East African satellite cities and advises governments on land-value capture.','/__l5e/assets-v1/17f816a2-c1be-40a9-b7d8-b3d7a6a20ba8/judge-otieno.jpg',2),
('Zanele Dlamini','Juror','Fund manager','Manages a pan-African fund focused on logistics and student housing.','/__l5e/assets-v1/64b1a478-3106-4fe1-9f68-c835143dd61b/profile-zanele.jpg',3);

insert into public.faqs (section, question, answer, sort_order) values
('awards','Who can nominate?','Anyone. You can nominate yourself, your company or a peer. Each nomination goes live on the voting board straight away.',1),
('awards','How are winners chosen?','The jury scores every shortlisted entry against the category criteria. Public votes count toward 30% of the final score.',2),
('awards','How many times can I vote?','Once per category per account. Sign in to cast your votes — you can see them in your dashboard.',3),
('awards','Is there an entry fee?','No. Nominating and voting are free. Gala seats and corporate tables are booked separately.',4),
('institute','How long does membership approval take?','Applications are reviewed within five working days. You can track the status in your dashboard.',5),
('institute','Are the programmes accredited?','Yes. All programmes carry CPD hours recognised by the Institute.',6),
('magazine','Do you ship print copies outside Nigeria?','Yes — print subscriptions ship to 30+ African countries.',7);

insert into public.ticket_packages (name, price, seats, description, perks, featured, sort_order) values
('Gala seat',250000,1,'A single seat at the rooftop gala dinner.',array['Champagne reception','Three-course dinner','Awards ceremony'],false,1),
('Corporate table',2250000,10,'A table of ten with your brand on the table card.',array['Table of 10','Logo on table card','Mention in the gala programme'],true,2),
('VIP table',4000000,10,'Front-row table with premium hospitality.',array['Front-row placement','Premium drinks package','Photo opportunity with winners'],false,3);

insert into public.news_articles (slug, title, tag, excerpt, body, image_url, author, read_time, featured, published_at) values
('rooftop-developers-rewriting-lekki-skyline','The rooftop developers rewriting Lekki''s skyline','Feature','A new generation of builders is going vertical along the Lekki corridor — and pricing is catching up.',
E'Ten years ago the Lekki corridor was a story of sprawl: detached houses, gated estates and long commutes. Today the cranes tell a different story.\n\nA new generation of developers is betting on height. Mid-rise and high-rise residential towers now account for a growing share of new launches along the corridor, driven by land prices and buyers who want amenities on their doorstep.\n\n"Vertical is the only way the numbers work," one developer told us. "Land is too expensive to build three bedrooms on a plot anymore."\n\nThe shift is not without risk. Service charges, lift maintenance and power supply remain the biggest concerns for buyers — and the developers who solve them are the ones pulling ahead.',
'/__l5e/assets-v1/f0984c88-36d9-4aa9-bc89-af61ba730abe/lekki-skyline.jpg','Newsroom','8 min',true, now() - interval '1 day'),
('lagos-rental-yields-outpace-abuja','Lagos rental yields quietly outpace Abuja for third quarter','Market','Data from leading agencies shows mid-market apartments driving returns in Lagos.',
E'Mid-market apartments in Lagos returned higher gross rental yields than comparable stock in Abuja for the third consecutive quarter, according to figures compiled from leading agencies.\n\nThe gap is widest in two- and three-bedroom units close to new transport links, where demand from young professionals has outpaced supply.\n\nAnalysts caution that yields remain sensitive to currency movements and service-charge inflation.',
'/__l5e/assets-v1/fe50e0be-2531-4988-a8ae-0eda76bf6ba6/lagos-apartments.jpg','Market desk','4 min',false, now() - interval '3 days'),
('land-use-reforms-small-landlords','New land-use reforms: what they mean for small landlords','Policy','Titling timelines are shrinking. We break down the practical changes.',
E'Recent reforms promise faster titling and clearer consent processes. For small landlords, the practical effect is shorter waits and fewer intermediaries.\n\nWe walked through the new process with three practitioners to see what has actually changed — and what still needs fixing.',
'/__l5e/assets-v1/d2d77350-972d-4a3c-9682-9cc41ae3ce4d/keys-mortgage.jpg','Policy desk','5 min',false, now() - interval '5 days'),
('mortgage-access-five-years-on','Mortgage access five years on: who actually got the keys','Finance','An honest look at the numbers behind Africa''s housing finance push.',
E'Five years after a wave of housing-finance initiatives, we looked at who actually received mortgages — and who was left out.\n\nThe data shows meaningful progress among salaried workers, but the self-employed majority remains largely outside the system.',
'/__l5e/assets-v1/d2d77350-972d-4a3c-9682-9cc41ae3ce4d/keys-mortgage.jpg','Finance desk','7 min',false, now() - interval '7 days'),
('green-certification-sales-tool-nairobi','Why green certification is becoming a sales tool in Nairobi','Sustainability','Developers say buyers now ask about energy ratings before floor plans.',
E'In Nairobi, green certification has moved from a compliance box to a marketing headline. Developers report buyers asking about energy ratings, solar provision and water recycling before they ask about floor plans.\n\nLower running costs are the main draw — but so is resale value.',
'/__l5e/assets-v1/360d236e-bdaa-4bc6-963f-ebcd73ccc0e6/green-tower-nairobi.jpg','Newsroom','6 min',false, now() - interval '9 days'),
('2026-awards-record-nominations','2026 Awards: record nominations from 30+ countries','Awards','The Institute confirms its biggest year yet ahead of the Lekki rooftop gala.',
E'The Institute has confirmed record nominations for the 2026 Africa Real Estate Awards, with entries from more than 30 countries.\n\nThe jury will publish its shortlist in November ahead of the rooftop gala at Lekki Colosseum on 13 December.',
'/__l5e/assets-v1/60529f94-d35c-4541-bdc6-c55fd2e20399/trophy.jpg','Awards desk','3 min',false, now() - interval '10 days');

insert into public.magazine_issues (issue_label, title, description, cover_url, is_current, sort_order) values
('Issue 12 · Q4 2026','The Vertical Lagos Edition','How height and heritage are learning to share a floor plan.','/__l5e/assets-v1/889ba839-e88d-4d4a-8131-7d49bbe8753c/magazine-cover.jpg',true,1),
('Issue 11 · Q3 2026','Awards Edition','The making of the 2026 awards, from shortlist sittings to the gala preview.','/__l5e/assets-v1/1d64f4c4-511c-4c23-82e3-e772037196aa/cover-issue-11.jpg',false,2),
('Issue 10 · Q2 2026','Capital & Materials','Who gets to build when cement and steel decide the budget.','/__l5e/assets-v1/50a1ac5b-291a-49c1-8399-ed0ffe4e818e/cover-issue-10.jpg',false,3),
('Issue 09 · Q1 2026','Housing the Middle','The missing middle and the developers trying to reach it.',null,false,4);

insert into public.magazine_stories (issue_id, slug, title, tag, excerpt, body, image_url, is_lead, sort_order)
select i.id, s.slug, s.title, s.tag, s.excerpt, s.body, s.image_url, s.is_lead, s.sort_order
from (values
 ('Issue 12 · Q4 2026','vertical-lagos','Vertical Lagos: the towers relearning the lagoon','Cover Story','Eighteen storeys above the Lekki-Ikoyi link bridge, a new school of architects is proving that height and heritage can share a floor plan.',E'Eighteen storeys above the Lekki-Ikoyi link bridge, the wind does the cooling. That is the point.\n\nA new school of Lagos architects is designing towers that borrow from the courtyard house — deep shade, cross-ventilation, shared outdoor rooms — and stacking them into the sky.\n\nThe result is a skyline that looks like nowhere else.','/__l5e/assets-v1/889ba839-e88d-4d4a-8131-7d49bbe8753c/magazine-cover.jpg',true,1),
 ('Issue 12 · Q4 2026','mortgage-map','The mortgage map: where Africa actually lends','Finance Deep-Dive','We charted housing-finance access across 14 markets. The gaps are narrower than the headlines suggest.',E'We charted housing-finance access across 14 markets.\n\nThe gaps are narrower than the headlines suggest — and the fastest growth is coming from places few would predict.','/__l5e/assets-v1/d2d77350-972d-4a3c-9682-9cc41ae3ce4d/keys-mortgage.jpg',false,2),
 ('Issue 11 · Q3 2026','kigali-land-value-capture','Kigali''s quiet experiment in land value capture','Policy','How a small capital city is funding infrastructure without displacing the families that built it.',E'Kigali is funding roads and drainage from the value they create — and keeping families in place while it does.','/__l5e/assets-v1/21abcde8-55ff-42a1-9d61-8a63c598b1c9/kigali.jpg',false,3),
 ('Issue 11 · Q3 2026','inside-the-awards-edition','Inside the awards edition: twelve categories, one continent','Awards','The making of the 2026 awards edition, from the shortlist sittings to the rooftop gala preview.',E'Twelve categories, one jury, one continent. Here is how the shortlist comes together.','/__l5e/assets-v1/60529f94-d35c-4541-bdc6-c55fd2e20399/trophy.jpg',false,4),
 ('Issue 10 · Q2 2026','cement-steel-import-bill','Cement, steel and the import bill nobody budgets for','Market','Material costs decide who gets to build. A commodity-by-commodity breakdown for developers.',E'Material costs decide who gets to build. We break down cement, steel, glass and fittings commodity by commodity.',null,false,5)
) as s(issue_label, slug, title, tag, excerpt, body, image_url, is_lead, sort_order)
join public.magazine_issues i on i.issue_label = s.issue_label;

insert into public.people_profiles (slug, name, role, city, quote, bio, body, image_url, sort_order) values
('adaeze-okonkwo','Adaeze Okonkwo','Developer','Abuja','Build for the family who will live there in thirty years, not the buyer this quarter.','Founder of a residential group delivering over 1,200 homes across the FCT, Adaeze champions mid-income housing with design dignity.',E'Adaeze started with a single four-unit block in Gwarinpa. Fifteen years later her group has delivered over 1,200 homes.\n\nHer rule: never compromise on light, air and storage — the things families notice every day.','/__l5e/assets-v1/52037192-0b7a-4a3c-952f-fd0c16328d9e/profile-adaeze.jpg',1),
('kwame-boateng','Kwame Boateng','Architect','Accra','Our climate is the brief. Shade, air and light are the luxury.','Principal of an Accra studio known for passive-cooled towers, Kwame blends West African vernacular with contemporary form.',E'Kwame''s studio designs buildings that need less air-conditioning by design — deep overhangs, perforated screens and courtyards stacked vertically.','/__l5e/assets-v1/ffe00050-1232-4bf6-aff1-0e680292c90c/profile-kwame.jpg',2),
('zanele-dlamini','Zanele Dlamini','Fund Manager','Nairobi','Capital follows clarity. Give investors good data and they will come.','Zanele manages a pan-African real estate fund focused on logistics and student housing across East and Southern Africa.',E'Zanele believes the biggest barrier to investment is not risk but opacity. Her fund publishes more data than any of its peers.','/__l5e/assets-v1/64b1a478-3106-4fe1-9f68-c835143dd61b/profile-zanele.jpg',3);

insert into public.partners (name, mark, accent, sort_order) values
('Lekki Colosseum','Lekki','Colosseum',1),('Afri Build Bank','Afri','Build',2),('Savanna Cement','Savanna','Cement',3),
('Kente Capital','Kente','Capital',4),('Delta PropTech','Delta','Prop',5),('Atlas Homes','Atlas','Homes',6);

insert into public.membership_tiers (name, audience, price, perks, featured, sort_order) values
('Associate','Graduates & early-career',50000,array['Member directory listing','Monthly market briefings','Discounted training'],false,1),
('Professional','Practising agents, valuers, managers',120000,array['Post-nominal designation','CPD tracking','Gala ticket priority'],true,2),
('Fellow','Senior leaders, 15+ years',250000,array['Executive cohort access','Awards jury eligibility','Profile in the magazine'],false,3);

insert into public.programmes (title, duration, mode, description, starts_on, price, sort_order) values
('Property & Facility Management','8 weeks','Lagos + Online','Operations, maintenance planning, service charges and tenant relations.','2027-01-19',350000,1),
('Real Estate Valuation Essentials','6 weeks','Online','Valuation methods, reporting standards and market evidence.','2027-02-02',280000,2),
('Executive Leadership in Real Estate','12 weeks','Cohort','Strategy, capital and people leadership for senior professionals.','2027-03-03',950000,3),
('Real Estate Finance & Investment','10 weeks','Hybrid','Deal structuring, feasibility, debt and equity for African markets.','2027-02-16',600000,4);
