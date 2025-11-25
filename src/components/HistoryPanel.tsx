import { GenerationMode, CarouselSlide } from '@/pages/Index';

interface ProjectData {
  id: string;
  prompt: string;
  mode: GenerationMode;
  slides?: CarouselSlide[];
  timestamp?: { seconds: number };
}

interface HistoryPanelProps {
  projects: ProjectData[];
  onLoadProject: (project: ProjectData) => void;
}

export const HistoryPanel = ({ projects, onLoadProject }: HistoryPanelProps) => {
  return (
    <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Project History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div 
            key={p.id} 
            onClick={() => onLoadProject(p)} 
            className="p-5 rounded-xl border border-border bg-card hover:border-primary cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs px-2 py-1 rounded bg-surface text-primary font-medium">
                {p.mode === 'image-to-carousel' ? 'Image Remix' : 'AI Generated'}
              </span>
              <span className="text-xs text-muted-foreground">
                {p.timestamp ? new Date(p.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
              </span>
            </div>
            <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {p.prompt}
            </h3>
            <p className="text-xs text-muted-foreground">
              {p.slides?.length || 0} Slides
            </p>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p>No projects yet. Start creating your first carousel!</p>
          </div>
        )}
      </div>
    </div>
  );
};
