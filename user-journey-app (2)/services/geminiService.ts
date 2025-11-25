import { GoogleGenAI, Type } from "@google/genai";
import { Journey } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateJourney = async (topic: string): Promise<Journey> => {
  if (!apiKey) {
    console.warn("No API Key found, returning mock data error would be thrown in real app or handled gracefully.");
    throw new Error("API Key is missing. Please configure it.");
  }

  const prompt = `Create a detailed user journey map for the following scenario: "${topic}". 
  Break it down into 5-8 logical steps. 
  
  For each step, provide:
  1. A short title.
  2. A concise description (max 15 words).
  3. A detailed paragraph (approx 30-50 words) explaining the user's mindset, goals, and potential friction points during this step.
  4. A suggested icon name (from standard library like Lucide).
  5. The phase of the journey.
  6. 2-3 Key Performance Metrics (mock data) relevant to this step (e.g., Conversion Rate, Time on Page, Drop-off). Include a trend (up, down, neutral).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the journey" },
            description: { type: Type.STRING, description: "A brief summary of the journey goal" },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  details: { type: Type.STRING, description: "Extended explanation of the step" },
                  iconName: { type: Type.STRING },
                  phase: { type: Type.STRING },
                  metrics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING },
                        trend: { type: Type.STRING, enum: ["up", "down", "neutral"] }
                      },
                      required: ["label", "value", "trend"]
                    }
                  }
                },
                required: ["title", "description", "details", "iconName", "phase", "metrics"]
              }
            }
          },
          required: ["title", "description", "steps"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const data = JSON.parse(text);
    
    // Add IDs to steps
    const stepsWithIds = data.steps.map((step: any, index: number) => ({
      ...step,
      id: `step-${Date.now()}-${index}`
    }));

    return {
      id: `journey-${Date.now()}`,
      title: data.title,
      description: data.description,
      steps: stepsWithIds
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};