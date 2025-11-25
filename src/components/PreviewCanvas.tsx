import { ChevronLeft, ChevronRight, Download, Layers, Image as ImageIcon } from 'lucide-react';
import { CarouselSlide } from '@/pages/Index';

interface PreviewCanvasProps {
  slides: CarouselSlide[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const PreviewCanvas = ({ slides, currentIndex, onIndexChange }: PreviewCanvasProps) => {
  const currentSlide = slides[currentIndex];

  return (
    <div className="flex-1 bg-deep-black relative flex flex-col">
      {/* Canvas Toolbar */}
      <div className="h-16 border-b border-border flex justify-between items-center px-6">
        <h3 className="font-semibold text-muted-foreground">Canvas Preview</h3>
        <div className="flex gap-2">
          <button 
            className="p-2 hover:bg-surface rounded-lg text-muted-foreground hover:text-primary transition-colors" 
            title="Download Slide"
            disabled={slides.length === 0}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-[radial-gradient(circle_at_center,_hsl(0_0%_5%)_0%,_hsl(0_0%_2%)_100%)]">
        {slides.length > 0 ? (
          <div className="relative w-full max-w-lg aspect-[4/5] bg-black rounded-3xl shadow-2xl border border-border overflow-hidden group">
            
            {/* Navigation Buttons */}
            <button 
              onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black p-2 rounded-full backdrop-blur text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => onIndexChange(Math.min(slides.length - 1, currentIndex + 1))}
              disabled={currentIndex === slides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black p-2 rounded-full backdrop-blur text-white disabled:opacity-0 transition-all"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute top-6 left-0 w-full flex justify-center gap-1 z-20">
              {slides.map((_, idx) => (
                <div 
                  key={idx}
                  onClick={() => onIndexChange(idx)}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/50 hover:bg-muted-foreground'
                  }`} 
                />
              ))}
            </div>

            {/* Slide Content */}
            <div className="relative w-full h-full">
              {currentSlide?.image ? (
                <img 
                  src={currentSlide.image} 
                  alt="Slide" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={48} className="opacity-20" />
                </div>
              )}

              {/* Text Overlay - Skybeam Style */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/90 to-transparent pt-32">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-surface text-primary">
                  Skybeam Studio
                </div>
                <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight text-white">
                  {currentSlide?.title || 'Slide Title'}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                  {currentSlide?.caption || 'Slide caption will appear here...'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-30 animate-fade-in">
            <Layers size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl font-medium">Ready to Create</p>
            <p className="text-sm text-muted-foreground mt-2">Enter a prompt or upload images to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};
