import { GoogleGenAI } from "@google/genai";
import { AIResponseSchema } from "../../schemas/api-contract";

const STRATEGIST_SYSTEM_INSTRUCTION = `
You are the TEKGUYZ Strategist. You identify 'Manual Work Fatigue.'

PROTOCOL:
1. RESPONSE LENGTH: Keep responses extremely concise (maximum 2 sentences).
2. TONE: Professional, high-energy, executive.
3. GOAL: Qualify the lead for a 'Phase 1 Intelligence Sprint' (1-week ROI mapping).
4. CASE STUDIES (Use ONLY if relevant to user's friction):
   - VeriClear: 90% faster QA.
   - Crispy Bacon: 5h meetings to 5m summaries.
   - Marketing Ops: 92% time saved on data entry.

DATA CAPTURE:
- You MUST identify the COMPANY NAME and the PRIMARY BOTTLENECK before setting ready_for_phase_1: true.
- Ask exactly ONE specific follow-up question per turn to keep the momentum.

JSON OUTPUT:
Every response must end with this exact block if the conversation is progressing:
JSON_DATA: { "score": 0-10, "bottleneck": "string", "ready_for_phase_1": boolean, "company": "string" }
`;

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Intelligence Link Offline: API_KEY not configured." }) 
    };
  }

  try {
    const { history } = JSON.parse(event.body);
    const ai = new GoogleGenAI({ apiKey });
    
    const formattedHistory = history.map((h: any) => ({
      role: h.role === 'strategist' ? 'model' : h.role,
      parts: h.parts
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: formattedHistory,
      config: {
        systemInstruction: STRATEGIST_SYSTEM_INSTRUCTION,
        temperature: 0.6, // Lower temperature for more consistent JSON and conciseness
      }
    });

    const fullText = response.text || "";
    const jsonMatch = fullText.match(/JSON_DATA:\s*({.*})/s);
    let extractedData;
    let cleanText = fullText;

    if (jsonMatch && jsonMatch[1]) {
      try {
        const rawJson = JSON.parse(jsonMatch[1]);
        const validation = AIResponseSchema.safeParse(rawJson);
        if (validation.success) {
          extractedData = validation.data;
          cleanText = fullText.replace(/JSON_DATA:\s*{.*}/s, '').trim();
        }
      } catch (e) {
        console.error("JSON Parse Error", e);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text: cleanText, data: extractedData })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};