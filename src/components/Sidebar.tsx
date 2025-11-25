import { Plus, History, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: 'create' | 'history';
  onTabChange: (tab: 'create' | 'history') => void;
  onSettingsClick: () => void;
}

export const Sidebar = ({ activeTab, onTabChange, onSettingsClick }: SidebarProps) => {
  return (
    <aside className="w-20 md:w-64 border-r border-border flex flex-col justify-between bg-card">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-xl">S</span>
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-xl tracking-tight">Skybeam</span>
            <p className="text-xs text-muted-foreground">Studio</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => onTabChange('create')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'create' 
                ? 'bg-surface-hover text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-surface'
            }`}
          >
            <Plus size={20} />
            <span className="font-medium hidden md:block">New Project</span>
          </button>
          <button 
            onClick={() => onTabChange('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'history' 
                ? 'bg-surface-hover text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-surface'
            }`}
          >
            <History size={20} />
            <span className="font-medium hidden md:block">History</span>
          </button>
        </nav>
      </div>

      <div className="p-6 border-t border-border">
        <button 
          onClick={onSettingsClick}
          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors w-full px-4 py-3 rounded-xl hover:bg-surface"
        >
          <Settings size={18} />
          <span className="text-sm font-medium hidden md:block">Settings</span>
        </button>
      </div>
    </aside>
  );
};
