import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as signIn } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-mneTlqdy.mjs";
import { t as Button } from "./button-Cs0QGiGO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DsoVL4yX.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold tracking-tight text-accent",
					children: "Aureo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-xl font-semibold",
					children: "Zaloguj się"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-5 text-sm text-muted",
					children: "Konto potrzebne jest tylko do publikacji CV w chmurze. Edycja i PDF działają bez logowania."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						children: ["Kontynuuj z ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "mt-5 inline-block text-sm text-muted hover:text-fg",
					children: "Wróć do edytora"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
