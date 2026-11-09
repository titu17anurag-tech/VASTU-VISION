'use client';

import React, { useState } from 'react';
import { VASTU_ZONES_CONFIG } from '@/lib/vastu-data';
import { Compass, BookOpen, Sparkles, Shield, Flame, Droplets, Wind, Mountain, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export function VastuPurushaGuide() {
  const { themeConfig } = useTheme();
  const [activeZoneKey, setActiveZoneKey] = useState<string>('NE');
  const activeZone = VASTU_ZONES_CONFIG.find((z) => z.key === activeZoneKey) || VASTU_ZONES_CONFIG[0];

  return (
    <div className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xl space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b dark:border-slate-800 border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: themeConfig.primary }}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Classical Vedic Architecture Treatise</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold dark:text-white text-slate-900">
            Vastu Purusha Mandala: The 9 Cosmic Energy Fields
          </h2>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1 max-w-2xl">
            In Vastu science, every dwelling is a living energetic organism. The Vastu Purusha lies face down, with head at North-East (Ishanya) and feet anchored at South-West (Nairutya).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono dark:text-slate-400 text-slate-600 dark:bg-slate-950 bg-slate-100 px-3 py-1.5 rounded-lg border dark:border-slate-800 border-slate-200 self-start md:self-auto shadow-xs">
          <Compass className="w-4 h-4" style={{ color: themeConfig.primary }} />
          <span>Navagraha Spatial Grid</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 9-Zone Clickable Grid Selector */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider block">
            Select a Zone to Inspect Energetics
          </span>

          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-xs">
            {VASTU_ZONES_CONFIG.map((zone) => {
              const isSelected = zone.key === activeZoneKey;
              return (
                <button
                  key={zone.key}
                  type="button"
                  onClick={() => setActiveZoneKey(zone.key)}
                  className={`aspect-square p-2.5 rounded-xl flex flex-col justify-between text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'shadow-md ring-2 scale-102 dark:text-white text-slate-950'
                      : 'dark:bg-slate-900/60 bg-white dark:border-slate-800 border-slate-200 dark:text-slate-300 text-slate-700 hover:border-slate-400 dark:hover:bg-slate-900'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: themeConfig.primaryBg,
                          borderColor: themeConfig.primary,
                          boxShadow: `0 0 12px ${themeConfig.primaryBg}`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{zone.key}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20"
                      style={{ backgroundColor: zone.color }}
                    />
                  </div>
                  <div className="text-[10px] font-semibold leading-tight truncate">
                    {zone.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] dark:text-slate-400 text-slate-500 font-mono truncate">
                    {zone.element.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual Cosmic diagram */}
          <div className="relative rounded-xl overflow-hidden border dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-slate-100 aspect-video group shadow-sm">
            <img
              src="/samples/vastu_sacred_grid_1793727874230.jpg"
              alt="Vastu Purusha Mandala Diagram"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t dark:from-slate-950 from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 right-3 text-[11px] text-white font-medium flex items-center justify-between">
              <span>Classical 81-Pada Vastu Purusha Mandala</span>
              <span className="font-mono text-[10px]" style={{ color: themeConfig.primaryLight }}>
                Head at NE · Feet at SW
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active Zone In-Depth Architectural Treatise */}
        <div className="lg:col-span-7 p-6 rounded-2xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-5 shadow-xs">
          <div className="flex items-start justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full ring-1 ring-black/20 shadow-xs"
                  style={{ backgroundColor: activeZone.color }}
                />
                <h3 className="text-lg font-serif font-bold dark:text-white text-slate-900">
                  {activeZone.name}
                </h3>
              </div>
              <div className="text-xs mt-1 font-mono font-semibold" style={{ color: themeConfig.primary }}>
                Presiding Cosmic Force: {activeZone.deity}
              </div>
            </div>

            <div className="px-3 py-1 rounded-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs font-mono dark:text-slate-300 text-slate-700 shadow-xs">
              Element: <strong className="dark:text-white text-slate-900">{activeZone.element}</strong>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <span className="font-semibold block mb-1" style={{ color: themeConfig.primary }}>
                Energetic Property & Cosmic Influence:
              </span>
              <p className="dark:text-slate-300 text-slate-700 leading-relaxed">
                {activeZone.energyTrait}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1 text-xs uppercase tracking-wide">
                Architectural Recommendations (Shubh / Auspicious):
              </span>
              <p className="dark:text-slate-200 text-slate-700 text-xs leading-relaxed">
                {activeZone.idealFor}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
              <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1 text-xs uppercase tracking-wide">
                Architectural Taboos (Doshas / Elemental Clashes):
              </span>
              <p className="dark:text-slate-200 text-slate-700 text-xs leading-relaxed">
                {activeZone.taboo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
