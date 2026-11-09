'use client';

import React from 'react';
import { VastuAnalysisReport } from '@/lib/vastu-types';
import { ShieldCheck, Sparkles, Compass, AlertTriangle, Droplets, Flame, Wind, Mountain, Sun, Layers } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface VastuScoreOverviewProps {
  report: VastuAnalysisReport;
  onPrintReport: () => void;
}

export function VastuScoreOverview({ report, onPrintReport }: VastuScoreOverviewProps) {
  const { themeConfig } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getElementIcon = (elementName: string) => {
    switch (elementName.toLowerCase()) {
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-sky-400" />;
      case 'fire':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'earth':
        return <Mountain className="w-3.5 h-3.5 text-amber-500" />;
      case 'air':
        return <Wind className="w-3.5 h-3.5 text-purple-400" />;
      case 'space':
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-400" style={{ color: themeConfig.primary }} />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6 text-slate-100">
      {/* Top Banner: Score, Grade & Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-5">
          {/* Circular Score Badge */}
          <div
            className="relative w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shrink-0 shadow-inner"
            style={{ borderColor: themeConfig.primaryBorder }}
          >
            <span
              className="text-3xl font-serif font-bold tabular-nums text-amber-400"
              style={{ color: themeConfig.primary }}
            >
              {report.overallScore}
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              / 100 Vastu
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Vedic Architectural Compliance</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getScoreColor(report.overallScore)}`}>
                {report.vastuGrade}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {report.pranaEnergyVerdict}
            </p>
          </div>
        </div>

        <button
          onClick={onPrintReport}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>View & Download Certificate (PDF)</span>
        </button>
      </div>

      {/* Executive Summary Narrative */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <span className="font-semibold text-amber-400" style={{ color: themeConfig.primary }}>
          Executive Energy Synthesis:{' '}
        </span>
        {report.executiveSummary}
      </div>

      {/* 2-Column Core Diagnostics: Brahmasthan & Entrance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brahmasthan Card */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Center Core (Brahmasthan)</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${report.brahmasthanStatus.isOpen ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {report.brahmasthanStatus.isOpen ? 'Unobstructed' : 'Congested'}
            </span>
          </div>
          <p className="text-xs text-slate-300">{report.brahmasthanStatus.verdict}</p>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">{report.brahmasthanStatus.advice}</p>
        </div>

        {/* Entrance Card */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Main Threshold (Mukhya Dwar)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20">
              {report.entranceStatus.zone}
            </span>
          </div>
          <p className="text-xs text-slate-300">{report.entranceStatus.padaVerdict}</p>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">{report.entranceStatus.recommendation}</p>
        </div>
      </div>

      {/* 5 Elements (Pancha Bhuta) Energy Balance Meter */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            5 Elements (Pancha Bhuta) Energy Distribution
          </h3>
          <span className="text-xs text-slate-500">Cosmic Equilibrium</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {report.elementBalances.map((elem) => (
            <div
              key={elem.element}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5">
                  {getElementIcon(elem.element)}
                  <span className="font-semibold text-white">{elem.element}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {elem.sanskritName}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${elem.percentage}%`,
                    backgroundColor:
                      elem.element === 'Water'
                        ? '#38bdf8'
                        : elem.element === 'Fire'
                        ? '#fb923c'
                        : elem.element === 'Earth'
                        ? '#f59e0b'
                        : elem.element === 'Air'
                        ? '#a855f7'
                        : themeConfig.primary,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{elem.zoneRepresented}</span>
                <span className="text-white font-bold tabular-nums">{elem.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
