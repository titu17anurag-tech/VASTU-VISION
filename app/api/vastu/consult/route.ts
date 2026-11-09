import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

function getVedicConsultationAnswer(question: string, contextReport?: any): string {
  const q = question.toLowerCase();

  if (q.includes('toilet') && (q.includes('north') || q.includes('ishanya') || q.includes('ne'))) {
    return `In classical Vastu Shastra, a toilet in the North-East (Ishanya) is considered a critical dosha because Ishanya is the sacred intake portal for divine Pranic energy and the water element (Jal).

Actionable Non-Destructive Remedies (Zero Demolition):
1. Elemental Rock Salt Absorption: Place a large glass or ceramic bowl filled with coarse, raw Himalayan rock salt inside the bathroom on an elevated shelf. Replace this salt every 15 days to absorb negative bioplasmic radiation.
2. Zinc & Brass Boundary Correction: Install a 10mm zinc or brass wire strip embedded into the bathroom doorway threshold to symbolically seal in draining energies.
3. Vastu Pyramids: Place 3 Vastu Energy Pyramids outside the bathroom door at eye level.
4. Color Modulation: Paint the interior bathroom walls in light off-white or soft cream. Avoid red, orange, or dark navy tiles.
5. Daily Habit: Always keep the toilet lid and bathroom door closed when not in use.`;
  }

  if (q.includes('safe') || q.includes('locker') || q.includes('cash') || q.includes('money') || q.includes('wealth')) {
    return `To activate Lord Kubera's financial abundance and asset preservation, follow these strict Vastu guidelines for cash lockers and treasuries:

1. Ideal Placement Quadrant: Place your main safe or cash locker in the South-West (Nairutya) or South quadrant of your master bedroom or office.
2. Auspicious Opening Direction: Position the safe against the South or West wall so that its door opens towards the North (governed by Kubera, the treasurer of the cosmos) or towards the East (Surya, vital expansion).
3. Height & Foundation: Never place the safe directly on bare flooring; elevate it slightly on a solid wooden platform or stone base.
4. Sacred Interior Activation: Line the interior shelf of the safe with a red or yellow silk cloth and place a silver coin or Gomti Chakra inside.
5. Taboo: Never place your safe in the North-East (causes uncontrollable spending) or under a heavy structural ceiling beam.`;
  }

  if (q.includes('color') || q.includes('paint') || q.includes('wall')) {
    return `Vastu Shastra balances the Pancha Bhuta (5 elements) through solar color frequencies corresponding to directional planetary rulers:

1. South-West Master Bedroom: Earthen tones, warm beige, camel, sand, soft almond, or light terracotta. (Earth element / Rahu - promotes grounded relationships and restful sleep). Avoid water colors like dark blue or green here.
2. North-East Room / Pooja: Pure white, pearl, light sky blue, or sea-mist cream. (Water element / Shiva - expands consciousness and peace).
3. South-East Kitchen: Light peach, soft coral, warm ivory, or pastel lemon yellow. (Fire element / Agni - stimulates digestive vigor and cash flow).
4. North Living Room: Off-white, soft pista green, or pale mint. (Mercury / Kubera - enhances intellectual clarity and commercial trade).
5. North-West Guest Room: Light silver-gray, cream, or soft lavender. (Air element / Moon - facilitates healthy social movement).`;
  }

  if (q.includes('mirror') || q.includes('glass') || q.includes('clock')) {
    return `Mirrors represent the Water element (Jal) and serve as cosmic energy multipliers in Vastu architecture:

1. Auspicious Placement: Always hang mirrors on the North or East interior walls. A mirror on the North reflects wealth currents; a mirror on the East reflects positive solar vitality.
2. Critical Bedroom Rule: NEVER place a mirror directly facing the bed where sleeping occupants are reflected. This causes sleep disruption and restless fatigue. If a wardrobe mirror faces the bed, cover it with a light curtain during the night.
3. Dining Area Mirror: Placing a mirror on the North or East wall reflecting the dining table symbolizes multiplying food abundance and familial prosperity.
4. Wall Clocks: Hang wall clocks on the North or East walls to ensure time flows forward smoothly with opportunities. Clocks should tick clockwise and never be kept stopped.`;
  }

  if (q.includes('kitchen') || q.includes('stove') || q.includes('cook') || q.includes('gas')) {
    return `The kitchen embodies Agni (sacred digestive fire), which governs physical vigor and financial liquidity:

1. Best Quadrant: The South-East (Agni Kon) is the supreme zone for cooking. The alternative acceptable quadrant is North-West (Vayavya).
2. Cooking Posture: The chef must always face East towards the morning rising sun while cooking meals. This infuses the food with pranic vitality.
3. Fire-Water Separation: Keep the cooking stove separated from the water sink by at least 2 to 3 feet. If they are adjacent, place a natural wooden cutting board or brass partition strip between them.
4. Storage: Store heavy grocery supplies and grains in the South or West cabinets of the kitchen. Keep the North-East corner of the kitchen completely light and clean.`;
  }

  if (q.includes('bed') || q.includes('sleep') || q.includes('head')) {
    return `Sleep orientation interacts directly with the Earth's electromagnetic grid:

1. Best Direction (South): Sleep with your head pointing toward the South. This aligns the human body's magnetic pole (North pole at human head) with Earth's magnetic South, creating harmonious blood circulation, reduced stress, and profound REM sleep.
2. Second Best (East): Sleeping with head toward the East enhances memory, meditative clarity, and academic focus (ideal for children and students).
3. Strictly Avoid (North): Never sleep with your head pointing toward the North. Two similar magnetic north poles repel each other, leading to restless sleep, morning migraines, and elevated blood pressure.
4. West: Neutral to acceptable, suitable for guests or adults seeking reflective solitude.`;
  }

  // General tailored consultation
  const orientationNote = contextReport?.orientation ? ` for your ${contextReport.orientation}` : '';
  return `In classical Vastu Shastra${orientationNote}, spatial harmony is achieved by aligning the 5 Pancha Bhuta elements with their cardinal coordinates:

1. North-East (Ishanya): Keep light, open, well-ventilated, and clean to welcome spiritual prana and wealth.
2. South-West (Nairutya): Keep heavy, stable, and elevated to anchor authority, health, and family longevity.
3. South-East (Agni): Dedicate to active fire, electricals, and cooking. Keep water storage away from this quadrant.
4. Center (Brahmasthan): Ensure the central core of the dwelling is open and uncluttered to allow cosmic ether to nourish all surrounding rooms.

For non-structural remedies, utilizing metallic threshold strips (copper, brass, zinc, lead), raw Himalayan rock salt, and directional color frequencies harmonizes modern apartments without breaking walls.`;
}

