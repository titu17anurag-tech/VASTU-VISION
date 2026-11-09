'use client';

import React, { useState } from 'react';
import { VastuDosha, ZoneActivityPlacementRule } from '@/lib/vastu-types';
import { ZONE_ACTIVITY_RULES } from '@/lib/vastu-data';
import { useTheme } from '@/lib/theme-context';
import {
  AlertTriangle,
  Wrench,
  Shield,
  CheckCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Hammer,
  Home,
  Building2,
  XCircle,
  Check,
  Compass,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Eye,
  Filter,
} from 'lucide-react';

interface DoshaAndRemediesProps {
  doshas: VastuDosha[];
  placeName?: string;
  onViewCertificate?: () => void;
  onRemedyToggle?: (doshaId: string, stepIndex: number) => void;
}

type RemedyFilterMode = 'all' | 'structural' | 'non-structural' | 'activity-matrix';

export function DoshaAndRemedies({
  doshas,
  placeName,
  onViewCertificate,
}: DoshaAndRemediesProps) {
  const { themeConfig } = useTheme();
  const [filterMode, setFilterMode] = useState<RemedyFilterMode>('all');
  const [selectedZoneTab, setSelectedZoneTab] = useState<string>('NE');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalSteps = doshas.reduce((acc, d) => acc + d.actionableSteps.length, 0);
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 100;

  const activeZoneRule = ZONE_ACTIVITY_RULES.find((z) => z.zoneKey === selectedZoneTab) || ZONE_ACTIVITY_RULES[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6 text-slate-100">
      {/* Section Header & Interactive Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
              <span>Vastu Remediation & Structural Activity Placement</span>
            </h2>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border"
              style={{
                backgroundColor: themeConfig.primaryBg,
                color: themeConfig.primary,
                borderColor: themeConfig.primaryBorder,
              }}
            >
              Civil & Architectural Guide
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {placeName ? (
              <>
                Customized for <strong className="font-semibold underline text-amber-400" style={{ color: themeConfig.primary }}>{placeName}</strong> — includes non-structural elemental cures, structural civil alterations, and room-activity zoning rules.
              </>
            ) : (
              'Actionable non-destructive corrections and architectural activity zoning for residential layouts.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onViewCertificate && (
            <button
              type="button"
              onClick={onViewCertificate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Open Official Remediation Certificate"
            >
              <Shield className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>Remediation Certificate</span>
            </button>
          )}

          {totalSteps > 0 && (
            <div className="flex items-center gap-3 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <div className="text-right">
                <div
                  className="text-xs font-semibold tabular-nums text-amber-400"
                  style={{ color: themeConfig.primary }}
                >
                  {doneCount} / {totalSteps} Remedied
                </div>
                <div className="text-[10px] text-slate-400">Energy Optimization</div>
              </div>
              <div
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-bold"
                style={{
                  borderColor: themeConfig.primaryBorder,
                  color: themeConfig.primary,
                }}
              >
                {progressPercent}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PROMINENT CORE VASTU STRUCTURAL RULES BANNER (e.g. North East Place Pooja NOT Toilet) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-950 to-slate-950 border-2 border-amber-500/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/25 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Hammer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide">
                Core Structural Rules: Which Type of Activity to Place
              </h3>
              <p className="text-[11px] text-slate-300">
                Fundamental spatial placements to prevent chronic doshas before or during renovation.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30 self-start sm:self-auto">
            Vedic Spatial Law
          </span>
        </div>

        {/* 3 Key Flagship Directives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {/* North East */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>North-East (Ishanya)</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-400/90">Water</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
              <span>PLACE: Pooja / Mandir, Meditation</span>
            </div>
            <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400 stroke-[3]" />
              <span>NOT: Toilet, Kitchen or Heavy Storage</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5 leading-snug">
              Toilet here poisons crown chakra; Kitchen burns prosperity. Must remain light & sacred.
            </p>
          </div>

          {/* South East */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-orange-500/40 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>South-East (Agni)</span>
              </span>
              <span className="text-[9px] font-mono text-orange-400/90">Fire</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
              <span>PLACE: Kitchen, Cooktop, Electricals</span>
            </div>
            <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400 stroke-[3]" />
              <span>NOT: Water Sump, Toilet, Bedroom</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5 leading-snug">
              Cooking in fire zone fuels cash flow & health. Water here quenches metabolic fire.
            </p>
          </div>

          {/* South West */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-600/40 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-amber-500" />
                <span>South-West (Nairutya)</span>
              </span>
              <span className="text-[9px] font-mono text-amber-500/90">Earth</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
              <span>PLACE: Master Bedroom, Safe Vault</span>
            </div>
            <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400 stroke-[3]" />
              <span>NOT: Toilet, Sump, Cut Balcony, Pooja</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5 leading-snug">
              Heaviest & highest zone anchors provider authority. Toilet in SW drains life savings.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER TABS: All vs Structural vs Non-Structural vs Activity Matrix */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Remedies ({doshas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('structural')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'structural'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>Structural Changes & Activity Swaps</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('non-structural')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'non-structural'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Non-Structural (Zero Demolition)</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('activity-matrix')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'activity-matrix'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>9-Zone Activity Matrix (What to Place Where)</span>
        </button>
      </div>

      {/* VIEW 1: ZONE ACTIVITY PLACEMENT MATRIX */}
      {filterMode === 'activity-matrix' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
            {ZONE_ACTIVITY_RULES.map((rule) => {
              const isSelected = rule.zoneKey === selectedZoneTab;
              return (
                <button
                  key={rule.zoneKey}
                  type="button"
                  onClick={() => setSelectedZoneTab(rule.zoneKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{rule.zoneKey}</span>
                  <span className="hidden sm:inline text-[11px] font-normal opacity-85">({rule.direction})</span>
                </button>
              );
            })}
          </div>

          {/* Active Zone Detail Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                    {activeZoneRule.zoneName}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
                    {activeZoneRule.element}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>Presiding Deity: <strong className="text-slate-200">{activeZoneRule.rulingDeity}</strong></span>
                  <span>·</span>
                  <span>Cosmic Energy: <strong className="text-amber-300">{activeZoneRule.primaryEnergy}</strong></span>
                </div>
              </div>
            </div>

            {/* 2 Columns: What to Place vs What NOT to Place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auspicious Activities TO PLACE */}
              <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Which Type of Activity to PLACE Here</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400/90 uppercase font-bold">
                    Auspicious / Shubh
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeZoneRule.auspiciousActivities.map((act, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20 text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-emerald-300">
                        <span>{act.activity}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {act.auspiciousGrade.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prohibited Activities NOT TO PLACE */}
              <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wide">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Activities STRICTLY PROHIBITED (Do NOT Place)</span>
                  </div>
                  <span className="text-[9px] font-mono text-rose-400/90 uppercase font-bold">
                    Severe Dosha
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeZoneRule.prohibitedActivities.map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-500/20 text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-rose-300">
                        <span>{p.activity}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          {p.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {p.doshaConsequence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Structural Architectural Alteration if Already Misplaced */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Hammer className="w-3.5 h-3.5 text-amber-400" />
                <span>Structural Architectural Action to Fix Misplacement:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activeZoneRule.structuralCureIfMisplaced}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DOSHA CARDS WITH NON-STRUCTURAL & STRUCTURAL CHANGES */}
      {filterMode !== 'activity-matrix' && (
        <>
          {doshas.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No Major Spatial Doshas Detected</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your floor plan achieves harmonious Pancha Bhuta balance and adheres to classical Vedic activity placement.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {doshas.map((dosha) => {
                const isCritical = dosha.severity === 'critical';
                const isModerate = dosha.severity === 'moderate';

                return (
                  <div
                    key={dosha.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4 hover:border-slate-700 transition-colors"
                  >
                    {/* Dosha Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                              isCritical
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : isModerate
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {dosha.severity} Severity
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {dosha.title}
                          </h3>
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                          <span>Affected Zone: <strong className="text-amber-300">{dosha.zone}</strong></span>
                          <span>·</span>
                          <span>Element Friction: <strong className="text-slate-300">{dosha.elementImbalance}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Description & Impact */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {dosha.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-rose-300">Impact on Inhabitants: </span>
                      <span>{dosha.lifeImpact}</span>
                    </div>

                    {/* REMEDY OPTION 1: STRUCTURAL ARCHITECTURAL CHANGE & ACTIVITY RELOCATION */}
                    {(filterMode === 'all' || filterMode === 'structural') && dosha.structuralRemedy && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-2 border-amber-500/40 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                          <div className="flex items-center gap-2">
                            <Hammer className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                              Structural Change & Activity Placement (Renovations / Remodeling)
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold self-start sm:self-auto">
                            {dosha.structuralRemedy.renovationUrgency}
                          </span>
                        </div>

                        {/* Which Type of Activity to Place vs Prohibited */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                            <span className="font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Recommended Activity to PLACE Here:</span>
                            </span>
                            <p className="text-[11px] text-slate-200 font-medium">
                              {dosha.structuralRemedy.recommendedActivity}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 space-y-1">
                            <span className="font-bold text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Activity STRICTLY PROHIBITED Here:</span>
                            </span>
                            <p className="text-[11px] text-slate-200 font-medium">
                              {dosha.structuralRemedy.prohibitedActivity}
                            </p>
                          </div>
                        </div>

                        {/* Step by step structural alterations */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">
                            Civil & Architectural Alteration Steps:
                          </span>
                          <div className="space-y-1.5">
                            {dosha.structuralRemedy.structuralSteps.map((st, sidx) => (
                              <div
                                key={sidx}
                                className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
                              >
                                <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sidx + 1}
                                </span>
                                <span>{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Civil Engineering & Masonry Considerations */}
                        {dosha.structuralRemedy.civilConsiderations && (
                          <div className="text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                            <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-slate-300">Masonry & Plumbing Feasibility: </strong>
                              {dosha.structuralRemedy.civilConsiderations}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* REMEDY OPTION 2: NON-STRUCTURAL (ZERO DEMOLITION) CURE */}
                    {(filterMode === 'all' || filterMode === 'non-structural') && (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Non-Structural Remediation: {dosha.remedyTitle}</span>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            Zero Demolition (Renters & Existing Homes)
                          </span>
                        </div>

                        {/* Action Steps Checklist */}
                        <div className="space-y-2">
                          {dosha.actionableSteps.map((step, idx) => {
                            const key = `${dosha.id}-step-${idx}`;
                            const isDone = !!completedSteps[key];

                            return (
                              <div
                                key={idx}
                                onClick={() => toggleStep(key)}
                                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                  isDone
                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-950 border border-slate-800'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggleStep(key)}
                                  className="mt-0.5 accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer"
                                />
                                <span className={isDone ? 'line-through text-slate-400' : ''}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Required Materials */}
                        {dosha.remedyMaterials && dosha.remedyMaterials.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Required Items:</span>
                            {dosha.remedyMaterials.map((mat, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-amber-300/90 text-[10px]"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
