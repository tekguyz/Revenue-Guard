import { AIResponseSchema, AIResponse } from '../schemas/api-contract';

export interface ChatResponse {
  text: string;
  data?: AIResponse;
}

export const generateStrategistResponse = async (
  history: { role: string; parts: { text: string }[] }[]
): Promise<ChatResponse> => {
  try {
    const response = await fetch('/.netlify/functions/strategist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Strategist Link Failed');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Strategist Proxy Error:", error);
    throw error;
  }
};