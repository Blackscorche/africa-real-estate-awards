<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All site content lives in Lovable Cloud tables; page copy is one JSON object per key in `site_settings` — keeps every word editable from /admin without code changes.
- Admin CRUD screens are generated from `src/lib/admin-config.ts` (collections + settingsSections) via `CollectionManager` — adding an editable table means adding a config entry, not a new page.
- Public reads go through server functions in `src/lib/content.functions.ts` (anon key, SSR-safe); form submissions go through `src/lib/submit.functions.ts`, forwarding the visitor's token when signed in so RLS attributes rows to them.
- Voting and nomination rules (one vote per category per account, no duplicate nominee per category, open/closed switches) are enforced in the database functions `cast_vote` / `submit_nomination`, not in the UI.
- Admin rights come only from `user_roles` via `has_role`; the first account ever created is auto-granted admin by the signup trigger.
- The `media` bucket is private (workspace blocks public buckets); uploads store a 10-year signed URL in the content row.
- Shared header/footer render once in `__root.tsx`; `/admin` renders its own layout without the site chrome.
- Light/dark mode is a `light`/`dark` class on `<html>` set by an inline head script from localStorage (no flash); every colour is a CSS token in `src/styles.css` with dark defaults, `:root.light` neutrals and `.light .theme-<section>` accent overrides — components never branch on theme.
