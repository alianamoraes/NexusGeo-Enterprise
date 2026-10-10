import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Role, ViewKey, ManagedFile, AuditEntry, MapPoint } from '@/types';
import { initialFiles, auditEntries, generateMapPoints } from '@/data/mockData';
import { translate, type Locale } from '@/i18n';

export type Theme = 'dark' | 'light';

export interface LunaReport {
  id: string;
  timestamp: string;
  scaleName: string;
  pointCount: number;
  avgValue: number;
  minValue: number;
  maxValue: number;
  text: string;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  currentView: ViewKey;
  setCurrentView: (v: ViewKey) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  files: ManagedFile[];
  addFile: (f: ManagedFile) => void;
  deleteFile: (id: string) => void;
  auditLog: AuditEntry[];
  addAuditEntry: (e: AuditEntry) => void;
  mapPoints: MapPoint[];
  addMapPoints: (pts: MapPoint[]) => void;
  lunaReports: LunaReport[];
  addLunaReport: (r: LunaReport) => void;
  lunaOpen: boolean;
  setLunaOpen: (open: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('admin');
  const [currentView, setCurrentView] = useState<ViewKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [files, setFiles] = useState<ManagedFile[]>(initialFiles);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(auditEntries);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(() => generateMapPoints());
  const [lunaReports, setLunaReports] = useState<LunaReport[]>([]);
  const [lunaOpen, setLunaOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [locale, setLocale] = useState<Locale>('en');

  const toggleSidebar = useCallback(() => setSidebarCollapsed((p) => !p), []);
  const toggleTheme = useCallback(() => setTheme((p) => (p === 'dark' ? 'light' : 'dark')), []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const addFile = useCallback((f: ManagedFile) => {
    setFiles((prev) => [f, ...prev]);
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addAuditEntry = useCallback((e: AuditEntry) => {
    setAuditLog((prev) => [e, ...prev]);
  }, []);

  const addMapPoints = useCallback((pts: MapPoint[]) => {
    setMapPoints((prev) => [...prev, ...pts]);
  }, []);

  const addLunaReport = useCallback((r: LunaReport) => {
    setLunaReports((prev) => [r, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        role, setRole,
        currentView, setCurrentView,
        sidebarCollapsed, toggleSidebar,
        mobileSidebarOpen, setMobileSidebarOpen,
        files, addFile, deleteFile,
        auditLog, addAuditEntry,
        mapPoints, addMapPoints,
        lunaReports, addLunaReport,
        lunaOpen, setLunaOpen,
        theme, toggleTheme,
        locale, setLocale, t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
