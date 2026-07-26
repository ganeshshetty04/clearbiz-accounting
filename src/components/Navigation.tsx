import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Camera, 
  Bot, 
  FileText, 
  Settings 
} from 'lucide-react';

export type NavTab = 'dashboard' | 'expenses' | 'scan' | 'assistant' | 'reports' | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  easyMode?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  easyMode = false,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'expenses' as NavTab, label: 'Expenses', icon: Receipt },
    { id: 'scan' as NavTab, label: 'Scan Receipt', icon: Camera, highlight: true },
    { id: 'assistant' as NavTab, label: 'AI Helper', icon: Bot },
    { id: 'reports' as NavTab, label: 'Reports & Tax', icon: FileText },
    { id: 'settings' as NavTab, label: 'Vault & Sync', icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Top Nav Bar */}
      <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 py-2.5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all text-xs sm:text-sm whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : tab.highlight
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  <Icon className={`w-4 h-4 ${tab.highlight && !isActive ? 'text-blue-600' : ''}`} />
                  <span className={easyMode ? 'text-sm font-bold' : ''}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : tab.highlight ? 'bg-blue-50 text-blue-600' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
