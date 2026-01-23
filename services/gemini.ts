import { GoogleGenAI } from "@google/genai";
import { AIResponseSchema, AIResponse } from '../schemas/api-contract';

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
5. Use **bold** for key metrics and *italics* for emphasis. Use > blockquotes for case study results.
6. Analyze the conversation for qualification.
7. End every successful qualification (or significant progress) with this exact JSON format hidden from the user at the very end of the string:
   JSON_DATA: { "score": X, "bottleneck": "detected bottleneck", "ready_for_phase_1": boolean, "company": "detected company name" }
   Where X is an integer 0-10.
`;

export interface ChatResponse {
  text: string;
  data?: AIResponse;
}

export const generateStrategistResponse = async (
  history: { role: string; parts: { text: string }[] }[], 
  attempt = 1
): Promise<ChatResponse> => {
  try {
    // Correct initialization: Named parameter and process.env.API_KEY reference
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const formattedHistory = history.map(h => ({
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
    
    // Middleware: Extract and Validate JSON
    const jsonMatch = fullText.match(/JSON_DATA:\s*({.*})/s);
    let extractedData: AIResponse | undefined;
    let cleanText = fullText;

    if (jsonMatch && jsonMatch[1]) {
      try {
        const rawJson = JSON.parse(jsonMatch[1]);
        const result = AIResponseSchema.safeParse(rawJson);
        
        if (result.success) {
          extractedData = result.data;
          cleanText = fullText.replace(/JSON_DATA:\s*{.*}/s, '').trim();
        } else {
          console.warn("Strategist: Invalid JSON schema from AI", result.error);
          throw new Error("Invalid JSON Schema");
        }
      } catch (parseError) {
        if (attempt < 2) {
          console.log("Strategist: Malformed JSON, retrying generation...");
          const repairPrompt = "SYSTEM_ALERT: The previous response had malformed JSON_DATA. Please respond again to the user's last message, ensuring the JSON_DATA block at the end is valid JSON.";
          
          history.push({ role: 'user', parts: [{ text: repairPrompt }] });
          return generateStrategistResponse(history, attempt + 1);
        }
      }
    }

    return {
      text: cleanText,
      data: extractedData
    };

  } catch (error) {
    console.error("Strategist API Error:", error);
    throw error;
  }
};