'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'gold' | 'emerald' | 'saffron' | 'cyan' | 'monochrome';
export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBg: string;
  primaryBorder: string;
  textAccent: string;
  glow: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  buttonGradient: string;
  secondaryHex: string;
}

export interface ThemeDefinition {
  name: ThemeColor;
  label: string;
  shortLabel: string;
  previewColor: string;
  secondaryHex: string;
  elementAssociation: string;
  config: ThemeColors;
}

export const THEMES: Record<ThemeColor, ThemeDefinition> = {
  gold: {
    name: 'gold',
    label: 'Vedic Gold (Classic)',
    shortLabel: 'Vedic Gold',
    previewColor: '#f59e0b',
    secondaryHex: '#fbbf24',
    elementAssociation: 'Solar Prana · Universal Harmony',
    config: {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      primaryLight: '#fcd34d',
      primaryBg: 'rgba(245, 158, 11, 0.12)',
      primaryBorder: 'rgba(245, 158, 11, 0.4)',
      textAccent: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      gradient: 'from-amber-400 via-amber-300 to-amber-200',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      secondaryHex: '#fbbf24',
    },
  },
  emerald: {
    name: 'emerald',
    label: 'Sacred Emerald',
    shortLabel: 'Emerald',
    previewColor: '#10b981',
    secondaryHex: '#34d399',
    elementAssociation: 'Vayu / Growth & Vitality',
    config: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#6ee7b7',
      primaryBg: 'rgba(16, 185, 129, 0.12)',
      primaryBorder: 'rgba(16, 185, 129, 0.4)',
      textAccent: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      gradient: 'from-emerald-400 via-teal-300 to-emerald-200',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      buttonGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      secondaryHex: '#34d399',
    },
  },
  saffron: {
    name: 'saffron',
    label: 'Agni Saffron',
    shortLabel: 'Saffron',
    previewColor: '#ea580c',
    secondaryHex: '#f97316',
    elementAssociation: 'Agni / Solar Vitality & Power',
    config: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      primaryLight: '#fdba74',
      primaryBg: 'rgba(234, 88, 12, 0.12)',
      primaryBorder: 'rgba(234, 88, 12, 0.4)',
      textAccent: 'text-orange-400',
      glow: 'shadow-orange-500/20',
      gradient: 'from-orange-400 via-amber-400 to-rose-300',
      badgeBg: 'bg-orange-500/10',
      badgeText: 'text-orange-400',
      buttonGradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
      secondaryHex: '#f97316',
    },
  },
  cyan: {
    name: 'cyan',
    label: 'Celestial Cyan',
    shortLabel: 'Cyan',
    previewColor: '#06b6d4',
    secondaryHex: '#38bdf8',
    elementAssociation: 'Ishanya / Divine Water & Calm',
    config: {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      primaryLight: '#67e8f9',
      primaryBg: 'rgba(6, 182, 212, 0.12)',
      primaryBorder: 'rgba(6, 182, 212, 0.4)',
      textAccent: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      gradient: 'from-cyan-400 via-sky-300 to-blue-200',
      badgeBg: 'bg-cyan-500/10',
      badgeText: 'text-cyan-400',
      buttonGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      secondaryHex: '#38bdf8',
    },
  },
  monochrome: {
    name: 'monochrome',
    label: 'Architect Slate',
    shortLabel: 'Slate',
    previewColor: '#94a3b8',
    secondaryHex: '#cbd5e1',
    elementAssociation: 'Earth / Grounded Neutrality',
    config: {
      primary: '#94a3b8',
      primaryHover: '#64748b',
      primaryLight: '#e2e8f0',
      primaryBg: 'rgba(148, 163, 184, 0.12)',
      primaryBorder: 'rgba(148, 163, 184, 0.4)',
      textAccent: 'text-slate-300',
      glow: 'shadow-slate-500/20',
      gradient: 'from-slate-200 via-slate-300 to-slate-100',
      badgeBg: 'bg-slate-500/10',
      badgeText: 'text-slate-300',
      buttonGradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      secondaryHex: '#cbd5e1',
    },
  },
};

interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  setColor: (c: ThemeColor) => void;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
  themeConfig: ThemeColors;
  themeDef: ThemeDefinition;
}

const ThemeContext = createContext<ThemeContextType>({
  color: 'gold',
  mode: 'dark',
  setColor: () => {},
  setMode: () => {},
  toggleMode: () => {},
  themeConfig: THEMES.gold.config,
  themeDef: THEMES.gold,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<ThemeColor>('gold');
  const [mode, setMode] = useState<ThemeMode>('dark');

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        color,
        mode,
        setColor,
        setMode,
        toggleMode,
        themeConfig: THEMES[color].config,
        themeDef: THEMES[color],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
