import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-Cs0QGiGO.mjs";
import { o as sortEducation, s as sortExperience } from "./schema-DgVPOgKu.mjs";
import { c as MapPin, d as Globe, f as Github, l as Mail, s as Phone, u as Linkedin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cv-frame-C6Bla-hQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RichText({ text, className }) {
	const parts = text.split(/(\*\*[^*]+\*\*)/g);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className,
		children: parts.map((part, i) => {
			if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: part.slice(2, -2) }, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
		})
	});
}
function SkillDots({ level, interactive = false, onChange }) {
	const value = Math.min(5, Math.max(0, Math.round(level)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: interactive ? "flex gap-1" : "cv-dots",
		role: "img",
		"aria-label": `${value} z 5`,
		children: Array.from({ length: 5 }, (_, i) => {
			const n = i + 1;
			const on = n <= value;
			if (!interactive) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("cv-dot", on && "is-on") }, n);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Poziom ${n}`,
				onClick: () => onChange?.(n),
				className: cn("size-4 rounded-full border transition-colors", on ? "border-accent bg-accent" : "border-faint bg-transparent")
			}, n);
		})
	});
}
var CONTACT_ICONS = {
	email: Mail,
	phone: Phone,
	linkedin: Linkedin,
	location: MapPin,
	website: Globe,
	github: Github
};
function CvDocumentView({ cv }) {
	const jobs = sortExperience(cv.experience);
	const schools = sortEducation(cv.education);
	const contacts = cv.contacts.filter((c) => c.value.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "cv-sidebar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "cv-sidebar-title",
			children: cv.labels.skills
		}), cv.skillGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cv-group",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "cv-group-title",
				children: group.name
			}), group.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cv-skill",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cv-skill-name",
					children: skill.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillDots, { level: skill.level })]
			}, skill.id))]
		}, group.id))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cv-contact",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cv-sidebar-title",
				children: cv.labels.contact
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cv-contact-list",
				children: contacts.map((item) => {
					const Icon = CONTACT_ICONS[item.kind];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cv-contact-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "cv-contact-icon",
							strokeWidth: 2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.value })]
					}, item.id);
				})
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cv-main",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cv-name",
				children: cv.name
			}),
			cv.title.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "cv-role",
				children: cv.title
			}) : null,
			cv.introHeading.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cv-intro-title",
				children: cv.introHeading
			}) : null,
			cv.intro.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
				text: cv.intro,
				className: "cv-intro"
			}) : null,
			jobs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cv-section-title",
				children: cv.labels.experience
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "cv-timeline",
				children: jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "cv-job",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cv-job-mark" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "cv-job-dates",
							children: [
								job.from,
								" – ",
								job.current ? "Present" : job.to
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "cv-job-company",
							children: job.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "cv-job-meta",
							children: [job.role, job.location].filter(Boolean).join(", ")
						}),
						job.description.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
							text: job.description,
							className: "cv-copy"
						}) : null
					]
				}, job.id))
			})] }) : null,
			schools.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cv-section-title",
				children: cv.labels.education
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "cv-timeline",
				children: schools.map((edu) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "cv-edu",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cv-edu-mark" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "cv-edu-dates",
							children: [edu.from, edu.to ? ` – ${edu.to}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "cv-edu-degree",
							children: edu.degree
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "cv-edu-school",
							children: edu.school
						}),
						edu.details.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
							text: edu.details,
							className: "cv-copy"
						}) : null
					]
				}, edu.id))
			})] }) : null
		]
	})] });
}
var SHEET_W = 794;
var SHEET_H = 1123;
function CvFrame({ sheetRef, children }) {
	const frameRef = (0, import_react.useRef)(null);
	const [scale, setScale] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		const el = frameRef.current;
		if (!el) return;
		const update = () => setScale(Math.min(1, el.clientWidth / SHEET_W));
		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: frameRef,
		className: "w-full overflow-x-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: { height: SHEET_H * scale },
			className: "relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sheetRef,
				className: "cv-sheet origin-top-left shadow-2xl",
				style: { transform: `scale(${scale})` },
				children
			})
		})
	});
}
//#endregion
export { CvFrame as n, SkillDots as r, CvDocumentView as t };
