import { LayoutDashboard, Users, Map, ScrollText, Settings, ChevronsLeft } from 'lucide-react';
import type { ViewKey } from '@/types';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen, t } = useApp();

  const navItems: { key: ViewKey; labelKey: string; icon: typeof LayoutDashboard; descKey: string }[] = [
    { key: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, descKey: 'nav.dashboardDesc' },
    { key: 'crm', labelKey: 'nav.crm', icon: Users, descKey: 'nav.crmDesc' },
    { key: 'gis', labelKey: 'nav.gis', icon: Map, descKey: 'nav.gisDesc' },
    { key: 'audit', labelKey: 'nav.audit', icon: ScrollText, descKey: 'nav.auditDesc' },
    { key: 'settings', labelKey: 'nav.settings', icon: Settings, descKey: 'nav.settingsDesc' },
  ];

  const handleNavigate = (key: ViewKey) => {
    setCurrentView(key);
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-ink-900 border-r flex flex-col transition-all duration-300 ease-out
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ borderColor: 'var(--c-border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b flex-shrink-0" style={{ borderColor: 'var(--c-border)' }}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12L12 3L21 12L12 21Z" strokeLinejoin="round" />
              <path d="M3 12L12 7L21 12" strokeLinejoin="round" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div className="animate-slide-in overflow-hidden">
              <h1 className="text-sm font-semibold text-primary whitespace-nowrap">NexusGeo</h1>
              <p className="text-[10px] text-muted whitespace-nowrap tracking-wider uppercase">Enterprise</p>
            </div>
          )}
        </div>

        {/* Itens de navegação */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!sidebarCollapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold text-muted uppercase tracking-widest">{t('nav.modules')}</p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`
                  sidebar-item w-full
                  ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}
                  ${sidebarCollapsed ? 'lg:justify-center' : ''}
                `}
                title={sidebarCollapsed ? t(item.labelKey) : undefined}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent-500" />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-accent-400' : ''}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left animate-slide-in overflow-hidden">
                    <p className="text-sm leading-tight whitespace-nowrap">{t(item.labelKey)}</p>
                    <p className="text-[10px] text-muted leading-tight whitespace-nowrap">{t(item.descKey)}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle de recolher - apenas desktop */}
        <div className="hidden lg:block border-t p-3 flex-shrink-0" style={{ borderColor: 'var(--c-border)' }}>
          <button
            onClick={toggleSidebar}
            className="sidebar-item sidebar-item-inactive w-full"
            title={sidebarCollapsed ? 'Expand' : t('nav.collapse')}
          >
            <ChevronsLeft className={`w-[18px] h-[18px] transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span className="text-sm">{t('nav.collapse')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
