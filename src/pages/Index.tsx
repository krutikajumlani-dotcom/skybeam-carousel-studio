import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Sparkles, Settings, History, Plus } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { GeneratorPanel } from '@/components/GeneratorPanel';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { HistoryPanel } from '@/components/HistoryPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useCarouselProjects } from '@/hooks/useCarouselProjects';

export type GenerationMode = 'text-to-carousel' | 'image-to-carousel';

export interface CarouselSlide {
  image: string | null;
  title: string;
  caption: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [mode, setMode] = useState<GenerationMode>('text-to-carousel');
  const [showSettings, setShowSettings] = useState(false);
  
  // Generation state
  const [prompt, setPrompt] = useState('');
  const [slideCount, setSlideCount] = useState(4);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlides, setCurrentSlides] = useState<CarouselSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Firebase hooks
  const { user } = useFirebaseAuth();
  const { projects, saveProject } = useCarouselProjects(user);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentSlides([]);
    
    try {
      const { generateCarousel } = await import('@/lib/carouselGenerator');
      
      const slides = await generateCarousel(
        mode,
        prompt,
        slideCount,
        uploadedImages,
        (progressSlides) => {
          setCurrentSlides(progressSlides);
        }
      );

      setCurrentSlides(slides);
      
      if (user && slides.length > 0) {
        await saveProject(prompt, mode, slides);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Generation failed. Please check your API key in Settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Toaster />
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={() => setShowSettings(true)}
        />

        <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {activeTab === 'history' ? (
            <HistoryPanel 
              projects={projects}
              onLoadProject={(project) => {
                setPrompt(project.prompt);
                setMode(project.mode);
                setCurrentSlides(project.slides || []);
                setActiveTab('create');
              }}
            />
          ) : (
            <>
              <GeneratorPanel
                mode={mode}
                onModeChange={setMode}
                prompt={prompt}
                onPromptChange={setPrompt}
                slideCount={slideCount}
                onSlideCountChange={setSlideCount}
                uploadedImages={uploadedImages}
                onImagesUpload={setUploadedImages}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
              
              <PreviewCanvas
                slides={currentSlides}
                currentIndex={currentSlideIndex}
                onIndexChange={setCurrentSlideIndex}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