export async function POST(req: NextRequest) {
  try {
    const { question, contextReport } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

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

        const contextSnippet = contextReport
          ? `Current Floor Plan Context:
- Orientation: ${contextReport.orientation || 'Standard'}
- Vastu Score: ${contextReport.overallScore || 'N/A'}/100 (${contextReport.vastuGrade || ''})
- Detected Doshas: ${(contextReport.detectedDoshas || []).map((d: any) => `${d.title} in ${d.zone}`).join('; ')}
- Brahmasthan: ${contextReport.brahmasthanStatus?.verdict || 'Unobstructed'}
`
          : 'General Vastu Consultation.';

        const systemInstruction = `You are an elite Vedic Architect and master consultant in Vastu Shastra.
Answer the user's question clearly with authentic classical principles (Mayamata, Manasara) and practical, non-destructive modern architectural remedies. Format with bullet points for readability.`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI chat response timed out, using Vedic Knowledge Engine')), 5000)
        );

        const aiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${contextSnippet}\nUser Question: ${question}`,
          config: {
            systemInstruction,
          },
        });

        const response: any = await Promise.race([aiCall, timeoutPromise]);

        if (response.text) {
          return NextResponse.json({ answer: response.text });
        }
      } catch (err: any) {
        console.warn('Gemini chat failed, using Vedic consultation engine:', err?.message);
      }
    }

    // High-fidelity Vedic Knowledge Engine fallback
    const answer = getVedicConsultationAnswer(question, contextReport);
    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Vastu consultation error:', error);
    return NextResponse.json({
      answer:
        'To optimize home energy flow, maintain clear natural pathways from the North-East entrance to the South-West master bedroom, keep the central Brahmasthan open, and balance fire appliances in the South-East.',
    });
  }
}
