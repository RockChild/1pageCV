import { useRef, useState } from "react";
import { Download, Eraser, QrCode, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useCvStore } from "@/lib/cv/store";
import { cn } from "@/lib/utils";
import { CvDocumentView } from "./cv-document";
import { CvFrame } from "./cv-frame";
import { EditorPanel } from "./editor-panel";
import { ShareDialog } from "./share-dialog";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-surface-2" />;
  }
  if (user) return <UserButton />;
  return (
    <a
      href="/login"
      className="inline-flex h-10 items-center rounded-[var(--radius-sm)] border border-border px-3 text-sm text-muted hover:text-fg"
    >
      Zaloguj
    </a>
  );
}

export function Studio() {
  const cv = useCvStore((s) => s.cv);
  const loadSample = useCvStore((s) => s.loadSample);
  const loadBlank = useCvStore((s) => s.loadBlank);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState("preview");

  async function onDownload() {
    setMobileTab("preview");
    await new Promise((resolve) => window.setTimeout(resolve, 60));
    const node = sheetRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      const { downloadCvPdf } = await import("@/lib/cv/pdf");
      await downloadCvPdf(node, `${cv.name || "cv"}.pdf`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nie udało się pobrać PDF");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
          <a href="/" className="mr-auto flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-accent">Aureo</span>
            <span className="hidden text-xs text-muted sm:inline">studio CV</span>
          </a>
          <Button type="button" variant="ghost" size="sm" onClick={loadSample}>
            <Sparkles />
            <span className="hidden sm:inline">Przykład</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={loadBlank}>
            <Eraser />
            <span className="hidden sm:inline">Puste</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void onDownload()}
            disabled={downloading}
          >
            <Download />
            PDF
          </Button>
          <Button type="button" size="sm" onClick={() => setShareOpen(true)}>
            <QrCode />
            QR
          </Button>
          <AuthSlot />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="lg:hidden">
          <Tabs value={mobileTab} onValueChange={setMobileTab}>
            <TabsList className="w-full">
              <TabsTrigger value="preview">Podgląd</TabsTrigger>
              <TabsTrigger value="edit">Edycja</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className={cn("min-w-0", mobileTab === "edit" ? "block" : "hidden", "lg:block")}>
          <EditorPanel />
        </div>
        <div className={cn("min-w-0", mobileTab === "preview" ? "block" : "hidden", "lg:block")}>
          <CvFrame sheetRef={sheetRef}>
            <CvDocumentView cv={cv} />
          </CvFrame>
        </div>
      </div>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
