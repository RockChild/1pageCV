import { n as createMiddleware } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schema-DgVPOgKu.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-CJYqePGr.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var CONTACT_KINDS = [
	"email",
	"phone",
	"linkedin",
	"location",
	"website",
	"github"
];
function clampLevel(n) {
	if (!Number.isFinite(n)) return 1;
	return Math.min(5, Math.max(1, Math.round(n)));
}
function parseYear(value) {
	const match = value.match(/\d{4}/);
	return match ? Number(match[0]) : 0;
}
function sortExperience(items) {
	return [...items].sort((a, b) => {
		if (a.current && !b.current) return -1;
		if (!a.current && b.current) return 1;
		const aTo = parseYear(a.current ? "9999" : a.to);
		const bTo = parseYear(b.current ? "9999" : b.to);
		if (bTo !== aTo) return bTo - aTo;
		return parseYear(b.from) - parseYear(a.from);
	});
}
function sortEducation(items) {
	return [...items].sort((a, b) => {
		const aTo = parseYear(a.to) || parseYear(a.from);
		const bTo = parseYear(b.to) || parseYear(b.from);
		if (bTo !== aTo) return bTo - aTo;
		return parseYear(b.from) - parseYear(a.from);
	});
}
var skillSchema = object({
	id: string().min(1),
	name: string(),
	level: number().min(1).max(5)
});
var skillGroupSchema = object({
	id: string().min(1),
	name: string(),
	skills: array(skillSchema)
});
var experienceSchema = object({
	id: string().min(1),
	from: string(),
	to: string(),
	current: boolean(),
	company: string(),
	role: string(),
	location: string(),
	description: string()
});
var educationSchema = object({
	id: string().min(1),
	from: string(),
	to: string(),
	degree: string(),
	school: string(),
	details: string()
});
var cvDocumentSchema = object({
	name: string(),
	title: string(),
	introHeading: string(),
	intro: string(),
	labels: object({
		skills: string(),
		contact: string(),
		experience: string(),
		education: string()
	}),
	contacts: array(object({
		id: string().min(1),
		kind: _enum(CONTACT_KINDS),
		value: string()
	})),
	skillGroups: array(skillGroupSchema),
	experience: array(experienceSchema),
	education: array(educationSchema)
});
function parseCvDocument(input) {
	return cvDocumentSchema.parse(input);
}
function parseCvJson(raw) {
	return parseCvDocument(JSON.parse(raw));
}
//#endregion
export { parseCvJson as a, parseCvDocument as i, authMiddleware as n, sortEducation as o, clampLevel as r, sortExperience as s, CONTACT_KINDS as t };
