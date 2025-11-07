
import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry, ReframeAndActionResponse, TagAndSummaryResponse, WeeklySummary } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not be available.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const systemInstruction = "You are a calm, aesthetic journaling companion for students. Use brief, kind, non-clinical language. Offer optional insights; never pressure. Avoid diagnoses. 1–3 sentences per response. Always add a soft, motivating vibe.";

export async function getTagsAndSummary(text: string): Promise<TagAndSummaryResponse> {
  const prompt = `Analyze the following journal entry. Provide a one-sentence gist and up to 5 concise tags (e.g., "exam stress", "friendship", "sleep debt").
  
  Entry: "${text}"`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      },
    },
  });

  const jsonResponse = JSON.parse(response.text);
  return jsonResponse as TagAndSummaryResponse;
}

export async function getReframeAndAction(text: string): Promise<ReframeAndActionResponse> {
  const prompt = `Read this journal entry. Provide a compassionate 1-2 sentence reframe of the thought or feeling, in a CBT-style but non-clinical tone. Then, suggest one tiny, concrete action the user can take in the next 5 minutes.

  Entry: "${text}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reframe: { type: Type.STRING },
          micro_action: { type: Type.STRING },
        },
      },
    },
  });

  const jsonResponse = JSON.parse(response.text);
  return jsonResponse as ReframeAndActionResponse;
}


export async function getWeeklySummary(entries: JournalEntry[]): Promise<WeeklySummary> {
    const entriesSummary = entries.map(e => ({
        date: e.timestamp_iso.split('T')[0],
        mood: `${e.mood_emoji} (${e.intensity}/10)`,
        text: e.free_text || 'No text.',
        tags: e.tags,
    }));
    
    const prompt = `Analyze these journal entries from the past week. Provide a summary including top tags, average mood (just a number), a couple of "wins" (positive moments), a couple of "watchouts" (patterns to be mindful of), and one gentle, actionable nudge for the week ahead.
    
    Entries:
    ${JSON.stringify(entriesSummary, null, 2)}`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              top_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              mood_average: { type: Type.NUMBER },
              wins: { type: Type.ARRAY, items: { type: Type.STRING } },
              watchouts: { type: Type.ARRAY, items: { type: Type.STRING } },
              gentle_nudge: { type: Type.STRING },
            },
          },
        },
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as WeeklySummary;
}
