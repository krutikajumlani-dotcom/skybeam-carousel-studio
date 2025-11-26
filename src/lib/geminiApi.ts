import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI instance
const getGenAI = () => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error("Please configure your Gemini API Key in Settings.");
  return new GoogleGenAI({ apiKey });
};

export const callGeminiText = async (systemPrompt: string, userPrompt: string) => {
  const ai = getGenAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.7,
    }
  });
  
  // Parse the response text as JSON
  return JSON.parse(response.text);
};

export const callImagen = async (imagePrompt: string) => {
  const ai = getGenAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: imagePrompt,
    config: {
      imageConfig: {
        aspectRatio: "4:5"
      }
    }
  });
  
  // Extract the base64 image data from the response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      return `data:image/png;base64,${imageData}`;
    }
  }
  
  throw new Error("No image data received from API");
};
