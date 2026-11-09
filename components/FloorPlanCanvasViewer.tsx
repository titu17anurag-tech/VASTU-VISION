'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { VastuAnalysisReport } from '@/lib/vastu-types';
import { VASTU_ZONES_CONFIG } from '@/lib/vastu-data';
import { renderPdfToImage, generateFallbackBlueprintSvg } from '@/lib/pdf-renderer';
import {
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Scan,
  ShieldCheck,
  Shield,
  Sparkles,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Hammer,
  Wrench,
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface FloorPlanCanvasViewerProps {
  imageSrc: string;
  report: VastuAnalysisReport;
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

// 3x3 Grid Map (Row-Col to Zone Key)
const ZONES_MATRIX: Record<string, string> = {
  '0-0': 'NW',
  '0-1': 'N',
  '0-2': 'NE',
  '1-0': 'W',
  '1-1': 'C',
  '1-2': 'E',
  '2-0': 'SW',
  '2-1': 'S',
  '2-2': 'SE',
};

export function FloorPlanCanvasViewer({
  imageSrc,
  report,
  activeRoomId,
  onSelectRoom,
}: FloorPlanCanvasViewerProps) {
  const { themeConfig } = useTheme();
  const [zoom, setZoom] = useState<number>(1);
  const [canvasRotation, setCanvasRotation] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showPranaFlow, setShowPranaFlow] = useState<boolean>(true);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [showVastuPurushaIcon, setShowVastuPurushaIcon] = useState<boolean>(true);
  const [isCursorScannerActive, setIsCursorScannerActive] = useState<boolean>(true);
  const [isHighlightMode, setIsHighlightMode] = useState<boolean>(true);
  const [gridOpacity, setGridOpacity] = useState<number>(90);
  const [selectedZoneKey, setSelectedZoneKey] = useState<string | null>(null);

  // PDF Rendering State
  const [pdfRenderedUrl, setPdfRenderedUrl] = useState<string | null>(null);
  const [isRenderingPdf, setIsRenderingPdf] = useState<boolean>(false);
  const [pdfPageInfo, setPdfPageInfo] = useState<{
    currentPage: number;
    totalPages: number;
    rawSource: string;
  } | null>(null);

  const isPdfSource = Boolean(
    imageSrc?.startsWith('data:application/pdf') ||
    imageSrc?.startsWith('data:application/octet-stream') ||
    imageSrc?.endsWith('.pdf')
  );

  // Handle imageSrc changes and PDF documents asynchronously
  useEffect(() => {
    if (!isPdfSource) {
      return;
    }

    let isMounted = true;

    Promise.resolve().then(async () => {
      if (!isMounted) return;
      setIsRenderingPdf(true);
      try {
        const res = await renderPdfToImage(imageSrc, 1, 2.0);
        if (!isMounted) return;
        setPdfRenderedUrl(res.imageUrl);
        setPdfPageInfo({
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          rawSource: imageSrc,
        });
      } catch (err) {
        console.warn('Canvas viewer PDF render fallback:', err);
        if (!isMounted) return;
        setPdfRenderedUrl(generateFallbackBlueprintSvg('Architectural PDF Blueprint'));
      } finally {
        if (isMounted) {
          setIsRenderingPdf(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imageSrc, isPdfSource]);

  const handleSwitchPdfPage = async (newPage: number) => {
    if (!pdfPageInfo || newPage < 1 || newPage > pdfPageInfo.totalPages || isRenderingPdf) return;
    setIsRenderingPdf(true);
    try {
      const res = await renderPdfToImage(pdfPageInfo.rawSource, newPage, 2.0);
      setPdfRenderedUrl(res.imageUrl);
      setPdfPageInfo((prev) => (prev ? { ...prev, currentPage: newPage } : null));
    } catch (err) {
      console.error('Failed to switch PDF page:', err);
    } finally {
      setIsRenderingPdf(false);
    }
  };

  const finalDisplayImage = isPdfSource ? pdfRenderedUrl || '' : imageSrc;

  // Live Cursor Tracking State
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveringPlan, setIsHoveringPlan] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{
    x: number;
    y: number;
    isNearTop: boolean;
    isNearLeft: boolean;
    isNearRight: boolean;
  } | null>(null);
  const [hoveredZoneKey, setHoveredZoneKey] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoom(1);

  // Handle Mouse Movement to Detect Zone and Vastu Compliance
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isCursorScannerActive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) {
      setIsHoveringPlan(false);
      setHoveredZoneKey(null);
      return;
    }

    setIsHoveringPlan(true);
    setCursorPos({
      x: mouseX,
      y: mouseY,
      isNearTop: mouseY < 165,
      isNearLeft: mouseX < 140,
      isNearRight: mouseX > rect.width - 140,
    });

    // Calculate percentage across 3x3 grid
    const pctX = (mouseX / rect.width) * 100;
    const pctY = (mouseY / rect.height) * 100;

    const col = pctX < 33.33 ? 0 : pctX < 66.66 ? 1 : 2;
    const row = pctY < 33.33 ? 0 : pctY < 66.66 ? 1 : 2;

    const key = ZONES_MATRIX[`${row}-${col}`];
    setHoveredZoneKey(key || null);
  };

  const handleMouseLeave = () => {
    setIsHoveringPlan(false);
    setHoveredZoneKey(null);
  };

  // Evaluate Zone Compliance
  const evaluateZoneCompliance = (zoneKey: string) => {
    const zoneConfig = VASTU_ZONES_CONFIG.find((z) => z.key === zoneKey);
    if (!zoneConfig) return null;

    const doshasInZone = report.detectedDoshas.filter(
      (d) =>
        d.zone.includes(zoneKey) ||
        d.zone.toLowerCase().includes(zoneConfig.name.toLowerCase().split(' ')[0])
    );

    const roomsInZone = report.roomAssessments.filter(
      (r) =>
        r.detectedZone.includes(zoneKey) ||
        r.detectedZone.toLowerCase().includes(zoneConfig.name.toLowerCase().split(' ')[0])
    );

    const hasDefectiveRoom = roomsInZone.some((r) => r.status === 'defective');
    const isDosha = doshasInZone.length > 0 || hasDefectiveRoom;
    const isCompliant = !isDosha;

    let verdictTitle = isDosha ? 'NOT COMPLIANT' : 'VASTU COMPLIANT';
    let detail = '';

    if (isDosha) {
      detail =
        doshasInZone[0]?.title ||
        roomsInZone.find((r) => r.status === 'defective')?.findings ||
        `Vastu conflict detected in ${zoneConfig.name.split(' ')[0]} sector`;
    } else if (roomsInZone.some((r) => r.status === 'compliant')) {
      const compRoom = roomsInZone.find((r) => r.status === 'compliant');
      detail = `${compRoom?.roomName} is auspiciously placed in ${zoneConfig.name.split(' ')[0]}`;
    } else {
      detail =
        zoneKey === 'C'
          ? 'Brahmasthan: Unburdened sacred core allows positive prana energy'
          : `Harmonious ${zoneConfig.element.split(' ')[0]} element equilibrium`;
    }

    return {
      zoneConfig,
      isCompliant,
      isDosha,
      verdictTitle,
      detail,
      doshaItem: doshasInZone[0] || null,
      roomItem: roomsInZone[0] || null,
      roomsInZone,
    };
  };

  const currentHoverEvaluation = hoveredZoneKey ? evaluateZoneCompliance(hoveredZoneKey) : null;
  const selectedZoneDetails = VASTU_ZONES_CONFIG.find((z) => z.key === selectedZoneKey);

  // Group zones in 3x3 row order for rendering
  const orderedGridKeys = ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'];

  return (
    <div className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 rounded-2xl overflow-hidden shadow-xl transition-colors duration-200">
      {/* Workspace Header / Controls Toolbar */}
      <div className="px-5 py-3.5 dark:bg-slate-950 bg-slate-50 border-b dark:border-slate-800 border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold dark:text-white text-slate-900 tracking-wide">
              Vastu Purusha Spatial Grid Overlay
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded border"
              style={{
                backgroundColor: themeConfig.primaryBg,
                borderColor: themeConfig.primaryBorder,
                color: themeConfig.primary,
              }}
            >
              {report.orientation}
            </span>
          </div>
        </div>

        {/* Layer Toggles, Cursor Scanner & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Cursor Scanner Toggle */}
          <button
            onClick={() => setIsCursorScannerActive(!isCursorScannerActive)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              isCursorScannerActive
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Move cursor over plan to see live Vastu Compliant / Not Compliant inspection"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Cursor Scanner: {isCursorScannerActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Vastu Purusha Sacred Icon Representation Toggle */}
          <button
            onClick={() => setShowVastuPurushaIcon(!showVastuPurushaIcon)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              showVastuPurushaIcon
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40 shadow-sm'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle High-Definition Vastu Purusha Sacred Icon Representation Over Grid Center"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Vastu Purusha: {showVastuPurushaIcon ? 'ON' : 'OFF'}</span>
          </button>

          {/* Mandala Vivid Highlight Toggle */}
          <button
            onClick={() => {
              if (!showGrid) {
                setShowGrid(true);
                setIsHighlightMode(true);
              } else {
                setIsHighlightMode(!isHighlightMode);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              showGrid && isHighlightMode
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/10'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle High-Contrast 9-Zone Mandala Highlight"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Grid Highlight: {showGrid && isHighlightMode ? 'VIVID' : 'CLEAN'}</span>
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border cursor-pointer ${
              showGrid
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>9-Zone Grid</span>
          </button>

          {/* Opacity Presets when Grid is on */}
          {showGrid && (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-xs">
              <span className="text-[10px] text-slate-400 font-mono">Opacity:</span>
              {[
                { label: '95%', val: 95 },
                { label: '80%', val: 80 },
                { label: '60%', val: 60 },
              ].map((op) => (
                <button
                  key={op.val}
                  type="button"
                  onClick={() => setGridOpacity(op.val)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    gridOpacity === op.val
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          )}

          {/* Prana Flow Toggle */}
          <button
            onClick={() => setShowPranaFlow(!showPranaFlow)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border cursor-pointer ${
              showPranaFlow
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Prana Flow</span>
          </button>

          {/* Room Pins Toggle */}
          <button
            onClick={() => setShowPins(!showPins)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border cursor-pointer ${
              showPins
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Pins</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            title="Reset zoom to 100%"
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Canvas Rotation controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700 rounded p-0.5">
            <button
              type="button"
              onClick={() => setCanvasRotation((prev) => (prev - 90 + 360) % 360)}
              title="Rotate Plan -90°"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-semibold px-1 text-amber-400 min-w-7 text-center">
              {canvasRotation}°
            </span>
            <button
              type="button"
              onClick={() => setCanvasRotation((prev) => (prev + 90) % 360)}
              title="Rotate Plan +90°"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            {canvasRotation !== 0 && (
              <button
                type="button"
                onClick={() => setCanvasRotation(0)}
                title="Reset Rotation to 0°"
                className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 ml-0.5 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* PDF Multi-page navigation if applicable */}
          {pdfPageInfo && pdfPageInfo.totalPages > 1 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs ml-1">
              <button
                type="button"
                onClick={() => handleSwitchPdfPage(pdfPageInfo.currentPage - 1)}
                disabled={pdfPageInfo.currentPage <= 1 || isRenderingPdf}
                className="p-0.5 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                title="Previous PDF Page"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="font-mono text-[10px] text-amber-400 font-bold px-1">
                P.{pdfPageInfo.currentPage}/{pdfPageInfo.totalPages}
              </span>
              <button
                type="button"
                onClick={() => handleSwitchPdfPage(pdfPageInfo.currentPage + 1)}
                disabled={pdfPageInfo.currentPage >= pdfPageInfo.totalPages || isRenderingPdf}
                className="p-0.5 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                title="Next PDF Page"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        className="relative w-full overflow-hidden bg-[#07090f] min-h-[460px] sm:min-h-[540px] flex items-center justify-center p-4 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background architectural grid blueprint effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Scalable Container */}
        <div
          ref={containerRef}
          className="relative max-w-full max-h-[620px] transition-transform duration-300 ease-out select-none"
          style={{ transform: `scale(${zoom}) rotate(${canvasRotation}deg)` }}
        >
          {/* Base Floor Plan Image or Vector PDF Render */}
          {isRenderingPdf ? (
            <div className="w-[620px] h-[460px] max-w-full bg-slate-900/90 rounded-lg flex flex-col items-center justify-center p-8 border border-slate-700/80 text-center relative shadow-2xl">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
              <div className="text-sm font-semibold text-white">Rendering Architectural PDF Blueprint...</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Generating high-definition vector canvas</div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={finalDisplayImage || imageSrc}
                alt="Analyzed Floor Plan"
                referrerPolicy="no-referrer"
                className="w-auto h-auto max-h-[580px] max-w-full rounded-lg object-contain block mx-auto shadow-2xl border border-slate-700/60"
              />
              {pdfPageInfo && (
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/85 border border-amber-500/50 text-[10px] text-amber-300 font-semibold backdrop-blur-md shadow-lg pointer-events-none">
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>PDF Document (Page {pdfPageInfo.currentPage} of {pdfPageInfo.totalPages})</span>
                </div>
              )}
            </div>
          )}

          {/* Interactive 9-Zone Vastu Purusha Mandala Grid Overlay - High Visibility Highlight */}
          {showGrid && (
            <div
              className={`absolute inset-0 pointer-events-auto rounded-lg grid grid-cols-3 grid-rows-3 transition-all duration-300 ${
                isHighlightMode
                  ? 'border-[3px] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.55),inset_0_0_25px_rgba(245,158,11,0.18)] ring-2 ring-black/90'
                  : 'border-2 border-amber-500/50'
              }`}
              style={{
                opacity: gridOpacity / 100,
              }}
            >
              {orderedGridKeys.map((key) => {
                const zone = VASTU_ZONES_CONFIG.find((z) => z.key === key);
                if (!zone) return null;

                const isSelected = selectedZoneKey === zone.key;
                const isHovered = hoveredZoneKey === zone.key;
                const isCenter = zone.key === 'C';

                const zoneEval = evaluateZoneCompliance(zone.key);
                const isDosha = zoneEval?.isDosha;

                return (
                  <div
                    key={zone.key}
                    onClick={() => setSelectedZoneKey(isSelected ? null : zone.key)}
                    className={`relative p-2 sm:p-2.5 flex flex-col justify-between transition-all cursor-pointer ${
                      isHighlightMode
                        ? 'border-[1.5px] border-amber-400/90 shadow-[0_0_0_1px_rgba(0,0,0,0.85)]'
                        : 'border border-amber-500/35'
                    } ${
                      isHovered
                        ? isDosha
                          ? 'bg-rose-500/30 border-rose-400 ring-2 ring-rose-500 shadow-2xl z-20'
                          : 'bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-400 shadow-2xl z-20'
                        : isSelected
                        ? 'bg-amber-500/20 ring-2 ring-amber-400 border-amber-400 shadow-xl'
                        : isCenter
                        ? 'bg-amber-400/5 hover:bg-amber-400/15 border-amber-400/70 shadow-[inset_0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-transparent hover:bg-amber-500/10'
                    }`}
                  >
                    {/* Zone Header with High Contrast Direction Badge */}
                    <div className="flex items-start justify-between gap-1">
                      <span
                        className={`text-[11px] sm:text-xs font-black tracking-wide text-amber-300 drop-shadow-md ${
                          isHighlightMode
                            ? 'bg-slate-950/95 px-1.5 py-0.5 rounded border border-amber-400/80 shadow-md ring-1 ring-black/70'
                            : 'text-amber-300'
                        }`}
                      >
                        {zone.name.split(' ')[0]}
                      </span>
                      <span
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-mono font-black text-slate-950 shadow-md flex items-center gap-1"
                        style={{ backgroundColor: zone.color }}
                      >
                        {zone.key}
                      </span>
                    </div>

                    {/* Compliance Indicator in cell when hovered */}
                    {isHovered && (
                      <div className="text-center my-auto pointer-events-none z-20">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 shadow-xl border ${
                            isDosha
                              ? 'bg-rose-600 text-white border-rose-300 shadow-rose-950/60 ring-2 ring-rose-400/50'
                              : 'bg-emerald-500 text-slate-950 border-emerald-200 shadow-emerald-950/60 ring-2 ring-emerald-300/50'
                          }`}
                        >
                          {isDosha ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                          )}
                          <span>{isDosha ? 'NOT COMPLIANT' : 'VASTU COMPLIANT'}</span>
                        </span>
                      </div>
                    )}

                    {!isHovered && (
                      <div className="text-center my-auto pointer-events-none">
                        {isCenter ? (
                          <div className="p-1 sm:p-1.5 rounded-lg bg-black/65 border border-amber-400/80 shadow-lg inline-block backdrop-blur-xs ring-1 ring-amber-400/40">
                            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-serif font-black text-amber-200">
                              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
                              <span>BRAHMA STHAN</span>
                            </div>
                            <div className="text-[8px] text-amber-300 font-semibold">
                              Cosmic Core · Ether
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold drop-shadow ${
                                isHighlightMode
                                  ? 'bg-black/80 border border-slate-700/80 text-white shadow-sm'
                                  : 'text-slate-200/90'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.color }} />
                              <span>{zone.element.split(' ')[0]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Zone Footer with Presiding Deity & Trait */}
                    <div className="flex items-center justify-between text-[9px] text-amber-200/95 drop-shadow truncate pt-1">
                      <span className="bg-black/80 px-1.5 py-0.5 rounded border border-slate-800/80 font-bold truncate max-w-[110px]">
                        {zone.deity.split('/')[0]}
                      </span>
                      <span className="text-[8px] text-slate-200 bg-black/70 px-1 py-0.5 rounded hidden sm:inline truncate max-w-[95px] font-mono">
                        {zone.energyTrait.split(',')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* High-Definition Vastu Purusha Icon Representation Over Center Mandala Grid */}
          {showVastuPurushaIcon && (
            <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 400 400"
                className="w-[84%] h-[84%] max-w-[420px] max-h-[420px] transition-all duration-300 drop-shadow-[0_0_16px_rgba(245,158,11,0.5)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="purushaAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#d97706" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="purushaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <filter id="purushaGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Central Brahmasthan Radiant Aura Ring */}
                <circle cx="200" cy="200" r="140" fill="url(#purushaAura)" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="url(#purushaGold)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="200" cy="200" r="85" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.75" />

                {/* Ashtadala Padma: 8-Petaled Sacred Vedic Lotus centered at Brahmasthan */}
                <g transform="translate(200, 200)" opacity="0.85">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                    <path
                      key={idx}
                      d="M 0,0 C -12,-35 -16,-55 0,-70 C 16,-55 12,-35 0,0 Z"
                      fill="none"
                      stroke="url(#purushaGold)"
                      strokeWidth="1.5"
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="28" fill="#090d16" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="0" cy="0" r="14" fill="#f59e0b" fillOpacity="0.5" />
                  <circle cx="0" cy="0" r="5" fill="#fef08a" />
                </g>

                {/* Classical Diagonal Axis of Vastu Purusha (Ishanya/NE Head to Nairutya/SW Feet) */}
                <g filter="url(#purushaGlowFilter)" opacity="0.95">
                  {/* Prana Cosmic Diagonal Axis Line */}
                  <line
                    x1="315"
                    y1="85"
                    x2="85"
                    y2="315"
                    stroke="url(#purushaGold)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.7"
                  />

                  {/* Purusha Head & Crown (Mukuta) at North-East (Ishanya) */}
                  <circle cx="305" cy="95" r="18" fill="#090d16" fillOpacity="0.85" stroke="#fef08a" strokeWidth="2" />
                  <circle cx="305" cy="95" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                  <polygon points="305,73 298,85 312,85" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
                  <circle cx="305" cy="93" r="2.5" fill="#fef08a" />

                  {/* Arms extending towards North-West (Vayu) and South-East (Agni) */}
                  <path
                    d="M 285,115 Q 210,130 115,115"
                    fill="none"
                    stroke="url(#purushaGold)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="115" cy="115" r="7" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />

                  <path
                    d="M 285,115 Q 270,195 285,285"
                    fill="none"
                    stroke="url(#purushaGold)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="285" cy="285" r="7" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />

                  {/* Torso linking Head through Brahmasthan Lotus Navel */}
                  <path
                    d="M 292,108 Q 255,150 200,200"
                    fill="none"
                    stroke="url(#purushaGold)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Lower Torso and Legs Grounded at South-West (Nairutya) */}
                  <path
                    d="M 200,200 Q 145,250 95,305"
                    fill="none"
                    stroke="url(#purushaGold)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <ellipse cx="95" cy="305" rx="14" ry="10" transform="rotate(-45 95 305)" fill="#090d16" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="95" cy="305" r="4" fill="#fef08a" />
                </g>

                {/* Central Brahmasthan Vastu Purusha Seal Emblem */}
                <g transform="translate(200, 245)">
                  <rect
                    x="-75"
                    y="-10"
                    width="150"
                    height="20"
                    rx="10"
                    fill="#090d16"
                    fillOpacity="0.9"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="9"
                    fontWeight="800"
                    fontFamily="serif"
                    letterSpacing="1"
                  >
                    VASTU PURUSHA
                  </text>
                </g>
              </svg>
            </div>
          )}

          {/* Prana Cosmic Diagonal Flow Vector */}
          {showPranaFlow && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pranaGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <line
                  x1="88%"
                  y1="12%"
                  x2="12%"
                  y2="88%"
                  stroke="url(#pranaGrad)"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx="88%" cy="12%" r="22" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.6" />
                <circle cx="88%" cy="12%" r="10" fill="#06b6d4" fillOpacity="0.3" />
                <circle cx="50%" cy="50%" r="26" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="50%" cy="50%" r="8" fill="#f59e0b" fillOpacity="0.5" />
                <rect x="8%" y="82%" width="24" height="24" fill="#b45309" fillOpacity="0.3" stroke="#b45309" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* Interactive Room Pins */}
          {showPins &&
            report.roomAssessments.map((room) => {
              if (!room.coordinates) return null;
              const isActive = activeRoomId === room.id;
              const isCompliant = room.status === 'compliant';
              const isDefective = room.status === 'defective';

              return (
                <div
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoom(isActive ? '' : room.id);
                  }}
                  style={{
                    left: `${room.coordinates.x}%`,
                    top: `${room.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                    isActive ? 'scale-110 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`relative px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 border whitespace-nowrap ${
                      isCompliant
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                        : isDefective
                        ? 'bg-rose-500 text-white border-rose-300'
                        : 'bg-amber-400 text-slate-950 border-amber-200'
                    }`}
                  >
                    {isCompliant ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : isDefective ? (
                      <AlertTriangle className="w-2.5 h-2.5" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                    <span>{room.roomName.split(' ')[0]}</span>
                  </div>

                  {/* Active Pin Detailed Popover */}
                  {isActive && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 rounded-xl bg-slate-950/95 border border-amber-500/80 shadow-2xl backdrop-blur-md text-left pointer-events-auto z-40">
                      <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                        <span className="truncate">{room.roomName}</span>
                        <span className="text-amber-400 font-mono">{room.score}/100</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mb-1">
                        Zone: <strong className="text-amber-300">{room.detectedZone}</strong>
                      </div>
                      <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                        {room.findings}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

          {/* DYNAMIC FLOATING CURSOR HUD (SHOWS VASTU COMPLIANT OR NOT COMPLIANT AS CURSOR MOVES) */}
          {isCursorScannerActive && isHoveringPlan && cursorPos && currentHoverEvaluation && (
            <div
              className={`pointer-events-none absolute z-50 transition-all duration-75 ${
                cursorPos.isNearLeft
                  ? 'translate-x-3'
                  : cursorPos.isNearRight
                  ? '-translate-x-[94%]'
                  : '-translate-x-1/2'
              } ${cursorPos.isNearTop ? 'translate-y-4' : '-translate-y-[108%]'}`}
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
              }}
            >
              <div
                className={`p-3 rounded-xl shadow-2xl backdrop-blur-md border flex flex-col gap-1.5 w-68 text-left ${
                  currentHoverEvaluation.isDosha
                    ? 'bg-rose-950/95 border-rose-500 text-rose-100 ring-2 ring-rose-500/50 shadow-rose-950/90'
                    : 'bg-emerald-950/95 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/50 shadow-emerald-950/90'
                }`}
              >
                {/* Big Compliance Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                      currentHoverEvaluation.isDosha
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {currentHoverEvaluation.isDosha ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                    )}
                    <span>{currentHoverEvaluation.isDosha ? 'NOT COMPLIANT' : 'VASTU COMPLIANT'}</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">
                    {currentHoverEvaluation.zoneConfig.key}
                  </span>
                </div>

                {/* Zone & Deity */}
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-white mt-0.5">
                  <span className="truncate">{currentHoverEvaluation.zoneConfig.name}</span>
                  <span className="text-[10px] font-mono text-amber-300/90 font-normal shrink-0">
                    {currentHoverEvaluation.zoneConfig.element.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  Presiding Deity: {currentHoverEvaluation.zoneConfig.deity.split('/')[0]}
                </div>

                {/* Live Finding / Status Description */}
                <p className="text-[10px] text-slate-200 leading-relaxed bg-black/40 p-2 rounded-lg border border-white/10">
                  {currentHoverEvaluation.detail}
                </p>

                {/* Activity Placement Rules: Place ... NOT ... */}
                <div className="bg-black/60 p-2 rounded-lg border border-white/10 space-y-1 text-[10px]">
                  <div className="flex items-start gap-1.5 text-emerald-300 font-medium leading-tight">
                    <span className="font-bold text-emerald-400 shrink-0">✅ Place:</span>
                    <span className="truncate">{currentHoverEvaluation.zoneConfig.idealFor.split(',').slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-rose-300 font-medium leading-tight">
                    <span className="font-bold text-rose-400 shrink-0">❌ NOT:</span>
                    <span className="truncate">{currentHoverEvaluation.zoneConfig.taboo.split(',').slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                {/* If Dosha, show remedy hint and structural action */}
                {currentHoverEvaluation.isDosha && currentHoverEvaluation.doshaItem && (
                  <div className="space-y-1">
                    <div className="text-[9px] text-amber-300 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">Cure: {currentHoverEvaluation.doshaItem.remedyTitle}</span>
                    </div>
                    {currentHoverEvaluation.doshaItem.structuralRemedy && (
                      <div className="text-[9px] text-amber-200 font-medium flex items-center gap-1 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/40">
                        <Wrench className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">Structural: {currentHoverEvaluation.doshaItem.structuralRemedy.recommendedActivity}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cardinal Compass Rose in Corner */}
        <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center relative">
            <div className="absolute top-0 text-[9px] font-mono font-bold text-amber-400">N</div>
            <div className="absolute right-0 text-[8px] font-mono text-slate-400">E</div>
            <div className="absolute bottom-0 text-[8px] font-mono text-slate-400">S</div>
            <div className="absolute left-0 text-[8px] font-mono text-slate-400">W</div>
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
          </div>
          <span className="text-[9px] text-slate-400 mt-1 font-mono">True North</span>
        </div>
      </div>

      {/* LIVE CURSOR STATUS FOOTER BAR */}
      <div className="p-3 sm:p-4 dark:bg-slate-950 bg-slate-50 border-t dark:border-slate-800 border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold dark:text-slate-300 text-slate-700">Live Spatial Inspector:</span>
          {currentHoverEvaluation ? (
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 ${
                currentHoverEvaluation.isDosha
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {currentHoverEvaluation.isDosha ? (
                <AlertTriangle className="w-3 h-3 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              )}
              <span>
                {currentHoverEvaluation.zoneConfig.name.split(' ')[0]}: {currentHoverEvaluation.verdictTitle}
              </span>
            </span>
          ) : (
            <span className="dark:text-slate-500 text-slate-400 italic">
              Hover your cursor anywhere across the floor plan to inspect Vastu compliance live
            </span>
          )}
        </div>

        {currentHoverEvaluation && (
          <div className="text-[11px] dark:text-slate-300 text-slate-600 truncate max-w-md hidden md:block">
            {currentHoverEvaluation.detail}
          </div>
        )}
      </div>

      {/* Selected Zone Inspector Bar (when a cell is explicitly clicked) */}
      {selectedZoneDetails && (
        <div className="p-4 dark:bg-slate-950/90 bg-white border-t dark:border-slate-800 border-slate-200 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b dark:border-slate-800/80 border-slate-200">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20"
                style={{ backgroundColor: selectedZoneDetails.color }}
              />
              <span className="font-bold dark:text-white text-slate-900 text-sm">
                {selectedZoneDetails.name}
              </span>
              <span className="dark:text-slate-400 text-slate-500">· Deity: {selectedZoneDetails.deity}</span>
            </div>
            <span className="font-mono text-[11px] font-semibold" style={{ color: themeConfig.primary }}>
              Element: {selectedZoneDetails.element}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg dark:bg-emerald-950/40 bg-emerald-50/80 border border-emerald-500/30">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Auspicious to Place (What belongs here):</span>
              </span>
              <span className="dark:text-slate-200 text-slate-700 leading-relaxed">{selectedZoneDetails.idealFor}</span>
            </div>
            <div className="p-2.5 rounded-lg dark:bg-rose-950/40 bg-rose-50/80 border border-rose-500/30">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Strictly Prohibited (NOT here):</span>
              </span>
              <span className="dark:text-slate-200 text-slate-700 leading-relaxed">{selectedZoneDetails.taboo}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
