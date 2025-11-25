export const callGeminiText = async (systemPrompt: string, userPrompt: string) => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error("Please configure your Gemini API Key in Settings.");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API Failed: ${error}`);
  }
  
  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
};

export const callImagen = async (imagePrompt: string) => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error("Please configure your Gemini API Key in Settings.");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ 
          prompt: imagePrompt + ", high quality, 4k, professional photography"
        }],
        parameters: { 
          sampleCount: 1,
          aspectRatio: "4:5",
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Imagen API Failed: ${error}`);
  }
  
  const data = await response.json();
  return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
};
