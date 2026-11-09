'use client';

import React, { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { Upload, Compass, FileCheck, AlertCircle, Sparkles, RefreshCw, Layers, CheckCircle2, ChevronLeft, ChevronRight, FileText, Download, Eye, Crop, RotateCcw, RotateCw, Check, X, MapPin } from 'lucide-react';
import { renderPdfToImage, generateFallbackBlueprintSvg } from '@/lib/pdf-renderer';
import { VASTU_ZONES_CONFIG } from '@/lib/vastu-data';
import { formatPlaceName } from '@/lib/vastu-analyzer-engine';
import { useTheme } from '@/lib/theme-context';

interface FloorPlanUploaderProps {
  onAnalyze: (data: {
    imageBase64: string;
    mimeType: string;
    orientation: string;
    userNotes: string;
    fileName: string;
    placeName: string;
  }) => void;
  isLoading: boolean;
  activeImagePreview: string | null;
  activeFileName: string | null;
  activePlaceName?: string;
  onClear: () => void;
}

const ORIENTATIONS = [
  { id: 'North', label: 'North Facing', degrees: 0, tag: 'Most Auspicious' },
  { id: 'East', label: 'East Facing', degrees: 90, tag: 'Solar Prana' },
  { id: 'North-East', label: 'North-East Facing', degrees: 45, tag: 'Divine Ishanya' },
  { id: 'South', label: 'South Facing', degrees: 180, tag: 'Yama Energy' },
  { id: 'West', label: 'West Facing', degrees: 270, tag: 'Varuna Water' },
  { id: 'South-East', label: 'South-East Facing', degrees: 135, tag: 'Agni Fire' },
  { id: 'North-West', label: 'North-West Facing', degrees: 315, tag: 'Vayu Air' },
  { id: 'South-West', label: 'South-West Facing', degrees: 225, tag: 'Nairutya Earth' },
];

export function FloorPlanUploader({
  onAnalyze,
  isLoading,
  activeImagePreview,
  activeFileName,
  activePlaceName,
  onClear,
}: FloorPlanUploaderProps) {
  const { themeConfig } = useTheme();
  const [selectedOrientation, setSelectedOrientation] = useState<string>('North Facing');
  const [customAngle, setCustomAngle] = useState<number>(0);
  const [userCustomPlaceName, setUserCustomPlaceName] = useState<string | null>(null);
  const [prevActivePlace, setPrevActivePlace] = useState<string | null>(activePlaceName || null);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync place name if external activePlaceName changes (e.g. sample selected)
  if (activePlaceName !== prevActivePlace) {
    setPrevActivePlace(activePlaceName || null);
    setUserCustomPlaceName(null);
  }

  const effectivePlaceName = userCustomPlaceName !== null
    ? userCustomPlaceName
    : (activePlaceName || (activeFileName ? formatPlaceName(activeFileName) : ''));
  const [showMandalaPreview, setShowMandalaPreview] = useState<boolean>(true);
  const [isRenderingPdf, setIsRenderingPdf] = useState<boolean>(false);
  const [pdfMeta, setPdfMeta] = useState<{
    totalPages: number;
    currentPage: number;
    rawPdfSource: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Floor Plan Dynamic Orientation Rotation State
  const [planRotation, setPlanRotation] = useState<number>(0);
  const [autoRotateByOrientation, setAutoRotateByOrientation] = useState<boolean>(true);

  // Floor Plan Cropping State
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [cropMargins, setCropMargins] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>({ top: 0, bottom: 0, left: 0, right: 0 });
  const [originalUncroppedBase64, setOriginalUncroppedBase64] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const [uploadedFile, setUploadedFile] = useState<{
    base64: string;
    mimeType: string;
    name: string;
    isPdf?: boolean;
    rawPdf?: string;
  } | null>(null);

  const currentBase64 = uploadedFile ? uploadedFile.base64 : activeImagePreview;
  const currentFileName = uploadedFile ? uploadedFile.name : activeFileName;
  const currentMimeType = uploadedFile ? uploadedFile.mimeType : 'image/jpeg';

  const processFile = async (file: File) => {
    setErrorMessage(null);
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg|pdf)$/i)) {
      setErrorMessage('Please upload a valid architectural floor plan (PNG, JPG, WEBP, SVG, or PDF).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB. Please upload a standard resolution blueprint export.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;

      if (isPdf) {
        setIsRenderingPdf(true);
        try {
          // Render page 1 of the PDF onto high-res canvas and export as PNG
          const pdfResult = await renderPdfToImage(result, 1, 2.0);
          setPdfMeta({
            totalPages: pdfResult.totalPages,
            currentPage: 1,
            rawPdfSource: result,
          });
          setUploadedFile({
            base64: pdfResult.imageUrl,
            mimeType: 'image/png',
            name: file.name,
            isPdf: true,
            rawPdf: result,
          });
          setUserCustomPlaceName(formatPlaceName(file.name));
          setOriginalUncroppedBase64(pdfResult.imageUrl);
          setIsCropped(false);
          setCropMargins({ top: 0, bottom: 0, left: 0, right: 0 });
        } catch (pdfErr) {
          console.warn('PDF.js rendering fallback triggered:', pdfErr);
          const fallbackSvg = generateFallbackBlueprintSvg(file.name);
          setUploadedFile({
            base64: fallbackSvg,
            mimeType: 'image/svg+xml',
            name: file.name,
            isPdf: true,
            rawPdf: result,
          });
          setUserCustomPlaceName(formatPlaceName(file.name));
          setOriginalUncroppedBase64(fallbackSvg);
          setIsCropped(false);
          setCropMargins({ top: 0, bottom: 0, left: 0, right: 0 });
        } finally {
          setIsRenderingPdf(false);
        }
      } else {
        setPdfMeta(null);
        setUploadedFile({
          base64: result,
          mimeType: file.type || 'image/jpeg',
          name: file.name,
          isPdf: false,
        });
        setUserCustomPlaceName(formatPlaceName(file.name));
        setOriginalUncroppedBase64(result);
        setIsCropped(false);
        setCropMargins({ top: 0, bottom: 0, left: 0, right: 0 });
      }
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read the file. Please try another image or PDF blueprint.');
      setIsRenderingPdf(false);
    };

    reader.readAsDataURL(file);
  };

  const handleOpenCrop = () => {
    if (!originalUncroppedBase64 && currentBase64) {
      setOriginalUncroppedBase64(currentBase64);
    }
    setIsCropModalOpen(true);
  };

  const handleApplyCrop = () => {
    const src = originalUncroppedBase64 || currentBase64;
    if (!src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;

      const leftPx = Math.round((cropMargins.left / 100) * natW);
      const topPx = Math.round((cropMargins.top / 100) * natH);
      const rightPx = Math.round((cropMargins.right / 100) * natW);
      const bottomPx = Math.round((cropMargins.bottom / 100) * natH);

      const cropW = Math.max(50, natW - leftPx - rightPx);
      const cropH = Math.max(50, natH - topPx - bottomPx);

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        leftPx,
        topPx,
        cropW,
        cropH,
        0,
        0,
        cropW,
        cropH
      );

      const croppedUrl = canvas.toDataURL('image/png');
      setUploadedFile((prev) => ({
        base64: croppedUrl,
        mimeType: 'image/png',
        name: prev?.name ? `Cropped_${prev.name}` : 'Cropped_FloorPlan.png',
        isPdf: false,
        rawPdf: prev?.rawPdf,
      }));
      setIsCropped(true);
      setIsCropModalOpen(false);
    };
    img.src = src;
  };

  const handleRevertCrop = () => {
    if (!originalUncroppedBase64) return;
    setUploadedFile((prev) => ({
      base64: originalUncroppedBase64,
      mimeType: prev?.mimeType || 'image/png',
      name: prev?.name ? prev.name.replace(/^Cropped_/, '') : 'FloorPlan.png',
      isPdf: prev?.isPdf,
      rawPdf: prev?.rawPdf,
    }));
    setIsCropped(false);
    setCropMargins({ top: 0, bottom: 0, left: 0, right: 0 });
  };

  const handlePageChange = async (newPage: number) => {
    if (!pdfMeta || newPage < 1 || newPage > pdfMeta.totalPages || isRenderingPdf) return;
    setIsRenderingPdf(true);
    try {
      const pdfResult = await renderPdfToImage(pdfMeta.rawPdfSource, newPage, 2.0);
      setPdfMeta((prev) => (prev ? { ...prev, currentPage: newPage } : null));
      setUploadedFile((prev) =>
        prev
          ? {
              ...prev,
              base64: pdfResult.imageUrl,
            }
          : null
      );
    } catch (err) {
      console.error('Error switching PDF page:', err);
    } finally {
      setIsRenderingPdf(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const getRotatedBase64 = (base64: string, degrees: number): Promise<string> => {
    if (degrees % 360 === 0) return Promise.resolve(base64);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const rad = (degrees * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newW = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
        const newH = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(50, newW);
        canvas.height = Math.max(50, newH);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(base64);

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(base64);
      img.src = base64;
    });
  };

  const handleSubmitAnalysis = async () => {
    if (!currentBase64) {
      setErrorMessage('Please upload a floor plan or choose one of the sample plans first.');
      return;
    }

    let finalImage = currentBase64;
    if (planRotation % 360 !== 0) {
      try {
        finalImage = await getRotatedBase64(currentBase64, planRotation);
      } catch (err) {
        console.warn('Could not bake rotation into plan image:', err);
      }
    }

    onAnalyze({
      imageBase64: finalImage,
      mimeType: currentMimeType,
      orientation: `${selectedOrientation} (${customAngle}° True North · Rotated ${planRotation}°)`,
      userNotes,
      fileName: currentFileName || 'floor_plan',
      placeName: effectivePlaceName.trim() || formatPlaceName(currentFileName),
    });
  };

  return (
    <div id="upload-section" className="scroll-mt-20">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
              <span>Upload Floor Plan & Set Orientation</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supports any format: PDF blueprints, CAD 2D exports, JPG, PNG, or SVG drawings.
            </p>
          </div>

          {currentBase64 && (
            <button
              onClick={() => {
                setUploadedFile(null);
                onClear();
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors self-start md:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Floor Plan</span>
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Upload Dropzone */}
          <div className="lg:col-span-7">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
              className="hidden"
            />

            {!currentBase64 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 text-center ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/5'
                    : 'border-slate-700/80 bg-slate-950/40 hover:border-amber-500/50 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-sm font-semibold text-white">
                  Drop your floor plan here, or <span className="text-amber-400 underline underline-offset-2">browse files</span>
                </div>
                <div className="text-xs text-slate-400 mt-1.5">
                  PDF, CAD PNG/JPG, WebP, SVG vector up to 20MB
                </div>
                <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-500 font-mono">
                  <span>2D Architectural Layout</span>
                  <span>·</span>
                  <span>Hand Sketches</span>
                  <span>·</span>
                  <span>CAD Blueprints</span>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden group">
                <div className="relative aspect-[4/3] w-full max-h-[380px] flex items-center justify-center bg-[#070a11] overflow-hidden">
                  {/* PDF Rendering Loading State */}
                  {isRenderingPdf && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                      <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                      <div className="text-xs font-semibold text-white">Rendering Architectural PDF Blueprint...</div>
                      <div className="text-[10px] text-slate-400 font-mono">Converting vector layout to high-res canvas</div>
                    </div>
                  )}

                  {/* Rendered Floor Plan Blueprint Image - Dynamically Rotated as per Orientation */}
                  <img
                    src={currentBase64}
                    alt="Uploaded Floor Plan"
                    referrerPolicy="no-referrer"
                    style={{
                      transform: `rotate(${planRotation}deg)`,
                      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="w-full h-full object-contain p-2"
                  />

                  {/* Clean 9-Zone Vastu Purusha Mandala Grid Overlay on Uploaded Plan */}
                  {showMandalaPreview && (
                    <div className="absolute inset-0 m-2 rounded-lg pointer-events-none grid grid-cols-3 grid-rows-3 border-[2px] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-black/80">
                      {['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'].map((key) => {
                        const zone = VASTU_ZONES_CONFIG.find((z) => z.key === key);
                        if (!zone) return null;
                        const isCenter = zone.key === 'C';
                        return (
                          <div
                            key={zone.key}
                            className={`relative p-1 sm:p-1.5 flex flex-col justify-between border-[1px] border-amber-400/70 shadow-[0_0_0_1px_rgba(0,0,0,0.8)] ${
                              isCenter
                                ? 'bg-amber-400/5 shadow-[inset_0_0_12px_rgba(245,158,11,0.2)]'
                                : 'bg-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-300 bg-slate-950/90 px-1 py-0.2 rounded border border-amber-400/70 shadow-xs">
                                {zone.key}
                              </span>
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: zone.color }}
                              />
                            </div>
                            {isCenter ? (
                              <div className="text-center my-auto py-0.5 px-1 rounded bg-black/60 border border-amber-400/60 shadow-xs">
                                <div className="flex items-center justify-center gap-1 text-[8.5px] font-bold text-amber-300">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                  <span>Brahma Sthan</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-[8.5px] font-bold text-white bg-black/60 rounded px-1 py-0.2 mx-auto">
                                {zone.name.split(' ')[0]}
                              </div>
                            )}
                            <div className="text-[8px] text-amber-200/90 truncate bg-black/60 px-1 rounded font-medium">
                              {zone.element.split(' ')[0]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Top Badges & Toggles: PDF Badge, Rotation Controls and Mandala Highlight Toggle */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-auto">
                    {(uploadedFile?.isPdf || pdfMeta) ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/90 border border-amber-500/50 backdrop-blur-md text-[10px] text-amber-300 font-semibold shadow-md pointer-events-none">
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>PDF Blueprint {pdfMeta ? `(P.${pdfMeta.currentPage}/${pdfMeta.totalPages})` : 'Rendered'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/80 backdrop-blur-md text-[10px] text-slate-300 font-medium">
                        <Compass className="w-3 h-3 text-amber-400" />
                        <span>2D Floor Plan</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      {/* Plan Rotation Quick Controls */}
                      <div className="flex items-center gap-0.5 bg-slate-950/90 border border-slate-700/80 rounded-md p-0.5 backdrop-blur-md shadow-xs">
                        <button
                          type="button"
                          onClick={() => setPlanRotation((prev) => (prev - 90 + 360) % 360)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                          title="Rotate 90° Counter-Clockwise"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-[10px] text-amber-400 font-bold px-1" title="Blueprint Rotation Angle">
                          {planRotation}°
                        </span>
                        <button
                          type="button"
                          onClick={() => setPlanRotation((prev) => (prev + 90) % 360)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                          title="Rotate 90° Clockwise"
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>
                        {planRotation % 360 !== 0 && (
                          <button
                            type="button"
                            onClick={() => setPlanRotation(0)}
                            className="text-[9px] px-1 text-slate-400 hover:text-white"
                            title="Reset rotation to 0°"
                          >
                            0°
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowMandalaPreview(!showMandalaPreview)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all shadow-md cursor-pointer border backdrop-blur-md ${
                          showMandalaPreview
                            ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-1 ring-amber-400/40 shadow-amber-500/10'
                            : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                        title="Toggle 9-Zone Mandala Highlight on Plan"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>9-Zone Mandala: {showMandalaPreview ? 'HIGHLIGHTED' : 'OFF'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mandala & Rotation Status Banner */}
                <div className="px-3 py-1.5 bg-amber-500/10 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-1 text-[11px] text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>9-Zone Mandala Aligned ({selectedOrientation})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-amber-300 font-semibold">📐 Plan Rotated: {planRotation}°</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">Brahmasthan Highlighted</span>
                  </div>
                </div>

                {/* Multi-page controls if PDF has multiple pages */}
                {pdfMeta && pdfMeta.totalPages > 1 && (
                  <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Blueprint Pages:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pdfMeta.currentPage <= 1 || isRenderingPdf}
                        onClick={() => handlePageChange(pdfMeta.currentPage - 1)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>
                      <span className="font-mono text-[11px] text-amber-400 font-bold px-1.5">
                        Page {pdfMeta.currentPage} of {pdfMeta.totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={pdfMeta.currentPage >= pdfMeta.totalPages || isRenderingPdf}
                        onClick={() => handlePageChange(pdfMeta.currentPage + 1)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs flex items-center gap-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-200 truncate">{currentFileName || 'Floor Plan'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {/* Crop Plan Button */}
                    <button
                      type="button"
                      onClick={handleOpenCrop}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                      title="Crop borders, margins, or title blocks to fit your home exterior walls"
                    >
                      <Crop className="w-3.5 h-3.5 text-amber-400" />
                      <span>Crop Plan</span>
                    </button>

                    {isCropped && (
                      <button
                        type="button"
                        onClick={handleRevertCrop}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Revert to original uncropped floor plan"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    {uploadedFile?.rawPdf && (
                      <a
                        href={uploadedFile.rawPdf}
                        download={currentFileName || 'floorplan.pdf'}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        <span>Original PDF</span>
                      </a>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap pl-1 text-xs cursor-pointer"
                    >
                      Change Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orientation & Notes Configuration */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Main Entrance / Property Facing</span>
                </span>
                <span className="text-[11px] text-amber-400 font-mono">{customAngle}° North</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {ORIENTATIONS.map((ori) => (
                  <button
                    key={ori.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrientation(`${ori.label}`);
                      setCustomAngle(ori.degrees);
                      if (autoRotateByOrientation) {
                        setPlanRotation(ori.degrees);
                      }
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                      selectedOrientation.startsWith(ori.id)
                        ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm ring-1 ring-amber-400/30'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{ori.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{ori.tag}</div>
                  </button>
                ))}
              </div>

              {/* Angle fine-tuner & Auto-Rotate Toggle */}
              <div className="mt-3.5 p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>True North Compass Angle</span>
                    <span className="font-mono text-amber-400 font-bold">{customAngle}°</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">Auto-Rotate Plan:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !autoRotateByOrientation;
                        setAutoRotateByOrientation(next);
                        if (next) setPlanRotation(customAngle);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold border cursor-pointer transition-colors ${
                        autoRotateByOrientation
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title="Toggle automatic rotation of the floor plan blueprint based on selected orientation"
                    >
                      {autoRotateByOrientation ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={customAngle}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCustomAngle(val);
                    if (autoRotateByOrientation) {
                      setPlanRotation(val);
                    }
                  }}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Place / Property Name as per Uploaded Plan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Place / Property Name</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono">
                  As per uploaded plan
                </span>
              </div>
              <input
                type="text"
                value={effectivePlaceName}
                onChange={(e) => setUserCustomPlaceName(e.target.value)}
                placeholder="E.g. Shanti Niketan Villa, Flat 402 Palm Heights, Plot No. 12..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>Officially inscribed on Vastu Remediation Certificate</span>
                {currentFileName && (
                  <span className="text-slate-400 font-mono truncate max-w-[200px]" title={currentFileName}>
                    Plan: {currentFileName}
                  </span>
                )}
              </div>
            </div>

            {/* Optional User Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specific Concerns or Renovation Plans (Optional)
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="E.g. Is the kitchen stove in the right quadrant? We plan to make bedroom 2 a home office..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
              />
            </div>

            {/* Run Analysis Action Button */}
            <button
              onClick={handleSubmitAnalysis}
              disabled={isLoading || !currentBase64}
              className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-lg cursor-pointer ${
                isLoading || !currentBase64
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-amber-500/20 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Computing Vastu Energies & Purusha Grid...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Analyze Vastu Shastra & Energy Flow</span>
                </>
              )}
            </button>

            {isLoading && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs text-slate-300 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px]">
                  <Compass className="w-3.5 h-3.5 animate-spin" />
                  <span>Vedic Spatial Diagnostic In Progress...</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>· Decoding architectural walls, doors & wet zones</div>
                  <div>· Mapping 9 directional sectors to {selectedOrientation}</div>
                  <div>· Evaluating Prana Jaivik diagonal flow from Ishanya to Nairutya</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Crop Floor Plan Modal Dialog */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Crop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">Crop Floor Plan Boundary</h3>
                  <p className="text-xs text-slate-400">
                    Trim outer margins, title blocks, and whitespace to align the 9-Zone Mandala
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">Quick Presets:</span>
              {[
                { label: 'Full / Reset (0%)', t: 0, b: 0, l: 0, r: 0 },
                { label: 'Trim Margins (8%)', t: 8, b: 8, l: 8, r: 8 },
                { label: 'Trim Margins (14%)', t: 14, b: 14, l: 14, r: 14 },
                { label: 'Header/Footer Trim', t: 12, b: 12, l: 4, r: 4 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCropMargins({ top: p.t, bottom: p.b, left: p.l, right: p.r })}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Interactive Crop Preview Canvas */}
            <div className="relative aspect-[4/3] w-full max-h-[300px] sm:max-h-[360px] bg-[#070a11] rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none">
              <img
                src={originalUncroppedBase64 || currentBase64 || ''}
                alt="Crop Blueprint Target"
                className="w-full h-full object-contain p-2"
              />

              {/* Shaded Margins Outside Crop Area */}
              <div
                className="absolute top-0 left-0 right-0 bg-black/75 pointer-events-none transition-all duration-150"
                style={{ height: `${cropMargins.top}%` }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 bg-black/75 pointer-events-none transition-all duration-150"
                style={{ height: `${cropMargins.bottom}%` }}
              />
              <div
                className="absolute left-0 bg-black/75 pointer-events-none transition-all duration-150"
                style={{
                  top: `${cropMargins.top}%`,
                  bottom: `${cropMargins.bottom}%`,
                  width: `${cropMargins.left}%`,
                }}
              />
              <div
                className="absolute right-0 bg-black/75 pointer-events-none transition-all duration-150"
                style={{
                  top: `${cropMargins.top}%`,
                  bottom: `${cropMargins.bottom}%`,
                  width: `${cropMargins.right}%`,
                }}
              />

              {/* Active Crop Box Boundary */}
              <div
                className="absolute pointer-events-none border-2 border-dashed border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] grid grid-cols-3 grid-rows-3 transition-all duration-150"
                style={{
                  top: `${cropMargins.top}%`,
                  bottom: `${cropMargins.bottom}%`,
                  left: `${cropMargins.left}%`,
                  right: `${cropMargins.right}%`,
                }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-amber-400/25" />
                ))}
              </div>
            </div>

            {/* 4 Interactive Margin Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Top Trim</span>
                  <span className="font-mono text-amber-400 font-bold">{cropMargins.top}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={cropMargins.top}
                  onChange={(e) => setCropMargins((prev) => ({ ...prev, top: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Bottom Trim</span>
                  <span className="font-mono text-amber-400 font-bold">{cropMargins.bottom}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={cropMargins.bottom}
                  onChange={(e) => setCropMargins((prev) => ({ ...prev, bottom: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Left Trim</span>
                  <span className="font-mono text-amber-400 font-bold">{cropMargins.left}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={cropMargins.left}
                  onChange={(e) => setCropMargins((prev) => ({ ...prev, left: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Right Trim</span>
                  <span className="font-mono text-amber-400 font-bold">{cropMargins.right}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={cropMargins.right}
                  onChange={(e) => setCropMargins((prev) => ({ ...prev, right: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCropMargins({ top: 0, bottom: 0, left: 0, right: 0 })}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to 0%</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Crop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
