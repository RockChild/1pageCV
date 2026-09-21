import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, CloudDownload, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInGate } from "@/lib/auth/gates";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { getMyPublishedCv, publishMyCv } from "@/lib/cv/server";
import { useCvStore } from "@/lib/cv/store";

function publicUrl(slug: string) {
  if (typeof window === "undefined") return `/v/${slug}`;
  return `${window.location.origin}/v/${slug}`;
}

function SignInFallback() {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">
        Zaloguj się, żeby opublikować CV w chmurze i dostać kod QR. Osoby, które
        go zeskanują, zobaczą podgląd — bez możliwości edycji.
      </p>
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
    </div>
  );
}

function PublishPanel({
  onDone,
}: {
  onDone: (slug: string) => void;
}) {
  const cv = useCvStore((s) => s.cv);
  const setCv = useCvStore((s) => s.setCv);
  const [busy, setBusy] = useState(false);

  async function publish() {
    setBusy(true);
    try {
      const result = await publishMyCv({ data: cv });
      onDone(result.slug);
      toast.success("CV jest w chmurze");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nie udało się opublikować";
      if (message.toLowerCase().includes("unauthorized")) {
        toast.error("Zaloguj się, aby udostępnić CV");
      } else {
        toast.error(message);
      }
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

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">
        Publikacja zapisuje aktualną wersję. Kod QR otwiera tylko podgląd — nikt
        nie zmieni Twojego CV.
      </p>
      <Button type="button" onClick={() => void publish()} disabled={busy}>
        <QrCode />
        {busy ? "Publikuję…" : "Opublikuj i pokaż QR"}
      </Button>
      <Button type="button" variant="secondary" onClick={() => void loadCloud()} disabled={busy}>
        <CloudDownload />
        Wczytaj z chmury
      </Button>
    </div>
  );
}

function QrPanel({ slug }: { slug: string }) {
  const [src, setSrc] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const url = publicUrl(slug);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 360,
      margin: 1,
      color: { dark: "#1c1f26", light: "#f7f4ee" },
    })
      .then((data) => {
        if (!cancelled) setSrc(data);
      })
      .catch(() => {
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

  return (
    <div className="grid justify-items-center gap-4">
      <div className="rounded-[var(--radius-md)] bg-paper p-3">
        {src ? (
          <img src={src} alt="Kod QR do podglądu CV" className="size-44" />
        ) : (
          <div className="size-44 animate-pulse bg-surface-2" />
        )}
      </div>
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted">
        {slug}
      </p>
      <div className="flex w-full gap-2">
        <Input readOnly value={url} />
        <Button type="button" variant="secondary" onClick={() => void copy()}>
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
      <p className="text-center text-xs text-muted">
        Skan kodu otwiera publiczny podgląd. Edycja zostaje tylko u Ciebie.
      </p>
    </div>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [slug, setSlug] = useState<string | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSlug(null);
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Udostępnij CV</DialogTitle>
          <DialogDescription>
            Chmura + kod QR do podglądu, bez uprawnień do zmian.
          </DialogDescription>
        </DialogHeader>
        {slug ? (
          <QrPanel slug={slug} />
        ) : (
          <SignInGate fallback={<SignInFallback />}>
            <PublishPanel onDone={setSlug} />
          </SignInGate>
        )}
      </DialogContent>
    </Dialog>
  );
}
