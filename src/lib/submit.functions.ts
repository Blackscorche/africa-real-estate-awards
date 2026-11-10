import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getServerSupabase, getCallerId } from "@/lib/server-supabase";

const email = z.string().trim().email("Enter a valid email").max(255);
const name = z.string().trim().min(2, "Name is too short").max(120);
const opt = (max = 200) => z.string().trim().max(max).optional().default("");

function friendly(message: string) {
  if (message.includes("duplicate key") || message.includes("unique")) return "You're already on the list.";
  return message.replace(/^.*?ERROR:\s*/, "");
}

export const submitNomination = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      categoryId: z.string().uuid("Choose a category"),
      nominee: name,
      company: z.string().trim().min(1, "Company is required").max(160),
      nominatorName: opt(120),
      email,
      phone: opt(40),
      reason: z.string().trim().min(10, "Tell us a little more about why").max(2000),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = getServerSupabase(true);
    const { data: id, error } = await sb.rpc("submit_nomination", {
      _category_id: data.categoryId, _name: data.nominee, _company: data.company,
      _nominator_name: data.nominatorName, _email: data.email, _phone: data.phone, _reason: data.reason,
    });
    if (error) throw new Error(friendly(error.message));
    return { id: id as string };
  });

export const castVote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ nomineeId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: categoryId, error } = await context.supabase.rpc("cast_vote", { _nominee_id: data.nomineeId });
    if (error) throw new Error(friendly(error.message));
    return { categoryId: categoryId as string };
  });

export const applyMembership = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ tier: z.string().trim().min(1).max(80), fullName: name, email, phone: opt(40), organisation: opt(160), country: opt(80), message: opt(1000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = getServerSupabase(true);
    const userId = await getCallerId(sb);
    const { error } = await sb.from("membership_applications").insert({
      user_id: userId, tier: data.tier, full_name: data.fullName, email: data.email, phone: data.phone,
      organisation: data.organisation, country: data.country, message: data.message,
    });
    if (error) throw new Error(friendly(error.message));
    return { ok: true };
  });

export const registerProgramme = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ programmeId: z.string().uuid(), programmeTitle: z.string().max(200), fullName: name, email, phone: opt(40) }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = getServerSupabase(true);
    const userId = await getCallerId(sb);
    const { error } = await sb.from("programme_registrations").insert({
      user_id: userId, programme_id: data.programmeId, programme_title: data.programmeTitle,
      full_name: data.fullName, email: data.email, phone: data.phone,
    });
    if (error) throw new Error(friendly(error.message));
    return { ok: true };
  });

export const bookTickets = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      packageId: z.string().uuid("Choose a package"), packageName: z.string().max(160),
      quantity: z.coerce.number().int().min(1).max(50), fullName: name, email, phone: opt(40), company: opt(160),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = getServerSupabase(true);
    const userId = await getCallerId(sb);
    const { error } = await sb.from("ticket_orders").insert({
      user_id: userId, package_id: data.packageId, package_name: data.packageName, quantity: data.quantity,
      full_name: data.fullName, email: data.email, phone: data.phone, company: data.company,
    });
    if (error) throw new Error(friendly(error.message));
    return { ok: true };
  });

export const subscribe = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ email, fullName: opt(120), format: opt(60), source: z.enum(["magazine", "newsletter"]).default("magazine") }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = getServerSupabase(true);
    const userId = await getCallerId(sb);
    const { error } = await sb.from("subscriptions").insert({
      user_id: userId, email: data.email.toLowerCase(), full_name: data.fullName, format: data.format || "Digital only", source: data.source,
    });
    if (error && !error.message.includes("duplicate")) throw new Error(friendly(error.message));
    return { ok: true, already: !!error };
  });

export const sendEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      kind: z.enum(["contact", "advertising", "sponsorship", "profile_request"]),
      fullName: name, email, phone: opt(40), company: opt(160), message: z.string().trim().min(5, "Add a short message").max(3000),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = getServerSupabase(true);
    const userId = await getCallerId(sb);
    const { error } = await sb.from("enquiries").insert({
      user_id: userId, kind: data.kind, full_name: data.fullName, email: data.email, phone: data.phone, company: data.company, message: data.message,
    });
    if (error) throw new Error(friendly(error.message));
    return { ok: true };
  });
