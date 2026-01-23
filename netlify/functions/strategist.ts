import { GoogleGenAI } from "@google/genai";
import { AIResponseSchema } from "../../schemas/api-contract";

const STRATEGIST_SYSTEM_INSTRUCTION = `
You are the TEKGUYZ Strategist. You identify 'Manual Work Fatigue.'

Context Data:
- Case Study 1 (VeriClear): 90% faster QA processing for call centers / 8-week launch.
- Case Study 2 (Crispy Bacon): Turned 5 hours of meetings into 5-minute summaries / 100% private.
- Case Study 3 (Marketing Ops): 92% time saved on data entry / 4-week deployment.
- Phase 1 Definition: A 1-week "Intelligence" Strategy Sprint to map workflows and calculate ROI before building.

Instructions:
1. If a user mentions manual tasks, cite VeriClear (90% faster QA) or Marketing Ops (92% time saved).
2. If they mention meetings, cite Crispy Bacon (5h to 5m).
3. Your goal is to move them to a 'Phase 1 Intelligence Sprint' (1 week to find ROI).
4. Keep responses concise, professional, and high-energy.
5. End every successful qualification with this JSON format at the very end:
   JSON_DATA: { "score": X, "bottleneck": "detected bottleneck", "ready_for_phase_1": boolean, "company": "detected company name" }
`;

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Intelligence Link Offline: API_KEY not configured in environment." }) 
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
        temperature: 0.7,
      }
    });

    const fullText = response.text || "";
    const jsonMatch = fullText.match(/JSON_DATA:\s*({.*})/s);
    let extractedData;
    let cleanText = fullText;

    if (jsonMatch && jsonMatch[1]) {
      const rawJson = JSON.parse(jsonMatch[1]);
      const validation = AIResponseSchema.safeParse(rawJson);
      if (validation.success) {
        extractedData = validation.data;
        cleanText = fullText.replace(/JSON_DATA:\s*{.*}/s, '').trim();
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