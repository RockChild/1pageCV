import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CvDocumentView } from "@/components/cv/cv-document";
import { CvFrame } from "@/components/cv/cv-frame";
import { getPublicCv } from "@/lib/cv/server";

export const Route = createFileRoute("/v/$slug")({
  loader: async ({ params }) => {
    const published = await getPublicCv({ data: params.slug });
    return { published };
  },
  component: PublicCvPage,
});

function PublicCvPage() {
  const { published } = Route.useLoaderData();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!published) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
        <div>
          <p className="text-sm font-semibold text-accent">Aureo</p>
          <h1 className="mt-2 text-xl font-semibold">Nie znaleziono CV</h1>
          <p className="mt-2 text-sm text-muted">
            Ten kod jest nieaktywny albo CV nie zostało opublikowane.
          </p>
          <a href="/" className="mt-4 inline-block text-sm text-accent">
            Otwórz studio
          </a>
        </div>
      </main>
    );
  }

  const doc = published;

  async function onDownload() {
    const node = sheetRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      const { downloadCvPdf } = await import("@/lib/cv/pdf");
      await downloadCvPdf(node, `${doc.cv.name || "cv"}.pdf`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nie udało się pobrać PDF");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <a href="/" className="mr-auto text-sm font-semibold text-accent">
            Aureo
          </a>
          <span className="hidden text-xs text-muted sm:inline">Tylko podgląd</span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => void onDownload()}
            disabled={downloading}
          >
            <Download />
            Pobierz PDF
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <CvFrame sheetRef={sheetRef}>
          <CvDocumentView cv={doc.cv} />
        </CvFrame>
      </div>
    </div>
  );
}
