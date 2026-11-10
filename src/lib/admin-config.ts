/**
 * Describes every section the admin dashboard can edit. Adding a table to the
 * dashboard = adding one entry here; CollectionManager renders list + form from it.
 */
export type FieldType = "text" | "textarea" | "longtext" | "number" | "boolean" | "image" | "date" | "datetime" | "select" | "tags" | "relation" | "slug";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  relation?: { table: string; label: string };
  required?: boolean;
  help?: string;
  from?: string; // slug source field
};

export type Collection = {
  key: string;
  label: string;
  group: "Website" | "Awards" | "Media" | "Institute" | "Inbox";
  table: string;
  description: string;
  fields: Field[];
  columns: string[];
  order: { column: string; ascending: boolean };
  canCreate?: boolean;
  canEdit?: boolean;
  search?: string[];
  exportable?: boolean;
};

const sort: Field = { name: "sort_order", label: "Order", type: "number", help: "Lower numbers appear first" };

export const collections: Collection[] = [
  // ---------- Website ----------
  {
    key: "hero-slides", label: "Home slider", group: "Website", table: "hero_slides",
    description: "The rotating banner at the top of the home page.",
    fields: [
      { name: "eyebrow", label: "Small heading", type: "text" },
      { name: "title", label: "Headline", type: "text", required: true },
      { name: "highlight", label: "Highlighted words", type: "text", help: "Shown in the accent colour after the headline" },
      { name: "body", label: "Text", type: "textarea" },
      { name: "cta_label", label: "Main button label", type: "text" },
      { name: "cta_link", label: "Main button link", type: "text", help: "e.g. /awards#nominate or https://…" },
      { name: "alt_label", label: "Second button label", type: "text" },
      { name: "alt_link", label: "Second button link", type: "text" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "panel", label: "Overlay panel", type: "select", options: ["image", "countdown", "tiers"] },
      sort, { name: "active", label: "Visible", type: "boolean" },
    ],
    columns: ["image_url", "title", "highlight", "panel", "active", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "home-cards", label: "Home cards", group: "Website", table: "home_cards",
    description: "The four section cards on the home page.",
    fields: [
      { name: "tag", label: "Tag", type: "text" }, { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Text", type: "textarea" }, { name: "cta_label", label: "Link label", type: "text" },
      { name: "link", label: "Link", type: "text" }, { name: "highlighted", label: "Highlighted", type: "boolean" }, sort, { name: "published", label: "Visible", type: "boolean" },
    ],
    columns: ["tag", "title", "link", "highlighted", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "menu", label: "Menu links", group: "Website", table: "nav_links",
    description: "Links in the top menu and footer.",
    fields: [{ name: "label", label: "Label", type: "text", required: true }, { name: "url", label: "Link", type: "text", required: true }, sort, { name: "active", label: "Visible", type: "boolean" }],
    columns: ["label", "url", "active", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "partners", label: "Partners", group: "Website", table: "partners",
    description: "Partner logos shown across the site.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "mark", label: "Wordmark (first part)", type: "text" },
      { name: "accent", label: "Wordmark (accent part)", type: "text" }, { name: "logo_url", label: "Logo image (optional)", type: "image" },
      { name: "website", label: "Website", type: "text" }, sort, { name: "published", label: "Visible", type: "boolean" },
    ],
    columns: ["logo_url", "name", "website", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "faqs", label: "FAQs", group: "Website", table: "faqs",
    description: "Questions & answers on the Awards, Institute and Magazine pages.",
    fields: [
      { name: "section", label: "Page", type: "select", options: ["awards", "institute", "magazine", "general"] },
      { name: "question", label: "Question", type: "text", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true }, sort, { name: "published", label: "Visible", type: "boolean" },
    ],
    columns: ["section", "question", "sort_order"], order: { column: "sort_order", ascending: true }, search: ["question"],
  },
  // ---------- Awards ----------
  {
    key: "categories", label: "Categories", group: "Awards", table: "award_categories",
    description: "Award categories people can nominate and vote in.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "group_name", label: "Group", type: "text", help: "e.g. Residential, Commercial" },
      { name: "description", label: "Description", type: "textarea" }, sort, { name: "active", label: "Open", type: "boolean" },
    ],
    columns: ["name", "group_name", "active", "sort_order"], order: { column: "sort_order", ascending: true }, search: ["name"],
  },
  {
    key: "nominees", label: "Nominees", group: "Awards", table: "nominees",
    description: "Everyone on the voting board. Mark finalists and winners, or hide entries.",
    fields: [
      { name: "category_id", label: "Category", type: "relation", relation: { table: "award_categories", label: "name" }, required: true },
      { name: "name", label: "Nominee / project", type: "text", required: true }, { name: "company", label: "Company", type: "text" },
      { name: "citation", label: "Citation", type: "textarea" }, { name: "image_url", label: "Photo", type: "image" },
      { name: "status", label: "Status", type: "select", options: ["published", "shortlisted", "winner", "hidden"] },
      { name: "vote_count", label: "Votes", type: "number" },
    ],
    columns: ["image_url", "name", "category_id", "company", "status", "vote_count"], order: { column: "vote_count", ascending: false }, search: ["name", "company"], exportable: true,
  },
  {
    key: "nominations", label: "Nomination forms", group: "Awards", table: "nomination_details",
    description: "Every nomination form submitted, with the nominator's contact details.",
    fields: [
      { name: "nominee_id", label: "Nominee", type: "relation", relation: { table: "nominees", label: "name" } },
      { name: "nominator_name", label: "Nominator", type: "text" }, { name: "nominator_email", label: "Email", type: "text" },
      { name: "nominator_phone", label: "Phone", type: "text" }, { name: "reason", label: "Reason", type: "textarea" },
    ],
    columns: ["nominee_id", "nominator_name", "nominator_email", "reason", "created_at"], order: { column: "created_at", ascending: false },
    canCreate: false, canEdit: false, search: ["nominator_email", "nominator_name"], exportable: true,
  },
  {
    key: "timeline", label: "Key dates", group: "Awards", table: "award_timeline",
    description: "The awards timeline.",
    fields: [{ name: "label", label: "Milestone", type: "text", required: true }, { name: "date_text", label: "Date", type: "text", required: true }, { name: "body", label: "Details", type: "textarea" }, sort, { name: "published", label: "Visible", type: "boolean" }],
    columns: ["label", "date_text", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "judges", label: "Jury", group: "Awards", table: "judges",
    description: "Judges shown on the Awards page.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "title", label: "Title", type: "text" },
      { name: "organisation", label: "Organisation", type: "text" }, { name: "bio", label: "Bio", type: "textarea" },
      { name: "image_url", label: "Photo", type: "image" }, sort, { name: "published", label: "Visible", type: "boolean" },
    ],
    columns: ["image_url", "name", "title", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "tickets", label: "Ticket packages", group: "Awards", table: "ticket_packages",
    description: "Gala seats and tables.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "price", label: "Price", type: "number" },
      { name: "currency", label: "Currency", type: "select", options: ["NGN", "USD", "GHS", "KES", "ZAR", "GBP"] },
      { name: "seats", label: "Seats", type: "number" }, { name: "description", label: "Description", type: "textarea" },
      { name: "perks", label: "Perks", type: "tags", help: "One per line" }, { name: "featured", label: "Featured", type: "boolean" }, sort,
      { name: "active", label: "On sale", type: "boolean" },
    ],
    columns: ["name", "price", "seats", "active", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  // ---------- Media ----------
  {
    key: "news", label: "News articles", group: "Media", table: "news_articles",
    description: "Stories in the newsroom.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true }, { name: "slug", label: "Web address", type: "slug", from: "title" },
      { name: "tag", label: "Tag", type: "text" }, { name: "excerpt", label: "Summary", type: "textarea" },
      { name: "body", label: "Story", type: "longtext", help: "Leave a blank line between paragraphs" },
      { name: "image_url", label: "Image", type: "image" }, { name: "author", label: "Author", type: "text" },
      { name: "read_time", label: "Read time", type: "text" }, { name: "published_at", label: "Publish date", type: "datetime" },
      { name: "featured", label: "Featured", type: "boolean" }, { name: "published", label: "Published", type: "boolean" },
    ],
    columns: ["image_url", "title", "tag", "published", "published_at"], order: { column: "published_at", ascending: false }, search: ["title", "tag"],
  },
  {
    key: "issues", label: "Magazine issues", group: "Media", table: "magazine_issues",
    description: "Issues and covers.",
    fields: [
      { name: "issue_label", label: "Issue label", type: "text", required: true, help: "e.g. Issue 12 · Q4 2026" },
      { name: "title", label: "Edition title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea" },
      { name: "cover_url", label: "Cover", type: "image" }, { name: "digital_url", label: "Digital edition link", type: "text" },
      { name: "is_current", label: "Current issue", type: "boolean" }, sort, { name: "published", label: "Visible", type: "boolean" },
    ],
    columns: ["cover_url", "issue_label", "title", "is_current", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "stories", label: "Magazine stories", group: "Media", table: "magazine_stories",
    description: "Stories inside each issue.",
    fields: [
      { name: "issue_id", label: "Issue", type: "relation", relation: { table: "magazine_issues", label: "issue_label" } },
      { name: "title", label: "Title", type: "text", required: true }, { name: "slug", label: "Web address", type: "slug", from: "title" },
      { name: "tag", label: "Tag", type: "text" }, { name: "excerpt", label: "Summary", type: "textarea" },
      { name: "body", label: "Story", type: "longtext" }, { name: "image_url", label: "Image", type: "image" },
      { name: "is_lead", label: "Cover story", type: "boolean" }, sort, { name: "published", label: "Published", type: "boolean" },
    ],
    columns: ["image_url", "title", "issue_id", "is_lead", "published"], order: { column: "sort_order", ascending: true }, search: ["title"],
  },
  {
    key: "profiles", label: "People profiles", group: "Media", table: "people_profiles",
    description: "Profiles of industry leaders.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Web address", type: "slug", from: "name" },
      { name: "role", label: "Role", type: "text" }, { name: "city", label: "City", type: "text" },
      { name: "quote", label: "Quote", type: "textarea" }, { name: "bio", label: "Short bio", type: "textarea" },
      { name: "body", label: "Full profile", type: "longtext" }, { name: "image_url", label: "Photo", type: "image" }, sort,
      { name: "published", label: "Published", type: "boolean" },
    ],
    columns: ["image_url", "name", "role", "city", "published"], order: { column: "sort_order", ascending: true }, search: ["name"],
  },
  // ---------- Institute ----------
  {
    key: "tiers", label: "Membership tiers", group: "Institute", table: "membership_tiers",
    description: "Membership levels and annual fees.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "audience", label: "Who it's for", type: "text" },
      { name: "price", label: "Annual fee", type: "number" }, { name: "currency", label: "Currency", type: "select", options: ["NGN", "USD", "GHS", "KES", "ZAR", "GBP"] },
      { name: "perks", label: "Benefits", type: "tags", help: "One per line" }, { name: "featured", label: "Most chosen", type: "boolean" }, sort, { name: "published", label: "Visible", type: "boolean" },
    ],
    columns: ["name", "audience", "price", "featured", "sort_order"], order: { column: "sort_order", ascending: true },
  },
  {
    key: "programmes", label: "Programmes", group: "Institute", table: "programmes",
    description: "Training programmes people can register for.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true }, { name: "duration", label: "Duration", type: "text" },
      { name: "mode", label: "Format", type: "text" }, { name: "description", label: "Description", type: "textarea" },
      { name: "starts_on", label: "Start date", type: "date" }, { name: "price", label: "Fee", type: "number" },
      { name: "currency", label: "Currency", type: "select", options: ["NGN", "USD", "GHS", "KES", "ZAR", "GBP"] }, sort,
      { name: "active", label: "Open for registration", type: "boolean" },
    ],
    columns: ["title", "duration", "starts_on", "price", "active"], order: { column: "sort_order", ascending: true },
  },
  // ---------- Inbox ----------
  {
    key: "applications", label: "Membership applications", group: "Inbox", table: "membership_applications",
    description: "Approve or reject membership applications.",
    fields: [
      { name: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected"] },
      { name: "admin_note", label: "Note to applicant", type: "textarea", help: "Shown in their dashboard" },
      { name: "tier", label: "Tier", type: "text" }, { name: "full_name", label: "Name", type: "text" }, { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" }, { name: "organisation", label: "Organisation", type: "text" }, { name: "country", label: "Country", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
    ],
    columns: ["full_name", "email", "tier", "status", "created_at"], order: { column: "created_at", ascending: false }, canCreate: false, search: ["full_name", "email"], exportable: true,
  },
  {
    key: "registrations", label: "Programme registrations", group: "Inbox", table: "programme_registrations",
    description: "People registered for training programmes.",
    fields: [
      { name: "status", label: "Status", type: "select", options: ["pending", "confirmed", "cancelled"] },
      { name: "programme_title", label: "Programme", type: "text" }, { name: "full_name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "text" }, { name: "phone", label: "Phone", type: "text" },
    ],
    columns: ["full_name", "email", "programme_title", "status", "created_at"], order: { column: "created_at", ascending: false }, canCreate: false, search: ["full_name", "email"], exportable: true,
  },
  {
    key: "bookings", label: "Gala bookings", group: "Inbox", table: "ticket_orders",
    description: "Seat and table booking requests.",
    fields: [
      { name: "status", label: "Status", type: "select", options: ["pending", "confirmed", "cancelled"] },
      { name: "package_name", label: "Package", type: "text" }, { name: "quantity", label: "Quantity", type: "number" },
      { name: "full_name", label: "Name", type: "text" }, { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" }, { name: "company", label: "Company", type: "text" },
    ],
    columns: ["full_name", "email", "package_name", "quantity", "status", "created_at"], order: { column: "created_at", ascending: false }, canCreate: false, search: ["full_name", "email", "company"], exportable: true,
  },
  {
    key: "subscribers", label: "Subscribers", group: "Inbox", table: "subscriptions",
    description: "Magazine and newsletter subscribers.",
    fields: [
      { name: "email", label: "Email", type: "text", required: true }, { name: "full_name", label: "Name", type: "text" },
      { name: "format", label: "Format", type: "select", options: ["Print & digital", "Digital only", "Print only"] },
      { name: "source", label: "List", type: "select", options: ["magazine", "newsletter"] },
    ],
    columns: ["email", "full_name", "source", "format", "created_at"], order: { column: "created_at", ascending: false }, search: ["email", "full_name"], exportable: true,
  },
  {
    key: "enquiries", label: "Enquiries", group: "Inbox", table: "enquiries",
    description: "Advertising, sponsorship, profile and general enquiries.",
    fields: [
      { name: "status", label: "Status", type: "select", options: ["new", "handled"] },
      { name: "kind", label: "Type", type: "select", options: ["contact", "advertising", "sponsorship", "profile_request"] },
      { name: "full_name", label: "Name", type: "text" }, { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" }, { name: "company", label: "Company", type: "text" }, { name: "message", label: "Message", type: "textarea" },
    ],
    columns: ["full_name", "email", "kind", "status", "created_at"], order: { column: "created_at", ascending: false }, canCreate: false, search: ["full_name", "email", "company"], exportable: true,
  },
];

export const collectionGroups = ["Website", "Awards", "Media", "Institute", "Inbox"] as const;

export function findCollection(key: string) {
  return collections.find((c) => c.key === key);
}

/** Page text blocks stored in site_settings — every key/field here is editable. */
export type SettingsField = { name: string; label: string; type: "text" | "textarea" | "image" | "boolean" | "datetime" };
export const settingsSections: { key: string; label: string; fields: SettingsField[] }[] = [
  { key: "brand", label: "Brand & contact", fields: [
    { name: "name", label: "Site name", type: "text" }, { name: "short_mark", label: "Logo text", type: "text" }, { name: "short_accent", label: "Logo accent letter", type: "text" },
    { name: "tagline", label: "Tagline", type: "text" }, { name: "email", label: "Contact email", type: "text" }, { name: "phone", label: "Phone", type: "text" },
    { name: "address", label: "Address", type: "text" }, { name: "header_cta_label", label: "Header button label", type: "text" }, { name: "header_cta_link", label: "Header button link", type: "text" },
    { name: "instagram", label: "Instagram URL", type: "text" }, { name: "linkedin", label: "LinkedIn URL", type: "text" }, { name: "x", label: "X / Twitter URL", type: "text" }, { name: "facebook", label: "Facebook URL", type: "text" },
  ] },
  { key: "announcement", label: "Advert banner", fields: [
    { name: "enabled", label: "Show banner", type: "boolean" }, { name: "label", label: "Small label", type: "text" }, { name: "text", label: "Text", type: "text" },
    { name: "link_label", label: "Link label", type: "text" }, { name: "link_url", label: "Link", type: "text" },
  ] },
  { key: "home", label: "Home page", fields: [
    { name: "stat1_value", label: "Stat 1 value", type: "text" }, { name: "stat1_label", label: "Stat 1 label", type: "text" },
    { name: "stat2_value", label: "Stat 2 value", type: "text" }, { name: "stat2_label", label: "Stat 2 label", type: "text" },
    { name: "stat3_value", label: "Stat 3 value", type: "text" }, { name: "stat3_label", label: "Stat 3 label", type: "text" },
    { name: "stat4_value", label: "Stat 4 value", type: "text" }, { name: "stat4_label", label: "Stat 4 label", type: "text" },
    { name: "gala_eyebrow", label: "Gala band — small heading", type: "text" }, { name: "gala_title", label: "Gala band — headline", type: "text" },
    { name: "gala_text", label: "Gala band — text", type: "textarea" }, { name: "gala_image", label: "Gala band — image", type: "image" },
    { name: "magazine_eyebrow", label: "Magazine strip — small heading", type: "text" }, { name: "magazine_title", label: "Magazine strip — headline", type: "text" },
    { name: "magazine_text", label: "Magazine strip — text", type: "textarea" },
  ] },
  { key: "awards", label: "Awards page & event", fields: [
    { name: "nominations_open", label: "Nominations open", type: "boolean" }, { name: "voting_open", label: "Voting open", type: "boolean" },
    { name: "show_vote_counts", label: "Show live vote counts", type: "boolean" },
    { name: "event_date", label: "Gala date & time", type: "datetime" }, { name: "venue", label: "Venue", type: "text" }, { name: "venue_detail", label: "Venue detail", type: "text" },
    { name: "status_text", label: "Status headline", type: "text" }, { name: "status_detail", label: "Status detail", type: "text" },
    { name: "eyebrow", label: "Page small heading", type: "text" }, { name: "title", label: "Page headline", type: "text" }, { name: "intro", label: "Page intro", type: "textarea" },
    { name: "hero_image", label: "Page image", type: "image" }, { name: "tickets_title", label: "Tickets headline", type: "text" }, { name: "tickets_text", label: "Tickets text", type: "textarea" },
  ] },
  { key: "institute", label: "Institute page", fields: [
    { name: "eyebrow", label: "Small heading", type: "text" }, { name: "title", label: "Headline", type: "text" }, { name: "intro", label: "Intro", type: "textarea" }, { name: "hero_image", label: "Image", type: "image" },
  ] },
  { key: "news", label: "News page", fields: [
    { name: "eyebrow", label: "Small heading", type: "text" }, { name: "title", label: "Headline", type: "text" }, { name: "intro", label: "Intro", type: "textarea" },
  ] },
  { key: "magazine", label: "Magazine page", fields: [
    { name: "eyebrow", label: "Small heading", type: "text" }, { name: "title", label: "Headline", type: "text" }, { name: "intro", label: "Intro", type: "textarea" },
    { name: "subscribe_note", label: "Subscribe note", type: "text" }, { name: "next_issue_text", label: "Message after subscribing", type: "text" },
  ] },
  { key: "profiles", label: "Profiles page", fields: [
    { name: "eyebrow", label: "Small heading", type: "text" }, { name: "title", label: "Headline", type: "text" }, { name: "intro", label: "Intro", type: "textarea" },
  ] },
  { key: "advertise", label: "Advertise page", fields: [
    { name: "eyebrow", label: "Small heading", type: "text" }, { name: "title", label: "Headline", type: "text" }, { name: "intro", label: "Intro", type: "textarea" },
    { name: "option1_title", label: "Option 1 title", type: "text" }, { name: "option1_text", label: "Option 1 text", type: "textarea" },
    { name: "option2_title", label: "Option 2 title", type: "text" }, { name: "option2_text", label: "Option 2 text", type: "textarea" },
    { name: "option3_title", label: "Option 3 title", type: "text" }, { name: "option3_text", label: "Option 3 text", type: "textarea" },
  ] },
  { key: "footer", label: "Footer", fields: [
    { name: "about", label: "About text", type: "textarea" }, { name: "bottom_line", label: "Bottom line", type: "text" },
  ] },
];

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
