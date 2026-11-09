'use client';

/**
 * Utility for client-side PDF loading and rendering onto an HTML5 canvas.
 * This converts PDF blueprint pages into high-resolution PNG data URLs,
 * allowing seamless display, zoom, 9-zone Vastu Purusha Mandala overlays,
 * and live cursor hover compliance scanning in all browsers and iframes.
 */

// Dynamically configure worker source when running in browser
let workerConfigured = false;

async function getPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  if (!workerConfigured && typeof window !== 'undefined') {
    // Use official CDN worker matching exact version, with local/cdnjs fallback
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    workerConfigured = true;
  }
  return pdfjsLib;
}

export interface RenderPdfResult {
  imageUrl: string;
  totalPages: number;
  currentPage: number;
  width: number;
  height: number;
}

/**
 * Converts a base64 Data URL or ArrayBuffer of a PDF document to a PNG image data URL.
 * @param source PDF data URL string ('data:application/pdf;base64,...') or ArrayBuffer
 * @param pageNumber 1-based page index to render (defaults to 1)
 * @param scale Quality scale factor (defaults to 2 for crisp blueprint lines)
 */
export async function renderPdfToImage(
  source: string | ArrayBuffer,
  pageNumber: number = 1,
  scale: number = 2.0
): Promise<RenderPdfResult> {
  const pdfjs = await getPdfJs();

  let loadingTask;
  if (typeof source === 'string') {
    if (source.startsWith('data:application/pdf') || source.startsWith('data:application/octet-stream')) {
      // Decode base64 to Uint8Array
      const base64Data = source.split(',')[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      loadingTask = pdfjs.getDocument({ data: bytes });
    } else {
      // Regular URL
      loadingTask = pdfjs.getDocument(source);
    }
  } else {
    loadingTask = pdfjs.getDocument({ data: source });
  }

  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;
  const targetPage = Math.min(Math.max(1, pageNumber), totalPages);

  const page = await pdfDoc.getPage(targetPage);
  const viewport = page.getViewport({ scale });

  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Failed to obtain 2D canvas context for PDF rendering');
  }

  // Draw clean background (blueprints often have transparent background)
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  const imageUrl = canvas.toDataURL('image/png', 0.95);

  return {
    imageUrl,
    totalPages,
    currentPage: targetPage,
    width: viewport.width,
    height: viewport.height,
  };
}

/**
 * Creates a synthetic SVG floor plan blueprint when PDF parsing fails or as an instant architectural fallback
 */
export function generateFallbackBlueprintSvg(title: string = 'Architectural Floor Plan Blueprint'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 680" width="900" height="680" style="background:#0c1322; font-family: ui-sans-serif, system-ui, sans-serif;">
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" stroke-width="1"/>
      </pattern>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
    </defs>
    <rect width="900" height="680" fill="#0b1120"/>
    <rect width="900" height="680" fill="url(#grid)"/>

    <!-- Outer Perimeter Walls -->
    <rect x="70" y="70" width="760" height="540" fill="#0f172a" stroke="url(#wallGrad)" stroke-width="8" rx="6"/>

    <!-- Rooms Layout -->
    <!-- NE Zone / Pooja & Living -->
    <rect x="470" y="70" width="360" height="260" fill="#13233b" stroke="#38bdf8" stroke-width="4"/>
    <text x="650" y="160" fill="#f8fafc" font-size="18" font-weight="bold" text-anchor="middle">LIVING &amp; BALCONY</text>
    <text x="650" y="190" fill="#94a3b8" font-size="13" text-anchor="middle">NE / East Solar Inflow (Auspicious)</text>
    <rect x="700" y="80" width="110" height="90" fill="#082f49" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="755" y="130" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">POOJA NOOK</text>

    <!-- NW Zone / Bedroom 2 -->
    <rect x="70" y="70" width="230" height="260" fill="#1e1b4b" stroke="#38bdf8" stroke-width="4"/>
    <text x="185" y="180" fill="#f8fafc" font-size="16" font-weight="bold" text-anchor="middle">GUEST BEDROOM</text>
    <text x="185" y="210" fill="#cbd5e1" font-size="12" text-anchor="middle">NW (Vayu Zone)</text>

    <!-- SW Zone / Master Bedroom -->
    <rect x="70" y="330" width="250" height="280" fill="#2d1c15" stroke="#38bdf8" stroke-width="4"/>
    <text x="195" y="460" fill="#f8fafc" font-size="17" font-weight="bold" text-anchor="middle">MASTER BEDROOM</text>
    <text x="195" y="490" fill="#fdba74" font-size="12" text-anchor="middle">SW (Nairutya Earth Core)</text>

    <!-- SE Zone / Kitchen -->
    <rect x="560" y="330" width="270" height="280" fill="#3b1b17" stroke="#38bdf8" stroke-width="4"/>
    <text x="695" y="460" fill="#f8fafc" font-size="17" font-weight="bold" text-anchor="middle">KITCHEN &amp; UTILITY</text>
    <text x="695" y="490" fill="#fb923c" font-size="12" text-anchor="middle">SE (Agni Corner)</text>
    <circle cx="760" cy="380" r="16" fill="#ea580c"/>
    <text x="760" y="385" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">HOB</text>

    <!-- Central Brahma Sthan -->
    <rect x="300" y="200" width="260" height="260" fill="#1e293b" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 6"/>
    <text x="430" y="325" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="middle">BRAHMA STHAN</text>
    <text x="430" y="350" fill="#cbd5e1" font-size="12" text-anchor="middle">Central Living Core</text>

    <!-- Main Entrance -->
    <rect x="370" y="62" width="80" height="16" fill="#22c55e" rx="4"/>
    <text x="410" y="52" fill="#4ade80" font-size="13" font-weight="bold" text-anchor="middle">MAIN ENTRANCE (NORTH)</text>

    <!-- Title Badge -->
    <rect x="90" y="90" width="280" height="40" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1" rx="6"/>
    <text x="230" y="115" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">${title}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
