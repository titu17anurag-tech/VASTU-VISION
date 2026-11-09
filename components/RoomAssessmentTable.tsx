'use client';

import React, { useState } from 'react';
import { RoomAssessment } from '@/lib/vastu-types';
import { CheckCircle2, AlertTriangle, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface RoomAssessmentTableProps {
  rooms: RoomAssessment[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export function RoomAssessmentTable({
  rooms,
  activeRoomId,
  onSelectRoom,
}: RoomAssessmentTableProps) {
  const { themeConfig } = useTheme();
  const [filter, setFilter] = useState<'all' | 'compliant' | 'neutral' | 'defective'>('all');

  const compliantCount = rooms.filter((r) => r.status === 'compliant').length;
  const neutralCount = rooms.filter((r) => r.status === 'neutral').length;
  const defectiveCount = rooms.filter((r) => r.status === 'defective').length;

  const filteredRooms = rooms.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 text-slate-100">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
            <span>Room-by-Room Vastu Audit Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any room to inspect its quadrant on the spatial canvas above.
          </p>
        </div>

        {/* Filter Segmented Control Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-800 text-amber-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            style={filter === 'all' ? { color: themeConfig.primary } : undefined}
          >
            All ({rooms.length})
          </button>
          <button
            onClick={() => setFilter('compliant')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'compliant'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compliant ({compliantCount})
          </button>
          {neutralCount > 0 && (
            <button
              onClick={() => setFilter('neutral')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'neutral'
                  ? 'bg-slate-800 text-amber-400 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tolerable ({neutralCount})
            </button>
          )}
          <button
            onClick={() => setFilter('defective')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'defective'
                ? 'bg-slate-800 text-rose-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Doshas ({defectiveCount})
          </button>
        </div>
      </div>

      {/* Room cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRooms.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
            No rooms found matching the selected filter.
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isSelected = activeRoomId === room.id;
            const isCompliant = room.status === 'compliant';
            const isDefective = room.status === 'defective';

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-850 border-amber-500/80 ring-2 ring-amber-500/30 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-950/80 shadow-xs'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: themeConfig.primary,
                        boxShadow: `0 0 12px ${themeConfig.primaryBg}`,
                      }
                    : undefined
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{room.roomName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
                          isCompliant
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isDefective
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isCompliant ? 'Compliant' : isDefective ? 'Dosha Alert' : 'Tolerable'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span>Detected: <strong className="text-slate-200">{room.detectedZone}</strong></span>
                      <span className="mx-1.5">·</span>
                      <span>Ideal: <span className="text-emerald-400 font-medium">{room.idealZone}</span></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className="text-lg font-serif font-bold tabular-nums"
                      style={{ color: themeConfig.primary }}
                    >
                      {room.score}
                      <span className="text-[10px] text-slate-400 font-sans font-normal">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{room.element}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {room.findings}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Energy & Life Impact: </span>
                  <span>{room.energyImpact}</span>
                </div>

                {room.recommendedRemedy && (
                  <div
                    className="mt-2.5 p-2 rounded-lg border text-[11px]"
                    style={{
                      backgroundColor: themeConfig.primaryBg,
                      borderColor: themeConfig.primaryBorder,
                    }}
                  >
                    <span className="font-semibold" style={{ color: themeConfig.primary }}>
                      Recommended Remedy:{' '}
                    </span>
                    <span className="text-slate-200">{room.recommendedRemedy}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
