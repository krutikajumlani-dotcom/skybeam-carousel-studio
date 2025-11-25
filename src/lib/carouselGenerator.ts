import { callGeminiText, callImagen } from './geminiApi';
import { CarouselSlide, GenerationMode } from '@/pages/Index';

export const generateCarousel = async (
  mode: GenerationMode,
  prompt: string,
  slideCount: number,
  uploadedImages: string[],
  onProgress?: (slides: CarouselSlide[]) => void
): Promise<CarouselSlide[]> => {
  if (!prompt) throw new Error("Please enter a prompt description.");

  let finalSlides: CarouselSlide[] = [];

  if (mode === 'image-to-carousel') {
    if (uploadedImages.length === 0) throw new Error("Please upload images first.");
    
    const systemPrompt = `You are a social media expert for Skybeam Studio, a cutting-edge tech brand.
Analyze the context: "${prompt}". 
Generate ${uploadedImages.length} engaging slide captions that are concise, impactful, and perfect for social media.
Each slide should have a catchy title (max 6 words) and a compelling caption (max 20 words).
Return JSON: { "slides": [{ "title": "...", "caption": "..." }] }`;
    
    const textData = await callGeminiText(
      systemPrompt, 
      `Generate social media captions for a ${uploadedImages.length}-slide carousel about: ${prompt}`
    );
    
    finalSlides = uploadedImages.map((img, idx) => ({
      image: img,
      title: textData.slides[idx]?.title || `Slide ${idx + 1}`,
      caption: textData.slides[idx]?.caption || ""
    }));

  } else {
    // Text to Carousel - Generate both images and text
    const systemPrompt = `You are a creative director for Skybeam Studio.
Create a ${slideCount}-slide Instagram/social media carousel plan based on: "${prompt}".
For each slide:
- Title: Catchy, max 6 words
- Caption: Compelling, max 20 words  
- Image Prompt: Detailed description for AI image generation. Style: "Neon green accents (#a3ff70), dark/black background, modern tech aesthetic, minimalist, high-end, professional photography, 4k quality"

Return JSON: { "slides": [{ "title": "...", "caption": "...", "imagePrompt": "..." }] }`;

    const structure = await callGeminiText(systemPrompt, prompt);
    
    // Generate images sequentially with progress updates
    for (const slide of structure.slides) {
      const imageUrl = await callImagen(
        slide.imagePrompt + ", neon green accents, dark background, tech aesthetic, professional photography, 4k"
      );
      
      const newSlide = {
        title: slide.title,
        caption: slide.caption,
        image: imageUrl
      };
      
      finalSlides.push(newSlide);
      
      if (onProgress) {
        onProgress([...finalSlides]);
      }
    }
  }

  return finalSlides;
};
