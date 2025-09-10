
const toUrl = (svgString: string) => URL.createObjectURL(new Blob([svgString], { type: "image/svg+xml;charset=utf-8" }));

/**
 * Converts an SVG DOM node to a PNG file and triggers a download.
 * @param svg The SVGElement to convert.
 * @param filename The desired filename for the downloaded PNG.
 * @param scale The resolution scaling factor.
 */
export const svgNodeToPng = async (svg: SVGElement, filename: string, scale = 2): Promise<void> => {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * scale));
  const height = Math.max(1, Math.floor(rect.height * scale));

  // Create a clean clone of the SVG
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", `${width}`);
  clone.setAttribute("height", `${height}`);
  
  const svgString = new XMLSerializer().serializeToString(clone);
  const url = toUrl(svgString);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Failed to get canvas context"));
      }
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      
      // Trigger download
      canvas.toBlob((blob) => {
        if (!blob) {
            return reject(new Error("Canvas toBlob failed"));
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 100); // Clean up blob URL
        resolve();
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image failed to load from SVG data URL"));
    }

    img.src = url;
  });
};

/**
 * Finds all SVG elements within a root element and exports them as PNGs.
 * @param root The container HTMLElement to search for SVGs.
 * @param baseName A base name for the exported files (e.g., "report-123").
 */
export const exportVisibleCharts = async (root: HTMLElement, baseName: string) => {
  const svgs = Array.from(root.querySelectorAll<SVGElement>("svg[viewBox]"));
  if (svgs.length === 0) {
    console.warn("No visible charts found to export.");
    return;
  }
  
  let i = 1;
  for (const svg of svgs) {
    try {
      await svgNodeToPng(svg, `${baseName}-chart-${i++}.png`, 2);
    } catch (error) {
        console.error("Failed to export an SVG chart:", error);
    }
  }
};
