'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Moon, Sun, Palette, Check, Layers, ShieldCheck, MessageSquare, FileText } from 'lucide-react';
import { useTheme, THEMES, ThemeColor } from '@/lib/theme-context';

interface NavbarProps {
  onAnalyzeClick: () => void;
  onSampleSelect: (sampleId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ onAnalyzeClick, activeTab, setActiveTab }: NavbarProps) {
  const { color, setColor, mode, toggleMode, themeConfig, themeDef } = useTheme();
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const navItems = [
    { id: 'analysis', label: 'Floor Plan Audit', icon: FileText },
    { id: 'zones', label: '9-Zone Mandala', icon: Compass },
    { id: 'remedies', label: 'Energy Remedies', icon: ShieldCheck },
    { id: 'consult', label: 'Ask Vastu AI', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#090d16]/95 border-b border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-xs"
              style={{ backgroundColor: themeConfig.primaryBg, borderColor: themeConfig.primaryBorder, borderWidth: 1 }}
            >
              <Compass className="w-4 h-4 stroke-[2.2]" style={{ color: themeConfig.primary }} />
            </div>
            <span
              className="font-serif tracking-normal text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"
            >
              VastuVision
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded tracking-wide font-mono uppercase font-semibold hidden sm:inline"
              style={{
                backgroundColor: themeConfig.primaryBg,
                color: themeConfig.primary,
                borderColor: themeConfig.primaryBorder,
                borderWidth: 1,
              }}
            >
              AI ARCHITECT
            </span>
          </a>

          {/* Zone 2: Navigation Links for Desktop (md & up) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-medium text-slate-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                    isActive ? 'font-bold border-b-2 text-amber-400 border-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? { color: themeConfig.primary, borderColor: themeConfig.primary }
                      : undefined
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Controls & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick 1-Click Theme Color Swatches for Desktop */}
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Palette:</span>
              {(Object.keys(THEMES) as ThemeColor[]).map((tKey) => {
                const t = THEMES[tKey];
                const isSelected = color === tKey;
                return (
                  <button
                    key={tKey}
                    onClick={() => setColor(tKey)}
                    title={`Theme: ${t.label} (${t.elementAssociation})`}
                    className={`w-4 h-4 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-white scale-125 shadow-sm' : 'hover:scale-115 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: t.previewColor }}
                  >
                    {isSelected && <span className="w-1 h-1 rounded-full bg-slate-950" />}
                  </button>
                );
              })}
            </div>

            {/* Theme Palette Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                title="Change Theme & Color Palette"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full ring-1 ring-black/20 shadow-xs"
                  style={{ backgroundColor: themeConfig.primary }}
                />
                <span className="hidden sm:inline text-[11px] font-semibold">{themeDef?.shortLabel || 'Theme'}</span>
                <Palette className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
                    <span>Select Architectural Theme</span>
                    <span className="font-mono text-[9px] lowercase opacity-75">{Object.keys(THEMES).length} styles</span>
                  </div>
                  {(Object.keys(THEMES) as ThemeColor[]).map((tKey) => {
                    const t = THEMES[tKey];
                    const isSelected = color === tKey;
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          setColor(tKey);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full shadow-xs shrink-0 ring-1 ring-black/15"
                            style={{ backgroundColor: t.previewColor }}
                          />
                          <div>
                            <div className="font-medium leading-tight">{t.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                              {t.elementAssociation}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {mode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onAnalyzeClick}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span className="hidden sm:inline">Upload Plan</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center gap-1 py-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                style={isActive ? { color: themeConfig.primary } : undefined}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
