'use client';

import React, { useState } from 'react';
import { VastuAnalysisReport } from '@/lib/vastu-types';
import { Bot, Send, User, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface VastuAiConsultantProps {
  report: VastuAnalysisReport;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

const QUICK_QUESTIONS = [
  'How do I correct a toilet in the North-East zone without demolition?',
  'Where should I place the master bed if my room is in the South-East?',
  'What colors enhance financial prosperity in the North zone?',
  'How to balance an obstructed Brahmasthan in an open-plan apartment?',
];

export function VastuAiConsultant({ report }: VastuAiConsultantProps) {
  const { themeConfig } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Namaste! I have analyzed the uploaded floor plan layout for "${report.overallScore}/100 Vastu Score". Feel free to ask about specific room directions, non-destructive copper/brass tape remedies, or interior element rebalancing.`,
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/vastu/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          contextReport: report,
        }),
      });

      const data = await res.json();
      const aiResponse = data.answer || 'Thank you for your question. Maintaining balanced elemental harmony is key.';

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (err) {
      console.error('Consultation error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'According to classical Vastu principles, placing a bronze or copper energy strip along the entrance threshold and keeping the North-East clean preserves positive Pranic circulation.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
            style={{
              backgroundColor: themeConfig.primaryBg,
              borderColor: themeConfig.primaryBorder,
              borderWidth: 1,
            }}
          >
            <Bot className="w-5 h-5" style={{ color: themeConfig.primary }} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
              <span>Ask AI Vastu Architect</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-mono border"
                style={{
                  backgroundColor: themeConfig.primaryBg,
                  color: themeConfig.primary,
                  borderColor: themeConfig.primaryBorder,
                }}
              >
                Context-Aware
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Get bespoke architectural guidance and non-destructive Vastu cures.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Frequently Inquired Remedies:
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-colors text-left cursor-pointer shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                style={{
                  backgroundColor: themeConfig.primaryBg,
                  borderColor: themeConfig.primaryBorder,
                  borderWidth: 1,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: themeConfig.primary }} />
              </div>
            )}
            <div
              className={`p-3 rounded-xl max-w-[85%] sm:max-w-[75%] shadow-xs ${
                m.sender === 'user'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200 font-medium rounded-tr-none'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" style={{ color: themeConfig.primary }} />
            <span>Consulting classical Vastu texts (Mayamata & Manasara)...</span>
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about your floor plan or specific room remedies..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="flex items-center justify-center p-2.5 rounded-xl text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4 text-slate-950" />
        </button>
      </form>
    </div>
  );
}
