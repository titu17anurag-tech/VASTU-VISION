'use client';

import React from 'react';
import { EnergyFlowRecommendation } from '@/lib/vastu-types';
import { Compass, Sparkles, CheckCircle2, TrendingUp, Heart, Shield, Award } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface EnergyFlowGuideProps {
  recommendations: EnergyFlowRecommendation[];
  quickWins: string[];
}

export function EnergyFlowGuide({ recommendations, quickWins }: EnergyFlowGuideProps) {
  const { themeConfig } = useTheme();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Wealth & Prosperity':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'Health & Vitality':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Peace & Harmony':
        return <Shield className="w-4 h-4 text-sky-500" />;
      case 'Career Growth':
      default:
        return <Award className="w-4 h-4" style={{ color: themeConfig.primary }} />;
    }
  };

  return (
    <div className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6 transition-colors duration-200">
      <div className="pb-4 border-b dark:border-slate-800 border-slate-200">
        <h2 className="text-lg sm:text-xl font-serif font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <span>Actionable Energy Flow (Prana) Improvement Guide</span>
        </h2>
        <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
          Step-by-step layout adjustments to cultivate prosperity, mental clarity, physical vitality, and familial harmony.
        </p>
      </div>

      {/* 4 Life Spheres Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/90 border-slate-200 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold dark:text-white text-slate-900">
                  {getCategoryIcon(rec.category)}
                  <span>{rec.category}</span>
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold border"
                  style={{
                    backgroundColor: themeConfig.primaryBg,
                    borderColor: themeConfig.primaryBorder,
                    color: themeConfig.primary,
                  }}
                >
                  {rec.priority} Priority
                </span>
              </div>
              <p className="text-xs dark:text-slate-300 text-slate-700 leading-relaxed pt-1">{rec.action}</p>
            </div>

            <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono border-t dark:border-slate-800/80 border-slate-200 pt-2 flex items-center justify-between">
              <span>Effort:</span>
              <span className="font-semibold" style={{ color: themeConfig.primary }}>{rec.effort}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Instant Quick Wins */}
      <div
        className="p-5 rounded-xl border space-y-3"
        style={{
          backgroundColor: themeConfig.primaryBg,
          borderColor: themeConfig.primaryBorder,
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: themeConfig.primary }}>
          <Sparkles className="w-4 h-4" />
          <span>Universal Vastu Energy Quick Wins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {quickWins.map((win, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-lg dark:bg-slate-900/80 bg-white border dark:border-slate-800 border-slate-200/90 text-xs dark:text-slate-300 text-slate-700 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{win}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
