import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-BWo_YfTY.mjs";
import { a as parseCvJson, i as parseCvDocument, n as authMiddleware } from "./schema-DgVPOgKu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-ByW5eU47.js
function makeSlug() {
	const bytes = /* @__PURE__ */ new Uint8Array(9);
	crypto.getRandomValues(bytes);
	const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
	return Array.from(bytes, (b) => alphabet[b % 33]).join("");
}
var getPublicCv_createServerFn_handler = createServerRpc({
	id: "bd0e437ec3b35a327525367761302eea6e652fa163dd69c091fadb970db70b08",
	name: "getPublicCv",
	filename: "src/lib/cv/server.ts"
}, (opts) => getPublicCv.__executeServer(opts));
var getPublicCv = createServerFn({ method: "GET" }).validator((slug) => slug.trim()).handler(getPublicCv_createServerFn_handler, async ({ data: slug }) => {
	if (!slug) return null;
	const row = (await (await getSql())`
      select title, data from cvs
      where slug = ${slug} and published = true
      limit 1
    `)[0];
	if (!row) return null;
	try {
		return {
			title: row.title,
			cv: parseCvJson(row.data)
		};
	} catch {
		return null;
	}
});
var getMyPublishedCv_createServerFn_handler = createServerRpc({
	id: "cb351f0cd5f53b2b8f684afb8ad19bbe4e0a2bbc368433802cbf01c6c5afea47",
	name: "getMyPublishedCv",
	filename: "src/lib/cv/server.ts"
}, (opts) => getMyPublishedCv.__executeServer(opts));
var getMyPublishedCv = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyPublishedCv_createServerFn_handler, async ({ context }) => {
	const row = (await (await getSql())`
      select slug, title, data from cvs
      where user_id = ${context.userId}
      limit 1
    `)[0];
	if (!row) return null;
	return {
		slug: row.slug,
		title: row.title,
		cv: parseCvJson(row.data)
	};
});
var publishMyCv_createServerFn_handler = createServerRpc({
	id: "efd050cb7d6332875e71971d04d509d9868c02137666dc3a6c3759a2fb5606ba",
	name: "publishMyCv",
	filename: "src/lib/cv/server.ts"
}, (opts) => publishMyCv.__executeServer(opts));
var publishMyCv = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parseCvDocument(input)).handler(publishMyCv_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const payload = JSON.stringify(data);
	const title = data.name.trim() || "CV";
	const existing = await sql`
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
//#endregion
export { getMyPublishedCv_createServerFn_handler, getPublicCv_createServerFn_handler, publishMyCv_createServerFn_handler };
