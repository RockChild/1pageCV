import { r as init_html2canvas_esm, t as html2canvas } from "../_libs/html2canvas.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-VzEATjJ1.js
init_html2canvas_esm();
var import_jspdf_node_min = require_jspdf_node_min();
var A4_W_MM = 210;
var A4_H_MM = 297;
async function downloadCvPdf(source, filename) {
	const clone = source.cloneNode(true);
	clone.style.transform = "none";
	clone.style.position = "fixed";
	clone.style.left = "0";
	clone.style.top = "0";
	clone.style.zIndex = "-1";
	clone.style.margin = "0";
	clone.style.boxShadow = "none";
	clone.style.width = "794px";
	clone.style.minHeight = "1123px";
	document.body.appendChild(clone);
	try {
		const canvas = await html2canvas(clone, {
			scale: 2,
			useCORS: true,
			backgroundColor: "#ffffff",
			logging: false,
			width: clone.offsetWidth,
			height: clone.scrollHeight,
			windowWidth: clone.offsetWidth,
			windowHeight: clone.scrollHeight
		});
		const img = canvas.toDataURL("image/jpeg", .95);
		const pdf = new import_jspdf_node_min.jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4"
		});
		const imgH = canvas.height * A4_W_MM / canvas.width;
		let remaining = imgH;
		let offset = 0;
		const pageCanvas = document.createElement("canvas");
		const pageHeightPx = A4_H_MM / A4_W_MM * canvas.width;
		pageCanvas.width = canvas.width;
		if (imgH <= 297.5) pdf.addImage(img, "JPEG", 0, 0, A4_W_MM, imgH);
		else {
			let first = true;
			while (remaining > .5) {
				const sliceH = Math.min(pageHeightPx, canvas.height - offset);
				pageCanvas.height = sliceH;
				const ctx = pageCanvas.getContext("2d");
				if (!ctx) break;
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(0, 0, pageCanvas.width, sliceH);
				ctx.drawImage(canvas, 0, offset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
				const slice = pageCanvas.toDataURL("image/jpeg", .95);
				const sliceMm = sliceH * A4_W_MM / canvas.width;
				if (!first) pdf.addPage();
				pdf.addImage(slice, "JPEG", 0, 0, A4_W_MM, sliceMm);
				first = false;
				offset += sliceH;
				remaining -= sliceMm;
			}
		}
		const safe = filename.replace(/[^\w.-]+/g, "-") || "cv";
		pdf.save(safe.endsWith(".pdf") ? safe : `${safe}.pdf`);
	} finally {
		clone.remove();
	}
}
//#endregion
export { downloadCvPdf };
