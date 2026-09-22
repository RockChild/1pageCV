import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_W_MM = 210;
const A4_H_MM = 297;

export async function downloadCvPdf(source: HTMLElement, filename: string, opts = { debugCanvas: false, minDPR: 2 }) {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.zIndex = "9999";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.width = "794px";
  clone.style.minHeight = "1123px";
  document.body.appendChild(clone);

  try {
    // 1) Wait for fonts to be ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 2) Use devicePixelRatio (or higher) for crisp rendering
    const DPR = Math.max(window.devicePixelRatio || 1, opts.minDPR || 2);

    // 3) Create canvas snapshot
    const canvas = await html2canvas(clone, {
      scale: DPR,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Optional debug: append canvas to body so you can visually compare UI vs canvas
    if (opts.debugCanvas) {
      canvas.style.position = "fixed";
      canvas.style.right = "10px";
      canvas.style.top = "10px";
      canvas.style.border = "2px solid red";
      canvas.style.zIndex = "99999";
      document.body.appendChild(canvas);
    }

    // 4) Prepare PDF and slicing using integer math
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // image height in mm
    const imgH_mm = (canvas.height * A4_W_MM) / canvas.width;

    // page height in px (rounded)
    const pageHeightPx = Math.round((A4_H_MM / A4_W_MM) * canvas.width);

    // If fits single page, add whole image as PNG (lossless)
    if (imgH_mm <= A4_H_MM + 0.5) {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, A4_W_MM, imgH_mm);
    } else {
      // multi-page slicing
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      let offsetPx = 0;
      let first = true;

      while (offsetPx < canvas.height) {
        const sliceHpx = Math.min(pageHeightPx, canvas.height - offsetPx);
        pageCanvas.height = sliceHpx;

        const ctx = pageCanvas.getContext("2d");
        if (!ctx) break;

        // fill white background to avoid transparency artifacts
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // draw using rounded offsets to avoid fractional pixel sampling
        ctx.drawImage(
          canvas,
          0,
          Math.round(offsetPx),
          canvas.width,
          Math.round(sliceHpx),
          0,
          0,
          canvas.width,
          Math.round(sliceHpx)
        );

        const sliceData = pageCanvas.toDataURL("image/png");
        const sliceMm = (sliceHpx * A4_W_MM) / canvas.width;

        if (!first) pdf.addPage();
        pdf.addImage(sliceData, "PNG", 0, 0, A4_W_MM, sliceMm);
        first = false;
        offsetPx += sliceHpx;
      }
    }

    const safe = filename.replace(/[^\w.-]+/g, "-") || "cv";
    pdf.save(safe.endsWith(".pdf") ? safe : `${safe}.pdf`);
  } finally {
    clone.remove();
  }
}
