'use client';

import React from 'react';
import { SAMPLE_FLOOR_PLANS } from '@/lib/vastu-data';
import { useTheme } from '@/lib/theme-context';
import { Compass, Sparkles, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onSelectSample: (sampleId: string) => void;
  onScrollToUpload: () => void;
}

export function HeroSection({ onSelectSample, onScrollToUpload }: HeroSectionProps) {
  const { themeConfig } = useTheme();

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-10 pb-12 sm:pb-14 border-b border-slate-800/60">
      {/* Background glow effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 blur-3xl pointer-events-none -z-10 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${themeConfig.primary}, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs"
              style={{
                backgroundColor: themeConfig.primaryBg,
                color: themeConfig.primary,
                borderColor: themeConfig.primaryBorder,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: themeConfig.primary }} />
              <span>Vedic Architectural Intelligence · Multimodal Floor Plan Analysis</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.18] text-balance">
              Harmonize Home Energy with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">
                AI Vastu Shastra
              </span>{' '}
              Precision
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Upload floor plans in any format (PDF, CAD blueprints, JPG, PNG). Instant directional energy diagnosis, 9-zone Vastu Purusha Mandala mapping, dosha detection, and actionable structural & non-structural remedies.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToUpload}
                className="flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Upload Floor Plan (Any Format)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>or test with sample blueprints below</span>
              </div>
            </div>

            {/* Value metrics strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <div
                  className="text-xl sm:text-2xl font-serif font-bold tabular-nums text-amber-400"
                  style={{ color: themeConfig.primary }}
                >
                  9-Zone
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Purusha Mandala Grid</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 tabular-nums">
                  100%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Civil & Zero-Demolition Cures</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-sky-400 tabular-nums">
                  5 Elements
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Pancha Bhuta Balance</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Sample Floor Plan Cards */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1-Click Instant Demo Floor Plans
              </span>
              <span className="text-xs font-mono font-medium text-amber-400" style={{ color: themeConfig.primary }}>
                Select to Test
              </span>
            </div>

            {SAMPLE_FLOOR_PLANS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                className="group relative flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-700/60 flex items-center justify-center">
                  {sample.imageSrc.endsWith('.pdf') ? (
                    <div className="w-full h-full bg-[#0c1527] flex flex-col items-center justify-center p-1 text-center border-l-2 border-sky-400">
                      <div className="w-6 h-6 rounded bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[10px] mb-1 font-mono">
                        PDF
                      </div>
                      <span className="text-[9px] text-sky-200 font-medium">Blueprint</span>
                    </div>
                  ) : (
                    <img
                      src={sample.imageSrc}
                      alt={sample.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-1 right-1 text-[10px] font-mono font-medium text-white px-1 rounded bg-black/60">
                    {sample.facing}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:underline transition-colors truncate">
                      {sample.title}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-semibold border"
                      style={{
                        backgroundColor: themeConfig.primaryBg,
                        color: themeConfig.primary,
                        borderColor: themeConfig.primaryBorder,
                      }}
                    >
                      {sample.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {sample.tagline}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-amber-400" style={{ color: themeConfig.primary }}>
                    <span>Inspect Vastu Compliance</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}

            {/* Sacred Geometry feature badge */}
            <div
              className="p-3 rounded-lg border flex items-center gap-3 text-xs text-slate-300 shadow-xs"
              style={{
                backgroundColor: themeConfig.primaryBg,
                borderColor: themeConfig.primaryBorder,
              }}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: themeConfig.primaryBg }}
              >
                <Compass className="w-4 h-4" style={{ color: themeConfig.primary }} />
              </div>
              <p className="text-[12px] leading-snug">
                Detects cardinal orientations, Brahmasthan central core, Agni fire kitchens, Ishanya water energies, and Nairutya stability anchors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
