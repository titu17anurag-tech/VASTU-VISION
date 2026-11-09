import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'VastuVision | AI Floor Plan & Home Energy Vastu Analyzer',
  description: 'Upload any architectural floor plan to instantly check Vastu Shastra compliance, 9-zone energy flow, element balances, doshas, and actionable non-structural remedies.',
  openGraph: {
    title: 'VastuVision | AI Floor Plan & Home Energy Vastu Analyzer',
    description: 'Upload any architectural floor plan to instantly check Vastu Shastra compliance, 9-zone energy flow, element balances, doshas, and actionable non-structural remedies.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VastuVision | AI Floor Plan & Home Energy Vastu Analyzer',
    description: 'Upload any architectural floor plan to instantly check Vastu Shastra compliance, 9-zone energy flow, element balances, doshas, and actionable non-structural remedies.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased font-sans selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
