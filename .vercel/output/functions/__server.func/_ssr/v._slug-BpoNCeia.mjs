import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-Cs0QGiGO.mjs";
import { m as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$1 } from "./router-K7g2SDbD.mjs";
import { n as CvFrame, t as CvDocumentView } from "./cv-frame-C6Bla-hQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/v._slug-BpoNCeia.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicCvPage() {
	const { published } = Route$1.useLoaderData();
	const sheetRef = (0, import_react.useRef)(null);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	if (!published) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-accent",
				children: "Aureo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-xl font-semibold",
				children: "Nie znaleziono CV"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Ten kod jest nieaktywny albo CV nie zostało opublikowane."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-4 inline-block text-sm text-accent",
				children: "Otwórz studio"
			})
		] })
	});
	const doc = published;
	async function onDownload() {
		const node = sheetRef.current;
		if (!node) return;
		setDownloading(true);
		try {
			const { downloadCvPdf } = await import("./pdf-VzEATjJ1.mjs");
			await downloadCvPdf(node, `${doc.cv.name || "cv"}.pdf`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Nie udało się pobrać PDF");
		} finally {
			setDownloading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh overflow-x-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-4xl items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "mr-auto text-sm font-semibold text-accent",
						children: "Aureo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs text-muted sm:inline",
						children: "Tylko podgląd"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "secondary",
						onClick: () => void onDownload(),
						disabled: downloading,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Pobierz PDF"]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-4xl px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvFrame, {
				sheetRef,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvDocumentView, { cv: doc.cv })
			})
		})]
	});
}
//#endregion
export { PublicCvPage as component };
