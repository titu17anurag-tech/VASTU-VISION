'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { VastuAnalysisReport } from '@/lib/vastu-types';
import { Printer, Download, X, Compass, CheckCircle2, ShieldCheck, Sun, FileDown, Check, MapPin, Edit3, Save, Hammer, Wrench, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { formatPlaceName } from '@/lib/vastu-analyzer-engine';
import { ZONE_ACTIVITY_RULES } from '@/lib/vastu-data';
import { useTheme } from '@/lib/theme-context';

interface PrintReportModalProps {
  report: VastuAnalysisReport;
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  placeName?: string;
  onUpdatePlaceName?: (name: string) => void;
}

export function PrintReportModal({
  report,
  isOpen,
  onClose,
  fileName,
  placeName,
  onUpdatePlaceName,
}: PrintReportModalProps) {
  const { themeConfig } = useTheme();
  const [editedPlaceName, setEditedPlaceName] = useState<string | null>(null);
  const [prevPlaceProp, setPrevPlaceProp] = useState<string | null>(placeName || null);
  const [isEditingPlaceName, setIsEditingPlaceName] = useState<boolean>(false);

  // If external placeName changed, reset local edit
  if (placeName !== prevPlaceProp) {
    setPrevPlaceProp(placeName || null);
    setEditedPlaceName(null);
  }

  const currentPlaceName = editedPlaceName !== null
    ? editedPlaceName
    : (placeName || report.placeName || formatPlaceName(fileName));

  const certificateId = useMemo(() => {
    return `VV-${(currentPlaceName || fileName || '8842').split('').reduce((acc, c) => acc + c.charCodeAt(0), 100000) % 900000 + 100000}`;
  }, [currentPlaceName, fileName]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Vastu_Remediation_Certificate_${currentPlaceName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownloadJson = () => {
    const exportData = {
      ...report,
      placeName: currentPlaceName,
      fileName,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Vastu_Remediation_Certificate_${currentPlaceName.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 print:my-0 print:shadow-none print:border-none print:rounded-none flex flex-col max-h-[92vh]">
        {/* TOP CONTROLS BAR (Hidden during Print) */}
        <div className="no-print sticky top-0 z-30 p-3.5 sm:p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Official Vastu Remediation Certificate</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Ref: {certificateId}</span>
                <span>·</span>
                <span className="text-amber-400 font-medium truncate max-w-[220px]" title={currentPlaceName}>
                  Premises: {currentPlaceName}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Download / Print PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              style={{ background: themeConfig.buttonGradient }}
              title="Print Certificate or Save as PDF"
            >
              <Download className="w-4 h-4 text-white stroke-[2.5]" />
              <Printer className="w-4 h-4 text-white stroke-[2.2]" />
              <span className="text-xs tracking-tight uppercase">Download / Print PDF</span>
            </button>

            {/* Download JSON summary */}
            <button
              onClick={handleDownloadJson}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Download Raw Audit JSON"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON</span>
            </button>

            {/* High-Contrast Close Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/60 transition-all active:scale-[0.98] cursor-pointer"
              title="Close Certificate (ESC)"
            >
              <X className="w-4 h-4 text-white stroke-[3]" />
              <span className="uppercase tracking-wider">Close</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE & AUDIT BODY */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-white print:p-4 text-slate-900 flex-1">
          {/* Certificate Header Stamp */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-slate-950 tracking-tight">
                  VASTU SHASTRA ARCHITECTURAL REMEDIATION CERTIFICATE
                </div>
                <div className="text-xs font-semibold text-amber-800 mt-1 uppercase tracking-wide">
                  Vedic Spatial Energy Audit & Rectification Sanction
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-800 tabular-nums">
                  {report.overallScore}/100
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Grade: {report.vastuGrade}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Verified: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Prominent Place / Premises Banner as per Uploaded Plan */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-800 shrink-0">
                  <MapPin className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Certified Place / Property Name as per Uploaded Plan:
                  </div>
                  {isEditingPlaceName ? (
                    <div className="flex items-center gap-2 mt-1 no-print">
                      <input
                        type="text"
                        value={currentPlaceName}
                        onChange={(e) => {
                          setEditedPlaceName(e.target.value);
                          if (onUpdatePlaceName) onUpdatePlaceName(e.target.value);
                        }}
                        className="text-sm font-bold text-slate-900 border border-amber-400 rounded px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingPlaceName(false)}
                        className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-serif font-bold text-slate-950 underline decoration-amber-500/80 decoration-2">
                        {currentPlaceName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingPlaceName(true)}
                        className="no-print text-[11px] text-amber-800 hover:text-amber-950 underline font-medium flex items-center gap-1 cursor-pointer ml-1.5"
                        title="Edit place name for this certificate"
                      >
                        <Edit3 className="w-3 h-3 text-amber-700" />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-600 font-mono sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200/80">
                <div>Blueprint Document: <strong className="text-slate-800">{fileName}</strong></div>
                <div>Vedic Orientation: <strong className="text-slate-800">{report.orientation}</strong></div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Energy Diagnosis */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <span>1. Executive Spatial Diagnosis</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {report.executiveSummary}
            </p>
          </div>

          {/* Section 2: Pancha Bhuta 5 Elements Balance Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              2. Pancha Bhuta (5 Elements) Distribution
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
                    <th className="p-2.5 border border-slate-200">Element</th>
                    <th className="p-2.5 border border-slate-200">Zone</th>
                    <th className="p-2.5 border border-slate-200">Cosmic Significance</th>
                    <th className="p-2.5 border border-slate-200 text-right">Balance Score</th>
                  </tr>
                </thead>
                <tbody>
                  {report.elementBalances.map((elem) => (
                    <tr key={elem.element} className="border-b border-slate-200">
                      <td className="p-2.5 font-bold border border-slate-200">
                        {elem.element} ({elem.sanskritName})
                      </td>
                      <td className="p-2.5 border border-slate-200">{elem.zoneRepresented}</td>
                      <td className="p-2.5 text-slate-600 border border-slate-200">{elem.significance}</td>
                      <td className="p-2.5 font-mono font-bold text-right border border-slate-200 text-slate-900">
                        {elem.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Room-by-room evaluation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              3. Room-by-Room Spatial Energy Audit
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
                    <th className="p-2.5 border border-slate-200">Room Name</th>
                    <th className="p-2.5 border border-slate-200">Detected Zone</th>
                    <th className="p-2.5 border border-slate-200">Ideal Zone</th>
                    <th className="p-2.5 border border-slate-200">Status</th>
                    <th className="p-2.5 border border-slate-200 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {report.roomAssessments.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200">
                      <td className="p-2.5 font-bold border border-slate-200">{r.roomName}</td>
                      <td className="p-2.5 border border-slate-200">{r.detectedZone}</td>
                      <td className="p-2.5 border border-slate-200 text-emerald-800 font-semibold">{r.idealZone}</td>
                      <td className="p-2.5 border border-slate-200 capitalize font-medium">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            r.status === 'compliant'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'defective'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status === 'compliant' ? 'Compliant' : r.status === 'defective' ? 'Dosha' : 'Tolerable'}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-right border border-slate-200">
                        {r.score}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Non-Destructive Action Remedies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              4. Prioritized Non-Structural Remediation Actions (Zero Demolition)
            </h3>

            {/* Remediation Certificate Sanction Callout */}
            <div className="mb-3.5 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs uppercase tracking-wide text-amber-900">
                  Vedic Rectification Sanction for: <span className="underline font-bold text-slate-950">{currentPlaceName}</span>
                </div>
                <div className="text-slate-700 text-xs mt-1 leading-relaxed">
                  This certifies that the Vedic energy remedies prescribed below are specifically customized for <strong>{currentPlaceName}</strong> as per the uploaded architectural floor plan (<em>{fileName}</em>) to transmute detected elemental doshas and restore auspicious prana flow without structural demolition.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {report.detectedDoshas.map((d, i) => (
                <div key={d.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <div className="font-bold text-slate-950 mb-1 text-sm">
                    {i + 1}. {d.title} ({d.zone})
                  </div>
                  <div className="text-slate-700 mb-2 leading-relaxed">{d.description}</div>
                  <div className="font-bold text-amber-900 mb-1.5">
                    Recommended Cure: {d.remedyTitle}
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {d.actionableSteps.map((st, sidx) => (
                      <li key={sidx}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Structural Architectural Changes & Activity Placement Blueprint */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-amber-700" />
                <span>5. Structural Architectural Changes & Zone Activity Placement Blueprint</span>
              </span>
              <span className="text-[10px] text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded">
                Civil & Masonry Specifications
              </span>
            </h3>

            {/* Core Structural Placement Rules (North-East Place Pooja NOT Toilet, etc.) */}
            <div className="mb-4 p-3.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800">
              <div className="flex items-center gap-2 mb-2 font-bold text-amber-400 text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Fundamental Vedic Activity Placement Law (What to Place Where)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px]">
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
                  <div className="font-bold text-cyan-300">North-East (Ishanya):</div>
                  <div className="text-emerald-300 font-medium mt-0.5">✅ Place POOJA / MANDIR / MEDITATION</div>
                  <div className="text-rose-300 font-medium mt-0.5">❌ NOT Toilet, Kitchen, or Heavy Storage</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
                  <div className="font-bold text-orange-300">South-East (Agni):</div>
                  <div className="text-emerald-300 font-medium mt-0.5">✅ Place KITCHEN / COOKTOP / ELECTRICALS</div>
                  <div className="text-rose-300 font-medium mt-0.5">❌ NOT Water Sump, Toilet, or Master Bed</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
                  <div className="font-bold text-amber-300">South-West (Nairutya):</div>
                  <div className="text-emerald-300 font-medium mt-0.5">✅ Place MASTER BED / WARDROBE / CASH VAULT</div>
                  <div className="text-rose-300 font-medium mt-0.5">❌ NOT Toilet, Water Tank, Entrance, or Cut</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
                  <div className="font-bold text-sky-300">North-West (Vayavya):</div>
                  <div className="text-emerald-300 font-medium mt-0.5">✅ Place GUEST BED / ATTACHED BATH / PANTRY</div>
                  <div className="text-rose-300 font-medium mt-0.5">❌ NOT Master Bedroom or Sacred Mandir</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
                  <div className="font-bold text-blue-300">North (Uttar / Kubera):</div>
                  <div className="text-emerald-300 font-medium mt-0.5">✅ Place LIVING / TREASURY / FRONT ENTRY</div>
                  <div className="text-rose-300 font-medium mt-0.5">❌ NOT Toilet, Septic Tank, or Heavy Stairs</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
                  <div className="font-bold text-purple-300">Center (Brahmasthan):</div>
                  <div className="text-emerald-300 font-medium mt-0.5">✅ Keep OPEN CIRCULATION / LIGHT ATRIUM</div>
                  <div className="text-rose-300 font-medium mt-0.5">❌ NOT Concrete Pillars, Toilet, or Kitchen</div>
                </div>
              </div>
            </div>

            {/* Detected Structural Civil Remodeling Actions for this floor plan */}
            <div className="space-y-3 mb-4">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                Detected Premise Civil & Remodeling Tasks:
              </div>
              {report.detectedDoshas
                .filter((d) => d.structuralRemedy)
                .map((d, sIdx) => {
                  const s = d.structuralRemedy!;
                  return (
                    <div key={`struct-${d.id}`} className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-amber-200">
                        <div className="font-bold text-slate-950 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                            {sIdx + 1}
                          </span>
                          <span>{d.title}</span>
                          <span className="text-amber-800 font-mono text-[11px]">({d.zone})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300">
                            {s.actionType}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Urgency: {s.renovationUrgency}
                          </span>
                        </div>
                      </div>

                      {/* Before / After Activity Swap Banner */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5 bg-white p-2.5 rounded-lg border border-amber-200/80">
                        <div className="text-rose-700">
                          <span className="font-bold block text-[10px] uppercase tracking-wide text-rose-900">
                            Current Incompatible Placement:
                          </span>
                          <span className="font-semibold">{s.currentActivity}</span>
                          <div className="text-[10px] text-slate-500 mt-0.5">Strictly prohibited in this cosmic sector</div>
                        </div>
                        <div className="text-emerald-800">
                          <span className="font-bold block text-[10px] uppercase tracking-wide text-emerald-950">
                            Recommended Activity to Relocate Here:
                          </span>
                          <span className="font-semibold">{s.recommendedActivity}</span>
                          <div className="text-[10px] text-emerald-700 mt-0.5">Auspicious match for zone presiding deity</div>
                        </div>
                      </div>

                      {/* Structural Civil Execution Steps */}
                      <div>
                        <div className="font-bold text-slate-800 mb-1 flex items-center gap-1 text-[11px]">
                          <Wrench className="w-3.5 h-3.5 text-amber-700" />
                          <span>Civil Masonry & Plumbing Steps:</span>
                        </div>
                        <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                          {s.structuralSteps.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Engineering Consideration */}
                      <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px] text-slate-600 italic">
                        <strong>Engineering & Permitting Note: </strong>
                        {s.civilConsiderations}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 9-Zone Activity Reference Matrix Table */}
            <div>
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                Complete 9-Zone Residential Activity Matrix:
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
                      <th className="p-2 border border-slate-200">Zone & Deity</th>
                      <th className="p-2 border border-slate-200 text-emerald-900">Auspicious Activities (Place Here)</th>
                      <th className="p-2 border border-slate-200 text-rose-900">Strictly Prohibited (NOT Here)</th>
                      <th className="p-2 border border-slate-200">Structural Rectification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(report.zoneActivityMatrix || ZONE_ACTIVITY_RULES).map((z) => (
                      <tr key={z.zoneKey} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="p-2 font-bold border border-slate-200 whitespace-nowrap align-top">
                          <div>{z.zoneName.split(' ')[0]}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{z.rulingDeity.split('/')[0]}</div>
                        </td>
                        <td className="p-2 border border-slate-200 text-slate-700 align-top">
                          <ul className="list-disc pl-4 space-y-0.5">
                            {z.auspiciousActivities.slice(0, 3).map((a, i) => (
                              <li key={i}>
                                <strong className="text-slate-900">{a.activity}</strong>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-2 border border-slate-200 text-slate-700 align-top">
                          <ul className="list-disc pl-4 space-y-0.5">
                            {z.prohibitedActivities.slice(0, 2).map((p, i) => (
                              <li key={i} className="text-rose-900 font-medium">
                                {p.activity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-2 border border-slate-200 text-slate-600 text-[10px] leading-snug align-top">
                          {z.structuralCureIfMisplaced}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer with sign-off stamp */}
          <div className="border-t-2 border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div>
              <div className="font-bold text-slate-950 text-sm">VastuVision Architectural Intelligence</div>
              <div>Classical Vedic Mayamata & Manasara Principles · Spatial Rectification Authority</div>
              <div className="text-[11px] text-slate-800 font-medium mt-1">
                Certified Premises: <strong className="text-slate-950">{currentPlaceName}</strong> · Blueprint: <strong className="text-slate-950">{fileName}</strong>
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="font-bold text-slate-900">CERTIFICATE STAMP #{certificateId}</div>
              <div className="text-[10px] text-emerald-800 font-bold mt-0.5 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>VALIDATED VASTU REMEDIATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR (Hidden during Print) */}
        <div className="no-print p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-600 font-medium hidden sm:block">
            Print preview or save as PDF via your browser&apos;s print dialog.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
