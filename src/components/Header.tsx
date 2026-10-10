import { useState } from 'react';
import { Menu, Shield, User, Bell, Search, Sun, Moon, ChevronDown, ArrowLeft, Globe, CheckCheck, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { ViewKey, Role } from '@/types';
import type { Locale } from '@/i18n';
import AdminPasswordModal from '@/components/AdminPasswordModal';

export default function Header() {
  const { role, setRole, currentView, mobileSidebarOpen, setMobileSidebarOpen, setCurrentView, theme, toggleTheme, locale, setLocale, t, auditLog, addAuditEntry } = useApp();
  const [localeOpen, setLocaleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const titleKey = `header.${currentView}.title`;
  const subtitleKey = `header.${currentView}.subtitle`;

  const localeLabels: Record<Locale, string> = { en: 'EN', pt: 'PT-BR' };
  const localeFlags: Record<Locale, string> = { en: '🇺🇸', pt: '🇧🇷' };

  const handleRoleSwitch = (newRole: Role) => {
    if (newRole === 'admin' && role !== 'admin') {
      setShowAdminModal(true);
    } else {
      setRole(newRole);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'Header',
      action: theme === 'dark' ? 'Theme Switched to Light' : 'Theme Switched to Dark',
      ip: '10.0.4.12',
      severity: 'info',
    });
  };

  const handleLocaleChange = (l: Locale) => {
    setLocale(l);
    setLocaleOpen(false);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'Header',
      action: l === 'pt' ? 'Language Changed to PT-BR' : 'Language Changed to EN',
      ip: '10.0.4.12',
      severity: 'info',
    });
  };

  const recentNotifs = auditLog.slice(0, 3);

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b" style={{ borderColor: 'var(--c-border)' }}>
        <div className="flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 h-16">
          {/* Botão de menu mobile + título */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden btn-ghost !p-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {currentView !== 'dashboard' && (
              <button
                onClick={() => setCurrentView('dashboard' as ViewKey)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary transition-all hover:bg-[var(--c-surface-hover)] flex-shrink-0 animate-slide-in"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.backToDashboard')}</span>
              </button>
            )}

            <div className="min-w-0 hidden md:block">
              <h2 className="text-base sm:text-lg font-semibold text-primary truncate">{t(titleKey)}</h2>
              <p className="text-xs text-muted truncate">{t(subtitleKey)}</p>
            </div>
            <div className="min-w-0 md:hidden">
              <h2 className="text-sm font-semibold text-primary truncate">{t(titleKey)}</h2>
            </div>
          </div>

          {/* Seção direita */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Busca */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="input !py-2 !pl-9 !pr-4 w-40 xl:w-56 text-sm"
              />
            </div>

            {/* Alternar tema */}
            <button
              onClick={handleThemeToggle}
              className="btn-ghost !p-2 relative"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-[18px] h-[18px]" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* Seletor de idioma */}
            <div className="relative">
              <button
                onClick={() => { setLocaleOpen(!localeOpen); setNotifOpen(false); }}
                className="btn-ghost !p-2 flex items-center gap-1"
                title="Language"
              >
                <Globe className="w-[18px] h-[18px]" />
                <span className="text-xs font-medium hidden sm:inline">{localeLabels[locale]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${localeOpen ? 'rotate-180' : ''}`} />
              </button>
              {localeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLocaleOpen(false)} />
                  <div className="absolute right-0 mt-2 w-36 rounded-lg glass border shadow-xl z-50 animate-scale-in overflow-hidden">
                    {(['en', 'pt'] as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLocaleChange(l)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors
                          ${locale === l ? 'text-accent-400 bg-accent-500/10' : 'text-secondary hover:text-primary hover:bg-[var(--c-surface-hover)]'}
                        `}
                      >
                        <span className="text-base">{localeFlags[l]}</span>
                        {localeLabels[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setLocaleOpen(false); }}
                className="btn-ghost !p-2 relative"
                title={t('notif.title')}
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2" style={{ ['--tw-ring-color' as string]: 'var(--c-glass-bg)' }} />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl glass border shadow-2xl z-50 animate-scale-in overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border)' }}>
                      <p className="text-sm font-semibold text-primary">{t('notif.title')}</p>
                      <span className="badge-accent !text-[10px] !px-2 !py-0.5">{auditLog.length}</span>
                    </div>

                    {/* Itens */}
                    <div className="max-h-[280px] overflow-y-auto">
                      {recentNotifs.length === 0 ? (
                        <div className="py-8 text-center">
                          <Bell className="w-6 h-6 text-muted mx-auto mb-2" />
                          <p className="text-xs text-muted">{t('notif.empty')}</p>
                        </div>
                      ) : (
                        recentNotifs.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-start gap-3 px-4 py-3 border-b transition-colors hover:bg-[var(--c-surface-hover)]"
                            style={{ borderColor: 'var(--c-border)' }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              entry.severity === 'critical' ? 'bg-red-500/10' :
                              entry.severity === 'warning' ? 'bg-amber-500/10' :
                              'bg-accent-500/10'
                            }`}>
                              {entry.severity === 'critical' ? (
                                <Shield className="w-4 h-4 text-red-400" />
                              ) : entry.severity === 'warning' ? (
                                <AlertIcon className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Clock className="w-4 h-4 text-accent-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-primary truncate">{entry.action}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted">{entry.component}</span>
                                <span className="text-[10px] text-muted font-mono">{entry.timestamp.slice(11, 19)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Rodapé */}
                    <div className="px-4 py-2.5 border-t" style={{ borderColor: 'var(--c-border)' }}>
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors rounded-lg hover:bg-[var(--c-surface-hover)]"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        {t('notif.markAll')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Alternador de papel */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg border" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface-hover)' }}>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={`
                  flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                  ${role === 'admin' ? 'bg-accent-500/15 text-accent-300' : 'text-muted hover:text-primary'}
                `}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.admin')}</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('operator')}
                className={`
                  flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                  ${role === 'operator' ? 'bg-accent-500/15 text-accent-300' : 'text-muted hover:text-primary'}
                `}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.operator')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showAdminModal && <AdminPasswordModal onClose={() => setShowAdminModal(false)} />}
    </>
  );
}

function AlertIcon(props: { className?: string }) {
  return <Clock {...props} />;
}
