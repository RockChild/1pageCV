import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function downloadCvPdf(source: HTMLElement, filename: string) {
  // clone and prepare offscreen
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.position = "absolute";
  clone.style.left = "-9999px"; // offscreen to avoid fixed-top rendering differences
  clone.style.top = "0";
  clone.style.zIndex = "9999";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.width = "794px";
  clone.style.minHeight = "1123px";
  document.body.appendChild(clone);

  try {
    // ensure fonts are loaded so html2canvas uses correct metrics
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // use devicePixelRatio for crispness and consistent metrics
    const DPR = window.devicePixelRatio || 2;

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

    // convert to image and create PDF
    const img = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // compute image height in mm
    const A4_W_MM = 210;
    const A4_H_MM = 297;
    const imgHmm = (canvas.height * A4_W_MM) / canvas.width;

    // page slicing: use integer px heights to avoid subpixel cuts
    const pageHeightPx = Math.round((A4_H_MM / A4_W_MM) * canvas.width);
    let remainingMm = imgHmm;
    let offsetPx = 0;
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;

    if (imgHmm <= A4_H_MM + 0.5) {
      pdf.addImage(img, "JPEG", 0, 0, A4_W_MM, imgHmm);
    } else {
      let first = true;
      while (remainingMm > 0.5) {
        const sliceHpx = Math.min(pageHeightPx, canvas.height - offsetPx);
        pageCanvas.height = sliceHpx;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) break;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, sliceHpx);

        // use rounded offsets to avoid fractional pixel sampling
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

        const slice = pageCanvas.toDataURL("image/jpeg", 0.95);
        const sliceMm = (sliceHpx * A4_W_MM) / canvas.width;

        if (!first) pdf.addPage();
        pdf.addImage(slice, "JPEG", 0, 0, A4_W_MM, sliceMm);
        first = false;
        offsetPx += sliceHpx;
        remainingMm -= sliceMm;
      }
    }

    const safe = filename.replace(/[^\w.-]+/g, "-") || "cv";
    pdf.save(safe.endsWith(".pdf") ? safe : `${safe}.pdf`);
  } finally {
    clone.remove();
  }
}

