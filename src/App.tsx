import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LunaCopilot from '@/components/LunaCopilot';
import Footer from '@/components/Footer';
import DashboardView from '@/views/DashboardView';
import CRMView from '@/views/CRMView';
import GISView from '@/views/GISView';
import AuditView from '@/views/AuditView';
import SettingsView from '@/views/SettingsView';
import { ShieldAlert, Brain } from 'lucide-react';

function OperatorBanner() {
  const { role, t } = useApp();
  if (role !== 'operator') return null;
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs font-medium animate-slide-down">
      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{t('banner.operator')}</span>
    </div>
  );
}

function LunaToggleButton() {
  const { lunaOpen, setLunaOpen } = useApp();
  if (lunaOpen) return null;
  return (
    <button
      onClick={() => setLunaOpen(true)}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 text-white text-sm font-medium shadow-xl shadow-accent-500/30 hover:scale-105 active:scale-95 transition-all duration-200 animate-fade-in"
    >
      <Brain className="w-4 h-4" />
      Luna AI
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse-slow" />
    </button>
  );
}

function AppContent() {
  const { currentView, theme } = useApp();

  return (
    <div className={`${theme} flex min-h-screen bg-ink-950`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <OperatorBanner />
        <Header />
        <main className="flex-1 overflow-x-hidden">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'crm' && <CRMView />}
          {currentView === 'gis' && <GISView />}
          {currentView === 'audit' && <AuditView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
        <Footer />
      </div>
      <LunaToggleButton />
      <LunaCopilot />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
