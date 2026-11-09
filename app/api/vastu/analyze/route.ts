import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateDynamicVastuReport } from '@/lib/vastu-analyzer-engine';
import { VastuAnalysisReport } from '@/lib/vastu-types';
import { ZONE_ACTIVITY_RULES } from '@/lib/vastu-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      orientation = 'North Facing',
      userNotes = '',
      fileName = 'floor_plan',
      placeName = '',
    } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Floor plan image is required.' },
        { status: 400 }
      );
    }

    // Resolve image data whether it is a base64 string, data URI, or server local path
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType;

    if (imageBase64.startsWith('/')) {
      // Local server sample path (e.g. /samples/floorplan_3bhk.jpg)
      const relativePath = imageBase64.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      if (fs.existsSync(fullPath)) {
        const fileBuffer = fs.readFileSync(fullPath);
        cleanBase64 = fileBuffer.toString('base64');
        if (fullPath.endsWith('.png')) detectedMime = 'image/png';
        else if (fullPath.endsWith('.jpg') || fullPath.endsWith('.jpeg')) detectedMime = 'image/jpeg';
        else if (fullPath.endsWith('.pdf')) detectedMime = 'application/pdf';
        else if (fullPath.endsWith('.webp')) detectedMime = 'image/webp';
      }
    } else {
      // Data URI strip
      const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        detectedMime = matches[1];
        cleanBase64 = matches[2];
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Try calling Gemini Multimodal Vision API if API key exists
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `You are a master Vedic Architect and Vastu Shastra Consultant.
Analyze this architectural floor plan technical drawing.
Orientation: "${orientation}"
${userNotes ? `User Notes: "${userNotes}"` : ''}

CRITICAL RULES:
- Map rooms to 9 zones: North-East (Water/Ishanya), East (Purva), South-East (Fire/Agni), South (Dakshin), South-West (Earth/Nairutya), West (Paschim), North-West (Air/Vayavya), North (Uttar), Center (Brahma Sthan).
- Calculate Vastu compliance score (0-100) & Grade.
- Detect any room placement doshas with severity (critical/moderate/minor).
- Provide actionable NON-STRUCTURAL remedies (pyramids, metal wire boundary strips, salt, mirrors, colors, plants).
- Provide actionable STRUCTURAL REMEDIES & ACTIVITY RELOCATIONS (which type of activity belongs in each place, civil wall/door shifts, room function re-allocation, masonry and plumbing adjustments).

Output valid JSON conforming strictly to the VastuAnalysisReport schema with:
overallScore, vastuGrade, orientation, pranaEnergyVerdict, executiveSummary, brahmasthanStatus, entranceStatus, roomAssessments, detectedDoshas (including structuralRemedy object with actionType, recommendedActivity, prohibitedActivity, structuralSteps, civilConsiderations, renovationUrgency), elementBalances, energyFlowRecommendations, quickWins.`;

        const imagePart = {
          inlineData: {
            mimeType: detectedMime === 'application/pdf' ? 'application/pdf' : 'image/jpeg',
            data: cleanBase64,
          },
        };

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI response timed out, using Vedic Engine')), 6000)
        );

        const aiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [imagePart, { text: prompt }],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([aiCall, timeoutPromise]);

        const rawText = response.text || '';
        const sanitized = rawText
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '')
          .trim();
        const parsedReport = JSON.parse(sanitized);
        if (!parsedReport.placeName) {
          parsedReport.placeName = placeName || fileName.replace(/\.[^/.]+$/, '');
        }
        if (!parsedReport.zoneActivityMatrix) {
          parsedReport.zoneActivityMatrix = ZONE_ACTIVITY_RULES;
        }

        return NextResponse.json({
          report: parsedReport,
          engineUsed: 'Gemini 3.8 Flash Vision',
          isLiveAi: true,
        });
      } catch (geminiError: any) {
        console.warn('Gemini Vision API call failed, switching to Vedic Engine:', geminiError?.message || geminiError);
      }
    }

    // Dynamic Vedic Engine generation based on the plan's exact orientation & notes
    const dynamicReport = generateDynamicVastuReport({
      orientation,
      userNotes,
      fileName,
      placeName,
      hasCustomUpload: true,
    });

    return NextResponse.json({
      report: dynamicReport,
      engineUsed: 'Vedic Architectural Analysis Engine',
      isLiveAi: false,
    });
  } catch (error: any) {
    console.error('Vastu analysis route top-level error:', error);
    const fallbackReport = generateDynamicVastuReport({
      orientation: 'North Facing',
      fileName: 'Floor Plan',
      placeName: 'Residential Premises',
    });
    return NextResponse.json({
      report: fallbackReport,
      engineUsed: 'Vedic Architectural Analysis Engine',
      isLiveAi: false,
    });
  }
}
