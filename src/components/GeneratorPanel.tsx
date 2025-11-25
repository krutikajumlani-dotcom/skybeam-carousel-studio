import { Sparkles, Upload } from 'lucide-react';
import { GenerationMode } from '@/pages/Index';

interface GeneratorPanelProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  slideCount: number;
  onSlideCountChange: (count: number) => void;
  uploadedImages: string[];
  onImagesUpload: (images: string[]) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const GeneratorPanel = ({
  mode,
  onModeChange,
  prompt,
  onPromptChange,
  slideCount,
  onSlideCountChange,
  uploadedImages,
  onImagesUpload,
  isGenerating,
  onGenerate,
}: GeneratorPanelProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      alert("Please upload max 10 images.");
      return;
    }

    Promise.all(files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(images => {
      onImagesUpload(images);
      onSlideCountChange(images.length);
    });
  };

  return (
    <div className="w-full md:w-[400px] border-r border-border p-6 overflow-y-auto bg-card">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Sparkles size={20} className="text-primary" />
        Generator
      </h2>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 bg-surface p-1 rounded-lg mb-6">
        <button 
          onClick={() => onModeChange('text-to-carousel')}
          className={`py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'text-to-carousel' 
              ? 'bg-surface-hover text-foreground shadow' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          AI Generate
        </button>
        <button 
          onClick={() => onModeChange('image-to-carousel')}
          className={`py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'image-to-carousel' 
              ? 'bg-surface-hover text-foreground shadow' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Image Remix
        </button>
      </div>

      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {mode === 'text-to-carousel' ? 'Describe Your Carousel' : 'Caption Context'}
          </label>
          <textarea 
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={
              mode === 'text-to-carousel' 
                ? "E.g., 5 tips for marketing automation with sleek tech visuals..." 
                : "Describe the theme for your uploaded images..."
            }
            className="w-full h-32 p-4 rounded-xl bg-surface border border-border focus:border-primary outline-none text-sm leading-relaxed resize-none transition-colors"
          />
        </div>

        {/* Mode Specific Controls */}
        {mode === 'text-to-carousel' ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Slide Count: {slideCount}
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={slideCount}
              onChange={(e) => onSlideCountChange(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" size={24} />
              <p className="text-xs text-muted-foreground">
                {uploadedImages.length > 0 
                  ? `${uploadedImages.length} images selected` 
                  : "Drop images or click to browse (max 10)"}
              </p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button 
          onClick={onGenerate}
          disabled={isGenerating || !prompt}
          className="w-full py-4 rounded-xl font-bold text-primary-foreground bg-primary text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Creating Magic...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Carousel
            </>
          )}
        </button>
      </div>
    </div>
  );
};
