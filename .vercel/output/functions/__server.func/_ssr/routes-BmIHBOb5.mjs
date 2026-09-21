import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-mneTlqdy.mjs";
import { n as cn, r as nid, t as Button } from "./button-Cs0QGiGO.mjs";
import { r as clampLevel, t as CONTACT_KINDS } from "./schema-DgVPOgKu.mjs";
import { _ as ChevronUp, a as QrCode, g as CloudDownload, h as Copy, i as Sparkles, m as Download, o as Plus, p as Eraser, r as Trash2, t as X, v as ChevronDown, y as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as publishMyCv, r as getMyPublishedCv } from "./router-K7g2SDbD.mjs";
import { n as CvFrame, r as SkillDots, t as CvDocumentView } from "./cv-frame-C6Bla-hQ.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BmIHBOb5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-10 items-center rounded-[var(--radius-md)] bg-surface-2 p-1 text-muted", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex min-h-8 flex-1 items-center justify-center rounded-[var(--radius-sm)] px-3 text-sm font-medium transition-colors data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-sm", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-3 outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function resolveSignInGateState(input) {
	if (input.isPending) return "pending";
	return input.hasUser ? "signed_in" : "signed_out";
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
function SignInGate({ children, fallback }) {
	const { user, isPending } = useCurrentUserState();
	const state = resolveSignInGateState({
		isPending,
		hasUser: user !== null
	});
	if (state === "pending") return null;
	if (state === "signed_in") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInButtons, {}) });
}
function SignInButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full max-w-sm flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => signIn(p.providerId, { callbackURL: "/" }),
			className: "w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
			children: ["Continue with ", p.label]
		}, p.providerId))
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function group(id, name, skills) {
	return {
		id,
		name,
		skills: skills.map(([skillName, level], index) => ({
			id: `${id}-${index}`,
			name: skillName,
			level
		}))
	};
}
var SAMPLE_CV = {
	name: "Pavlo Shtefanesku",
	title: "Quality Assistance Lead Engineer",
	introHeading: "Hey, I'm Pasha",
	intro: "Starting my career as a AQA Engineer in 2013, I honed my expertise in **automation testing**, driven by the belief in seamless processes and empowered decision-making. From creating test cases to later responsibilities in **requirement analysis**, developing frameworks from scratch and CI support, I evolved into an autonomous QA engineer who leads by example. I advocate for paradigm shift from Quality Assurance to **Quality Assistance**, emphasising **Continuous Testing** throughout the entire development process. This approach ensures a higher quality and reliability in the final product.",
	labels: {
		skills: "Skills",
		contact: "Contact",
		experience: "Experience",
		education: "Education"
	},
	contacts: [
		{
			id: "c-email",
			kind: "email",
			value: "pavlo.shtefanesku@gmail.com"
		},
		{
			id: "c-phone",
			kind: "phone",
			value: "+48796485223"
		},
		{
			id: "c-linkedin",
			kind: "linkedin",
			value: "pavlo.shtefanesku"
		},
		{
			id: "c-location",
			kind: "location",
			value: "Wroclaw"
		}
	],
	skillGroups: [
		group("g-auto", "Web automation toolset", [
			["cypress.io", 5],
			["e2e testing", 5],
			["DD Synthetics", 5],
			["BDD/cucumber", 4],
			["javascript", 5],
			["API testing", 5],
			["postman", 4],
			["git", 4],
			["typescript", 4],
			["selenium", 3],
			["java", 3],
			["performance", 3],
			["appium", 2]
		]),
		group("g-manual", "Manual testing", [
			["requirement analysis", 5],
			["exploratory", 5],
			["mobile", 4],
			["design verification", 4]
		]),
		group("g-soft", "Soft skills", [
			["effective communication", 5],
			["collaboration", 5],
			["leadership", 4],
			["mentorship", 4],
			["learning", 5],
			["prioritisation", 4],
			["problem-solving", 5]
		]),
		group("g-lang", "Languages", [
			["Ukrainian", 5],
			["English", 5],
			["Polish", 3],
			["Romanian", 2]
		])
	],
	experience: [
		{
			id: "job-finder",
			from: "2018",
			to: "Present",
			current: true,
			company: "Finder",
			role: "Senior QA engineer",
			location: "Wroclaw",
			description: "Assisted building and delivering multiple projects throughout the whole process. Proactively **analysed** software projects within different stages like **requirements definition**, **design verification**, implementation, and post go-live maintenance. Designed user journeys in collaboration with PM and Dev (**Three Amigos**). Delivered 90% e2e test coverage for new web features and API services using **cypress & cucumber**. Introduced new testing standards, led meetings, and incentivised improvements in QA collaboration. Mentored junior engineers."
		},
		{
			id: "job-intive",
			from: "2016",
			to: "2018",
			current: false,
			company: "Intive",
			role: "Middle QA engineer",
			location: "Wroclaw",
			description: "Actively involved in developing POC of automated frameworks for web and mobile applications: **Selenium** tests in **Java** and **C#** for web, **Appium** with Java for mobile, Java, **javascript** for **API** tests."
		},
		{
			id: "job-softserve",
			from: "2013",
			to: "2016",
			current: false,
			company: "Softserve",
			role: "Automation QA engineer",
			location: "Chernivtsi",
			description: "Analysed and improved manual test scenarios. Increased e2e automated test coverage by writing smoke, acceptance, and regression cases using **Java+Selenium** framework. Delivered effective reports about completed test runs. Involved in improvements of API test cases."
		}
	],
	education: [{
		id: "edu-chnu",
		from: "2006",
		to: "2010",
		degree: "Bachelor degree in Computer Science",
		school: "Chernivtsi National University, Ukraine",
		details: "Computer systems and networks, algorithms, computer programming, probability theory, etc."
	}]
};
function createSampleCv() {
	return structuredClone(SAMPLE_CV);
}
function createBlankCv() {
	return {
		name: "Imię Nazwisko",
		title: "Stanowisko",
		introHeading: "Cześć, jestem …",
		intro: "Kilka zdań o Twoim doświadczeniu, sposobie pracy i tym, co wnosisz do zespołu. Możesz wyróżnić **ważne frazy** gwiazdkami.",
		labels: {
			skills: "Skills",
			contact: "Contact",
			experience: "Experience",
			education: "Education"
		},
		contacts: [
			{
				id: nid(),
				kind: "email",
				value: "you@email.com"
			},
			{
				id: nid(),
				kind: "phone",
				value: "+48 000 000 000"
			},
			{
				id: nid(),
				kind: "linkedin",
				value: "twoj-profil"
			},
			{
				id: nid(),
				kind: "location",
				value: "Miasto"
			}
		],
		skillGroups: [group(nid(), "Narzędzia", [["Umiejętność", 4], ["Kolejna", 3]])],
		experience: [{
			id: nid(),
			from: "2022",
			to: "Present",
			current: true,
			company: "Firma",
			role: "Rola",
			location: "Miasto",
			description: "Opisz, co dostarczałeś i jaki miał to wpływ."
		}],
		education: [{
			id: nid(),
			from: "2016",
			to: "2020",
			degree: "Kierunek",
			school: "Uczelnia",
			details: "Najważniejsze przedmioty lub wyróżnienia."
		}]
	};
}
function mapGroups(cv, groupId, fn) {
	return {
		...cv,
		skillGroups: cv.skillGroups.map((g) => g.id === groupId ? fn(g) : g)
	};
}
var useCvStore = create()(persist((set) => ({
	cv: createSampleCv(),
	hydrated: false,
	setHydrated: () => set({ hydrated: true }),
	setCv: (cv) => set({ cv }),
	patch: (partial) => set((s) => ({ cv: {
		...s.cv,
		...partial
	} })),
	setLabel: (key, value) => set((s) => ({ cv: {
		...s.cv,
		labels: {
			...s.cv.labels,
			[key]: value
		}
	} })),
	addSkillGroup: () => set((s) => ({ cv: {
		...s.cv,
		skillGroups: [...s.cv.skillGroups, {
			id: nid(),
			name: "Nowa grupa",
			skills: [{
				id: nid(),
				name: "Umiejętność",
				level: 3
			}]
		}]
	} })),
	updateSkillGroup: (id, name) => set((s) => ({ cv: mapGroups(s.cv, id, (g) => ({
		...g,
		name
	})) })),
	removeSkillGroup: (id) => set((s) => ({ cv: {
		...s.cv,
		skillGroups: s.cv.skillGroups.filter((g) => g.id !== id)
	} })),
	moveSkillGroup: (id, dir) => set((s) => {
		const list = [...s.cv.skillGroups];
		const i = list.findIndex((g) => g.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= list.length) return s;
		const tmp = list[i];
		list[i] = list[j];
		list[j] = tmp;
		return { cv: {
			...s.cv,
			skillGroups: list
		} };
	}),
	addSkill: (groupId) => set((s) => ({ cv: mapGroups(s.cv, groupId, (g) => ({
		...g,
		skills: [...g.skills, {
			id: nid(),
			name: "Nowa",
			level: 3
		}]
	})) })),
	updateSkill: (groupId, skillId, patch) => set((s) => ({ cv: mapGroups(s.cv, groupId, (g) => ({
		...g,
		skills: g.skills.map((sk) => sk.id === skillId ? {
			...sk,
			...patch,
			level: patch.level !== void 0 ? clampLevel(patch.level) : sk.level
		} : sk)
	})) })),
	removeSkill: (groupId, skillId) => set((s) => ({ cv: mapGroups(s.cv, groupId, (g) => ({
		...g,
		skills: g.skills.filter((sk) => sk.id !== skillId)
	})) })),
	addExperience: () => set((s) => ({ cv: {
		...s.cv,
		experience: [{
			id: nid(),
			from: String((/* @__PURE__ */ new Date()).getFullYear()),
			to: "Present",
			current: true,
			company: "Firma",
			role: "Rola",
			location: "",
			description: ""
		}, ...s.cv.experience]
	} })),
	updateExperience: (id, patch) => set((s) => ({ cv: {
		...s.cv,
		experience: s.cv.experience.map((item) => item.id === id ? {
			...item,
			...patch,
			to: patch.current === true ? "Present" : patch.to ?? item.to
		} : item)
	} })),
	removeExperience: (id) => set((s) => ({ cv: {
		...s.cv,
		experience: s.cv.experience.filter((item) => item.id !== id)
	} })),
	addEducation: () => set((s) => ({ cv: {
		...s.cv,
		education: [...s.cv.education, {
			id: nid(),
			from: "",
			to: "",
			degree: "Kierunek",
			school: "Uczelnia",
			details: ""
		}]
	} })),
	updateEducation: (id, patch) => set((s) => ({ cv: {
		...s.cv,
		education: s.cv.education.map((item) => item.id === id ? {
			...item,
			...patch
		} : item)
	} })),
	removeEducation: (id) => set((s) => ({ cv: {
		...s.cv,
		education: s.cv.education.filter((item) => item.id !== id)
	} })),
	addContact: (kind) => set((s) => ({ cv: {
		...s.cv,
		contacts: [...s.cv.contacts, {
			id: nid(),
			kind,
			value: ""
		}]
	} })),
	updateContact: (id, patch) => set((s) => ({ cv: {
		...s.cv,
		contacts: s.cv.contacts.map((c) => c.id === id ? {
			...c,
			...patch
		} : c)
	} })),
	removeContact: (id) => set((s) => ({ cv: {
		...s.cv,
		contacts: s.cv.contacts.filter((c) => c.id !== id)
	} })),
	loadSample: () => set({ cv: createSampleCv() }),
	loadBlank: () => set({ cv: createBlankCv() })
}), {
	name: "aureo-cv",
	partialize: (s) => ({ cv: s.cv }),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-10 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-fg shadow-none outline-none transition-colors placeholder:text-faint focus-visible:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-xs font-medium text-muted", className),
	...props
}));
Label.displayName = "Label";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-24 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-faint focus-visible:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var KIND_LABEL = {
	email: "E-mail",
	phone: "Telefon",
	linkedin: "LinkedIn",
	location: "Lokalizacja",
	website: "Strona",
	github: "GitHub"
};
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Section({ title, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-[var(--radius-md)] border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-tight text-fg",
				children: title
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children
		})]
	});
}
function EditorPanel() {
	const cv = useCvStore((s) => s.cv);
	const patch = useCvStore((s) => s.patch);
	const setLabel = useCvStore((s) => s.setLabel);
	const addSkillGroup = useCvStore((s) => s.addSkillGroup);
	const updateSkillGroup = useCvStore((s) => s.updateSkillGroup);
	const removeSkillGroup = useCvStore((s) => s.removeSkillGroup);
	const moveSkillGroup = useCvStore((s) => s.moveSkillGroup);
	const addSkill = useCvStore((s) => s.addSkill);
	const updateSkill = useCvStore((s) => s.updateSkill);
	const removeSkill = useCvStore((s) => s.removeSkill);
	const addExperience = useCvStore((s) => s.addExperience);
	const updateExperience = useCvStore((s) => s.updateExperience);
	const removeExperience = useCvStore((s) => s.removeExperience);
	const addEducation = useCvStore((s) => s.addEducation);
	const updateEducation = useCvStore((s) => s.updateEducation);
	const removeEducation = useCvStore((s) => s.removeEducation);
	const addContact = useCvStore((s) => s.addContact);
	const updateContact = useCvStore((s) => s.updateContact);
	const removeContact = useCvStore((s) => s.removeContact);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Profil",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Imię i nazwisko",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cv.name,
							onChange: (e) => patch({ name: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Stanowisko",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cv.title,
							onChange: (e) => patch({ title: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nagłówek powitania",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cv.introHeading,
							onChange: (e) => patch({ introHeading: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "O mnie (**pogrubienie**)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 6,
							value: cv.intro,
							onChange: (e) => patch({ intro: e.target.value })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Kontakt",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-8 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2 text-xs text-fg",
					defaultValue: "",
					onChange: (e) => {
						const kind = e.target.value;
						if (kind) addContact(kind);
						e.target.value = "";
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						disabled: true,
						children: "Dodaj pole"
					}), CONTACT_KINDS.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: kind,
						children: KIND_LABEL[kind]
					}, kind))]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tytuł sekcji",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: cv.labels.contact,
						onChange: (e) => setLabel("contact", e.target.value)
					})
				}), cv.contacts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: KIND_LABEL[item.kind],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: item.value,
							onChange: (e) => updateContact(item.id, { value: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						"aria-label": "Usuń kontakt",
						onClick: () => removeContact(item.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					})]
				}, item.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Umiejętności",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "secondary",
					onClick: addSkillGroup,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Grupa"]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tytuł sekcji",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: cv.labels.skills,
						onChange: (e) => setLabel("skills", e.target.value)
					})
				}), cv.skillGroups.map((group, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-sm)] border border-border bg-bg p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: group.name,
								onChange: (e) => updateSkillGroup(group.id, e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon-sm",
								variant: "ghost",
								"aria-label": "Wyżej",
								disabled: index === 0,
								onClick: () => moveSkillGroup(group.id, -1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon-sm",
								variant: "ghost",
								"aria-label": "Niżej",
								disabled: index === cv.skillGroups.length - 1,
								onClick: () => moveSkillGroup(group.id, 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon-sm",
								variant: "ghost",
								"aria-label": "Usuń grupę",
								onClick: () => removeSkillGroup(group.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [group.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "min-w-40 flex-1",
									value: skill.name,
									onChange: (e) => updateSkill(group.id, skill.id, { name: e.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillDots, {
									level: skill.level,
									interactive: true,
									onChange: (level) => updateSkill(group.id, skill.id, { level })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "icon-sm",
									variant: "ghost",
									"aria-label": "Usuń umiejętność",
									onClick: () => removeSkill(group.id, skill.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							]
						}, skill.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => addSkill(group.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Umiejętność"]
						})]
					})]
				}, group.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Doświadczenie",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "secondary",
					onClick: addExperience,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Praca"]
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tytuł sekcji",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cv.labels.experience,
							onChange: (e) => setLabel("experience", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Punkty na osi układają się od najnowszej roli — „obecnie” zawsze na górze."
					}),
					cv.experience.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Od",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: job.from,
										onChange: (e) => updateExperience(job.id, { from: e.target.value })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Do",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: job.current ? "Present" : job.to,
										disabled: job.current,
										onChange: (e) => updateExperience(job.id, { to: e.target.value })
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-10 items-center gap-2 text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-accent",
									checked: job.current,
									onChange: (e) => updateExperience(job.id, {
										current: e.target.checked,
										to: e.target.checked ? "Present" : job.to === "Present" ? "" : job.to
									})
								}), "Obecnie pracuję tutaj"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Firma",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: job.company,
									onChange: (e) => updateExperience(job.id, { company: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Rola",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: job.role,
									onChange: (e) => updateExperience(job.id, { role: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Miasto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: job.location,
									onChange: (e) => updateExperience(job.id, { location: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Opis (**pogrubienie**)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 4,
									value: job.description,
									onChange: (e) => updateExperience(job.id, { description: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: () => removeExperience(job.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Usuń pracę"]
							})
						]
					}, job.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Edukacja",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "secondary",
					onClick: addEducation,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Pozycja"]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tytuł sekcji",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: cv.labels.education,
						onChange: (e) => setLabel("education", e.target.value)
					})
				}), cv.education.map((edu) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Od",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: edu.from,
									onChange: (e) => updateEducation(edu.id, { from: e.target.value })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Do",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: edu.to,
									onChange: (e) => updateEducation(edu.id, { to: e.target.value })
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tytuł / kierunek",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: edu.degree,
								onChange: (e) => updateEducation(edu.id, { degree: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Uczelnia",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: edu.school,
								onChange: (e) => updateEducation(edu.id, { school: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Szczegóły",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: edu.details,
								onChange: (e) => updateEducation(edu.id, { details: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => removeEducation(edu.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Usuń"]
						})
					]
				}, edu.id))]
			})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-bg/80", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-fg shadow-xl outline-none", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-[var(--radius-xs)] p-1 text-muted hover:bg-surface-2 hover:text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Zamknij"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-6", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function publicUrl(slug) {
	if (typeof window === "undefined") return `/v/${slug}`;
	return `${window.location.origin}/v/${slug}`;
}
function SignInFallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Zaloguj się, żeby opublikować CV w chmurze i dostać kod QR. Osoby, które go zeskanują, zobaczą podgląd — bez możliwości edycji."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => signIn(p.providerId, { callbackURL: "/" }),
				children: ["Kontynuuj z ", p.label]
			}, p.providerId))
		})]
	});
}
function PublishPanel({ onDone }) {
	const cv = useCvStore((s) => s.cv);
	const setCv = useCvStore((s) => s.setCv);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function publish() {
		setBusy(true);
		try {
			onDone((await publishMyCv({ data: cv })).slug);
			toast.success("CV jest w chmurze");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Nie udało się opublikować";
			if (message.toLowerCase().includes("unauthorized")) toast.error("Zaloguj się, aby udostępnić CV");
			else toast.error(message);
		} finally {
			setBusy(false);
		}
	}
	async function loadCloud() {
		setBusy(true);
		try {
			const mine = await getMyPublishedCv();
			if (!mine) {
				toast.message("Nie masz jeszcze opublikowanego CV");
				return;
			}
			setCv(mine.cv);
			onDone(mine.slug);
			toast.success("Wczytano wersję z chmury");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Nie udało się wczytać");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Publikacja zapisuje aktualną wersję. Kod QR otwiera tylko podgląd — nikt nie zmieni Twojego CV."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				onClick: () => void publish(),
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {}), busy ? "Publikuję…" : "Opublikuj i pokaż QR"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => void loadCloud(),
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, {}), "Wczytaj z chmury"]
			})
		]
	});
}
function QrPanel({ slug }) {
	const [src, setSrc] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const url = publicUrl(slug);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import_lib.toDataURL(url, {
			width: 360,
			margin: 1,
			color: {
				dark: "#1c1f26",
				light: "#f7f4ee"
			}
		}).then((data) => {
			if (!cancelled) setSrc(data);
		}).catch(() => {
			if (!cancelled) toast.error("Nie udało się wygenerować kodu QR");
		});
		return () => {
			cancelled = true;
		};
	}, [url]);
	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Link skopiowany");
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			toast.error("Nie udało się skopiować");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid justify-items-center gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[var(--radius-md)] bg-paper p-3",
				children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "Kod QR do podglądu CV",
					className: "size-44"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-44 animate-pulse bg-surface-2" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs uppercase tracking-[0.2em] text-muted",
				children: slug
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					readOnly: true,
					value: url
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					onClick: () => void copy(),
					children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-muted",
				children: "Skan kodu otwiera publiczny podgląd. Edycja zostaje tylko u Ciebie."
			})
		]
	});
}
function ShareDialog({ open, onOpenChange }) {
	const [slug, setSlug] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (!next) setSlug(null);
			onOpenChange(next);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Udostępnij CV" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Chmura + kod QR do podglądu, bez uprawnień do zmian." })] }), slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPanel, { slug }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInFallback, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishPanel, { onDone: setSlug })
		})] })
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 animate-pulse rounded-full bg-surface-2" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "/login",
		className: "inline-flex h-10 items-center rounded-[var(--radius-sm)] border border-border px-3 text-sm text-muted hover:text-fg",
		children: "Zaloguj"
	});
}
function Studio() {
	const cv = useCvStore((s) => s.cv);
	const loadSample = useCvStore((s) => s.loadSample);
	const loadBlank = useCvStore((s) => s.loadBlank);
	const sheetRef = (0, import_react.useRef)(null);
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	const [mobileTab, setMobileTab] = (0, import_react.useState)("preview");
	async function onDownload() {
		setMobileTab("preview");
		await new Promise((resolve) => window.setTimeout(resolve, 60));
		const node = sheetRef.current;
		if (!node) return;
		setDownloading(true);
		try {
			const { downloadCvPdf } = await import("./pdf-VzEATjJ1.mjs");
			await downloadCvPdf(node, `${cv.name || "cv"}.pdf`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Nie udało się pobrać PDF");
		} finally {
			setDownloading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh overflow-x-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center gap-2 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/",
							className: "mr-auto flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-semibold tracking-tight text-accent",
								children: "Aureo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-xs text-muted sm:inline",
								children: "studio CV"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: loadSample,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Przykład"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: loadBlank,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Puste"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							size: "sm",
							onClick: () => void onDownload(),
							disabled: downloading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							onClick: () => setShareOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {}), "QR"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
							value: mobileTab,
							onValueChange: setMobileTab,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "preview",
									children: "Podgląd"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "edit",
									children: "Edycja"
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("min-w-0", mobileTab === "edit" ? "block" : "hidden", "lg:block"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorPanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("min-w-0", mobileTab === "preview" ? "block" : "hidden", "lg:block"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvFrame, {
							sheetRef,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvDocumentView, { cv })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareDialog, {
				open: shareOpen,
				onOpenChange: setShareOpen
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
