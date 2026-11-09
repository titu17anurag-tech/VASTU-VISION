'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FloorPlanUploader } from '@/components/FloorPlanUploader';
import { FloorPlanCanvasViewer } from '@/components/FloorPlanCanvasViewer';
import { VastuScoreOverview } from '@/components/VastuScoreOverview';
import { RoomAssessmentTable } from '@/components/RoomAssessmentTable';
import { DoshaAndRemedies } from '@/components/DoshaAndRemedies';
import { EnergyFlowGuide } from '@/components/EnergyFlowGuide';
import { VastuPurushaGuide } from '@/components/VastuPurushaGuide';
import { VastuAiConsultant } from '@/components/VastuAiConsultant';
import { PrintReportModal } from '@/components/PrintReportModal';
import { SAMPLE_FLOOR_PLANS, BENCHMARK_3BHK_REPORT } from '@/lib/vastu-data';
import { VastuAnalysisReport } from '@/lib/vastu-types';
import { generateDynamicVastuReport } from '@/lib/vastu-analyzer-engine';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, Layers, FileText, MessageSquare } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function Home() {
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('analysis');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeImagePreview, setActiveImagePreview] = useState<string>(
    SAMPLE_FLOOR_PLANS[0].imageSrc
  );
  const [activeFileName, setActiveFileName] = useState<string>(
    SAMPLE_FLOOR_PLANS[0].title
  );
  const [activePlaceName, setActivePlaceName] = useState<string>(
    SAMPLE_FLOOR_PLANS[0].title
  );
  const [report, setReport] = useState<VastuAnalysisReport>(BENCHMARK_3BHK_REPORT);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [engineBadge, setEngineBadge] = useState<{
    text: string;
    isLive: boolean;
  } | null>(null);

  // Quick select a sample floor plan
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_FLOOR_PLANS.find((s) => s.id === sampleId);
    if (!found) return;

    setActiveImagePreview(found.imageSrc);
    setActiveFileName(found.title);
    setActivePlaceName(found.title);
    setActiveRoomId(null);

    // Generate tailored dynamic report for the selected sample
    const sampleReport = generateDynamicVastuReport({
      orientation: `${found.facing} Facing Layout`,
      fileName: found.title,
      placeName: found.title,
    });
    setReport(sampleReport);
    setEngineBadge({
      text: `Calibrated for ${found.title} (${found.facing} Facing)`,
      isLive: true,
    });

    const el = document.getElementById('viewer-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToUpload = () => {
    const el = document.getElementById('upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: string, shouldScroll = true) => {
    setActiveTab(tab);
    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById('tabs-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  // Perform AI analysis on uploaded file
  const handleAnalyzeFloorPlan = async (data: {
    imageBase64: string;
    mimeType: string;
    orientation: string;
    userNotes: string;
    fileName: string;
    placeName: string;
  }) => {
    setIsLoading(true);
    setActiveImagePreview(data.imageBase64);
    setActiveFileName(data.fileName);
    setActivePlaceName(data.placeName || data.fileName);
    setActiveRoomId(null);

    try {
      const res = await fetch('/api/vastu/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: data.imageBase64,
          mimeType: data.mimeType,
          orientation: data.orientation,
          userNotes: data.userNotes,
          fileName: data.fileName,
          placeName: data.placeName,
        }),
      });

      const responseData = await res.json();
      if (responseData.report) {
        setReport(responseData.report);
        if (responseData.report.placeName) {
          setActivePlaceName(responseData.report.placeName);
        }
        setEngineBadge({
          text: `Vastu Analysis Complete (${responseData.engineUsed || 'Vedic Architectural Engine'})`,
          isLive: !!responseData.isLiveAi,
        });
      } else {
        const fallback = generateDynamicVastuReport({
          orientation: data.orientation,
          userNotes: data.userNotes,
          fileName: data.fileName,
          placeName: data.placeName,
        });
        setReport(fallback);
      }

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('viewer-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } catch (err) {
      console.error('Failed to analyze floor plan:', err);
      const fallback = generateDynamicVastuReport({
        orientation: data.orientation,
        userNotes: data.userNotes,
        fileName: data.fileName,
        placeName: data.placeName,
      });
      setReport(fallback);
      setEngineBadge({
        text: 'Analysis generated using Vedic Architectural Engine',
        isLive: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setActiveImagePreview(SAMPLE_FLOOR_PLANS[0].imageSrc);
    setActiveFileName(SAMPLE_FLOOR_PLANS[0].title);
    setReport(BENCHMARK_3BHK_REPORT);
    setActiveRoomId(null);
    setEngineBadge(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b12] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        onAnalyzeClick={handleScrollToUpload}
        onSampleSelect={handleSelectSample}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <main className="flex-1 space-y-10 sm:space-y-12 pb-20">
        {/* Hero Section with Quick Demo Launchers */}
        <HeroSection
          onSelectSample={handleSelectSample}
          onScrollToUpload={handleScrollToUpload}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
          {/* Floor Plan Uploader & Orientation Selector */}
          <FloorPlanUploader
            onAnalyze={handleAnalyzeFloorPlan}
            isLoading={isLoading}
            activeImagePreview={activeImagePreview}
            activeFileName={activeFileName}
            activePlaceName={activePlaceName}
            onClear={handleClear}
          />

          {/* Interactive Viewer Section */}
          <section id="viewer-section" className="scroll-mt-20 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <span>Interactive Spatial Energy Canvas</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Hover or click zones to inspect presiding deities, cosmic elements, and Pranic vector pathways.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {engineBadge && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{engineBadge.text}</span>
                  </div>
                )}
                <div
                  className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border shadow-xs"
                  style={{
                    backgroundColor: themeConfig.primaryBg,
                    borderColor: themeConfig.primaryBorder,
                    color: themeConfig.primary,
                  }}
                >
                  <Compass className="w-3.5 h-3.5" style={{ color: themeConfig.primary }} />
                  <span>
                    Place: <strong className="font-sans font-semibold underline">{activePlaceName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Canvas Viewer */}
            <FloorPlanCanvasViewer
              imageSrc={activeImagePreview}
              report={report}
              activeRoomId={activeRoomId}
              onSelectRoom={(id) => {
                setActiveRoomId(id);
                if (id) {
                  const el = document.getElementById('room-audit-table');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }
              }}
            />

            {/* Vastu Score & Diagnostics */}
            <VastuScoreOverview
              report={report}
              onPrintReport={() => setIsPrintModalOpen(true)}
            />

            {/* Dedicated High-Visibility On-Page Tab Navigation Strip */}
            <div
              id="tabs-section"
              className="scroll-mt-24 sticky top-14 z-30 bg-[#080b12]/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  {
                    id: 'analysis',
                    label: 'Floor Plan Audit',
                    sub: 'Room Matrix & Energy',
                    icon: FileText,
                    badge: `${report.roomAssessments.length} Rooms`,
                  },
                  {
                    id: 'zones',
                    label: '9-Zone Mandala',
                    sub: 'Vastu Purusha Grid',
                    icon: Compass,
                    badge: '9 Sectors',
                  },
                  {
                    id: 'remedies',
                    label: 'Energy Remedies',
                    sub: 'Civil & Non-Demolition',
                    icon: ShieldCheck,
                    badge: `${report.detectedDoshas.length} Doshas`,
                    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                  },
                  {
                    id: 'consult',
                    label: 'Ask Vastu AI',
                    sub: 'Interactive Advisor',
                    icon: MessageSquare,
                    badge: 'AI Active',
                    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  },
                ].map((t) => {
                  const isActive = activeTab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTabChange(t.id, false)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 border-amber-500/80 shadow-lg ring-1 ring-amber-500/40 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700 text-slate-300'
                      }`}
                      style={
                        isActive
                          ? {
                              borderColor: themeConfig.primary,
                              boxShadow: `0 0 15px ${themeConfig.primaryBg}`,
                            }
                          : undefined
                      }
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          backgroundColor: isActive ? themeConfig.primaryBg : 'rgba(100,116,139,0.1)',
                          borderColor: isActive ? themeConfig.primaryBorder : 'rgba(100,116,139,0.2)',
                          borderWidth: 1,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: isActive ? themeConfig.primary : '#94a3b8' }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate">
                            {t.label}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                              t.badgeColor || (isActive ? 'border-current' : 'text-slate-400 bg-slate-800 border-slate-700')
                            }`}
                            style={!t.badgeColor && isActive ? { color: themeConfig.primary, borderColor: themeConfig.primaryBorder } : undefined}
                          >
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {t.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabbed Views */}
            {activeTab === 'analysis' && (
              <div className="space-y-10">
                {/* Room-by-Room Evaluation */}
                <div id="room-audit-table" className="scroll-mt-24">
                  <RoomAssessmentTable
                    rooms={report.roomAssessments}
                    activeRoomId={activeRoomId}
                    onSelectRoom={(id) => setActiveRoomId(id)}
                  />
                </div>

                {/* Detected Doshas & Actionable Non-Structural Remedies */}
                <DoshaAndRemedies
                  doshas={report.detectedDoshas}
                  placeName={activePlaceName}
                  onViewCertificate={() => setIsPrintModalOpen(true)}
                />

                {/* Actionable Energy Flow Improvements */}
                <EnergyFlowGuide
                  recommendations={report.energyFlowRecommendations}
                  quickWins={report.quickWins}
                />
              </div>
            )}

            {activeTab === 'zones' && (
              <div className="space-y-10">
                <VastuPurushaGuide />
                <div id="room-audit-table" className="scroll-mt-24">
                  <RoomAssessmentTable
                    rooms={report.roomAssessments}
                    activeRoomId={activeRoomId}
                    onSelectRoom={(id) => setActiveRoomId(id)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'remedies' && (
              <div className="space-y-10">
                <DoshaAndRemedies
                  doshas={report.detectedDoshas}
                  placeName={activePlaceName}
                  onViewCertificate={() => setIsPrintModalOpen(true)}
                />
                <EnergyFlowGuide
                  recommendations={report.energyFlowRecommendations}
                  quickWins={report.quickWins}
                />
              </div>
            )}

            {activeTab === 'consult' && (
              <div className="space-y-10">
                <VastuAiConsultant report={report} />
                <DoshaAndRemedies
                  doshas={report.detectedDoshas}
                  placeName={activePlaceName}
                  onViewCertificate={() => setIsPrintModalOpen(true)}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Clean Architectural Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="font-serif font-bold text-white text-sm">VastuVision</span>
              <span className="text-[11px] text-slate-500 font-mono">· AI Architectural Intelligence</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Harmonizing residential architecture with classical Vedic Vastu Purusha Mandala principles.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-400">
            <span>9-Zone Grid</span>
            <span>·</span>
            <span>Pancha Bhuta Balance</span>
            <span>·</span>
            <span>Structural & Non-Structural Cures</span>
            <span>·</span>
            <span>Zero Demolition</span>
          </div>
        </div>
      </footer>

      {/* Official Audit Certificate Printable Modal */}
      <PrintReportModal
        report={report}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        fileName={activeFileName}
        placeName={activePlaceName}
        onUpdatePlaceName={(newName) => setActivePlaceName(newName)}
      />
    </div>
  );
}
