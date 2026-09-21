import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        <p className="text-sm font-semibold tracking-tight text-accent">Aureo</p>
        <h1 className="mt-2 text-xl font-semibold">Zaloguj się</h1>
        <p className="mt-1 mb-5 text-sm text-muted">
          Konto potrzebne jest tylko do publikacji CV w chmurze. Edycja i PDF
          działają bez logowania.
        </p>
        {authEnabled ? (
          <div className="grid gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Kontynuuj z {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Logowanie jest wyłączone.</p>
        )}
        <a href="/" className="mt-5 inline-block text-sm text-muted hover:text-fg">
          Wróć do edytora
        </a>
      </div>
    </main>
  );
}
