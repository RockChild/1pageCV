import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { parseCvDocument, parseCvJson } from "./schema";
import type { CvDocument } from "./types";

function makeSlug() {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const getPublicCv = createServerFn({ method: "GET" })
  .validator((slug: string) => slug.trim())
  .handler(async ({ data: slug }) => {
    if (!slug) return null;
    const sql = await getSql();
    const rows = await sql<{ title: string; data: string }>`
      select title, data from cvs
      where slug = ${slug} and published = true
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    try {
      return { title: row.title, cv: parseCvJson(row.data) };
    } catch {
      return null;
    }
  });

export const getMyPublishedCv = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ slug: string; title: string; data: string }>`
      select slug, title, data from cvs
      where user_id = ${context.userId}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      cv: parseCvJson(row.data),
    };
  });

export const publishMyCv = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CvDocument) => parseCvDocument(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const payload = JSON.stringify(data);
    const title = data.name.trim() || "CV";
    const existing = await sql<{ id: string; slug: string }>`
      select id, slug from cvs where user_id = ${context.userId} limit 1
    `;
    if (existing[0]) {
      await sql`
        update cvs
        set title = ${title},
            data = ${payload},
            published = true,
            updated_at = now()
        where user_id = ${context.userId}
      `;
      return { slug: existing[0].slug };
    }
    const id = crypto.randomUUID();
    const slug = makeSlug();
    await sql`
      insert into cvs (id, user_id, slug, title, data, published)
      values (${id}, ${context.userId}, ${slug}, ${title}, ${payload}, true)
    `;
    return { slug };
  });
