import { useState } from 'react';
import {
  Settings as SettingsIcon,
  DollarSign,
  Download,
  Save,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Zap,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  FileBarChart,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Toggle {
  key: string;
  labelKey: string;
  descKey: string;
  enabled: boolean;
}

const initialToggles: Toggle[] = [
  { key: 'autoBackup', labelKey: 'settings.toggle.autoBackup', descKey: 'settings.toggle.autoBackupDesc', enabled: true },
  { key: 'realtimeSync', labelKey: 'settings.toggle.realtimeSync', descKey: 'settings.toggle.realtimeSyncDesc', enabled: true },
  { key: 'emailAlerts', labelKey: 'settings.toggle.emailAlerts', descKey: 'settings.toggle.emailAlertsDesc', enabled: false },
  { key: 'twoFactor', labelKey: 'settings.toggle.twoFactor', descKey: 'settings.toggle.twoFactorDesc', enabled: true },
  { key: 'dataRetention', labelKey: 'settings.toggle.dataRetention', descKey: 'settings.toggle.dataRetentionDesc', enabled: true },
  { key: 'apiRateLimit', labelKey: 'settings.toggle.apiRateLimit', descKey: 'settings.toggle.apiRateLimitDesc', enabled: false },
];

const billingPlanData = [
  { nameKey: 'settings.plans.starter', clients: '1-25', price: 'R$ 2,400/mo', featureKey: 'settings.plans.starter.features', current: false },
  { nameKey: 'settings.plans.professional', clients: '26-100', price: 'R$ 8,900/mo', featureKey: 'settings.plans.professional.features', current: true },
  { nameKey: 'settings.plans.enterprise', clients: '100+', price: 'Custom', featureKey: 'settings.plans.enterprise.features', current: false },
];

export default function SettingsView() {
  const { role, files, addAuditEntry, t, locale } = useApp();
  const [toggles, setToggles] = useState<Toggle[]>(initialToggles);
  const [backupFreq, setBackupFreq] = useState('daily');
  const [ratePerClient, setRatePerClient] = useState(89);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [backupDownloaded, setBackupDownloaded] = useState(false);

  const freqLabels: Record<string, string> = {
    daily: t('settings.backup.daily'),
    weekly: t('settings.backup.weekly'),
    monthly: t('settings.backup.monthly'),
  };

  const toggleItem = (key: string) => {
    setToggles((prev) =>
      prev.map((t2) => (t2.key === key ? { ...t2, enabled: !t2.enabled } : t2))
    );
  };

  const handleSaveSettings = () => {
    setSavedIndicator(true);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'Settings',
      action: 'Configuration Parameters Updated',
      ip: '10.0.4.12',
      severity: 'warning',
    });
    setTimeout(() => setSavedIndicator(false), 2500);
  };

  const handleBackupDownload = () => {
    const state = {
      timestamp: new Date().toISOString(),
      version: '2.4.1',
      role,
      files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      toggles: toggles.reduce((acc, tg) => ({ ...acc, [tg.key]: tg.enabled }), {}),
      billing: { ratePerClient, backupFreq },
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusgeo_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setBackupDownloaded(true);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'Settings',
      action: 'Backup State Downloaded',
      ip: '10.0.4.12',
      severity: 'info',
    });
    setTimeout(() => setBackupDownloaded(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-[1400px] mx-auto relative">
      {/* Overlay de bloqueio para Operador */}
      {role === 'operator' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl pointer-events-auto">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-xl rounded-xl" />
          <div className="relative text-center px-8 py-10 animate-scale-in z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('settings.lock.title')}</h3>
            <p className="text-sm text-secondary max-w-sm mx-auto leading-relaxed">
              {t('settings.lock.message')}
            </p>
            <p className="text-xs text-muted mt-4">
              {locale === 'pt'
                ? `Mude para o modo ${t('common.admin')} no cabeçalho para acessar este módulo.`
                : `Switch to ${t('common.admin')} mode from the header to access this module.`}
            </p>
          </div>
        </div>
      )}

      {/* Toggles de configuração */}
      <div className="card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-5">
          <SettingsIcon className="w-4 h-4 text-accent-400" />
          <h3 className="text-sm font-semibold text-primary">{t('settings.config.title')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {toggles.map((toggle) => (
            <div
              key={toggle.key}
              className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[var(--c-surface-hover)] border transition-colors hover:bg-[var(--c-surface-hover)]"
              style={{ borderColor: 'var(--c-border)' }}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary">{t(toggle.labelKey)}</p>
                <p className="text-xs text-muted mt-0.5">{t(toggle.descKey)}</p>
              </div>
              <button
                onClick={() => toggleItem(toggle.key)}
                className="flex-shrink-0 transition-transform active:scale-90"
              >
                {toggle.enabled ? (
                  <ToggleRight className="w-8 h-8 text-accent-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-muted" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agendamento de backup + Receita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agendamento de Backup */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-4 h-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-primary">{t('settings.backup.title')}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-2 block">{t('settings.backup.frequency')}</label>
              <div className="grid grid-cols-3 gap-2">
                {['daily', 'weekly', 'monthly'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setBackupFreq(freq)}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${backupFreq === freq ? 'bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30' : 'bg-[var(--c-surface-hover)] text-muted hover:text-primary'}
                    `}
                  >
                    {freqLabels[freq]}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--c-surface-hover)] border" style={{ borderColor: 'var(--c-border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium text-primary">{t('settings.backup.next')}</span>
              </div>
              <p className="text-sm text-primary font-mono">
                {backupFreq === 'daily' ? '2026-10-10 02:00 UTC' : backupFreq === 'weekly' ? '2026-10-13 02:00 UTC' : '2026-11-01 02:00 UTC'}
              </p>
            </div>

            <button
              onClick={handleBackupDownload}
              className="btn-primary w-full"
            >
              {backupDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t('settings.backup.downloaded')}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {t('settings.backup.download')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Receita / Variáveis de Faturamento */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-primary">{t('settings.billing.title')}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted">{t('settings.billing.rate')}</label>
                <span className="text-sm font-mono font-bold text-primary">R$ {ratePerClient}</span>
              </div>
              <input
                type="range"
                min={40}
                max={200}
                value={ratePerClient}
                onChange={(e) => setRatePerClient(Number(e.target.value))}
                className="w-full accent-accent-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted">R$ 40</span>
                <span className="text-[10px] text-muted">R$ 200</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center py-3 rounded-lg bg-[var(--c-surface-hover)]">
                <p className="text-lg font-bold text-primary tabular-nums">247</p>
                <p className="text-[10px] text-muted">{t('settings.billing.activeClients')}</p>
              </div>
              <div className="text-center py-3 rounded-lg bg-[var(--c-surface-hover)]">
                <p className="text-lg font-bold text-emerald-400 tabular-nums">R$ {(247 * ratePerClient).toLocaleString()}</p>
                <p className="text-[10px] text-muted">{t('settings.billing.mrr')}</p>
              </div>
              <div className="text-center py-3 rounded-lg bg-[var(--c-surface-hover)]">
                <p className="text-lg font-bold text-accent-400 tabular-nums">94%</p>
                <p className="text-[10px] text-muted">{t('settings.billing.retention')}</p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="btn-outline w-full"
            >
              {savedIndicator ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t('settings.billing.saved')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('settings.billing.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Planos de Assinatura */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '180ms' }}>
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-4 h-4 text-accent-400" />
          <h3 className="text-sm font-semibold text-primary">{t('settings.plans.title')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {billingPlanData.map((plan) => (
            <div
              key={plan.nameKey}
              className={`
                p-5 rounded-xl border transition-all duration-300
                ${plan.current ? 'border-accent-500/40 bg-accent-500/[0.04] ring-1 ring-accent-500/20' : 'bg-[var(--c-surface-hover)] hover:border-[var(--c-border-strong)]'}
              `}
              style={{ borderColor: plan.current ? undefined : 'var(--c-border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-primary">{t(plan.nameKey)}</h4>
                {plan.current && <span className="badge-accent !text-[10px]">{t('settings.plans.current')}</span>}
              </div>
              <p className="text-2xl font-bold text-primary mb-1">{plan.price}</p>
              <p className="text-xs text-muted mb-4">{plan.clients} {t('settings.plans.clients')}</p>
              <ul className="space-y-2">
                {t(plan.featureKey).split(';').map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.current}
                className={`mt-4 w-full btn !py-2 !text-xs ${plan.current ? 'bg-[var(--c-surface-hover)] text-muted cursor-default' : 'btn-outline'}`}
              >
                {plan.current ? t('settings.plans.active') : t('settings.plans.switch')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo do gráfico de receita */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '240ms' }}>
        <div className="flex items-center gap-2 mb-5">
          <FileBarChart className="w-4 h-4 text-accent-400" />
          <h3 className="text-sm font-semibold text-primary">{t('settings.revenue.title')}</h3>
          <span className="badge-success ml-auto">
            <TrendingUp className="w-3 h-3" />
            +8.4% QoQ
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { labelKey: 'settings.revenue.q1', value: 'R$ 198K', change: '+5.2%' },
            { labelKey: 'settings.revenue.q2', value: 'R$ 214K', change: '+8.1%' },
            { labelKey: 'settings.revenue.q3', value: 'R$ 232K', change: '+8.4%' },
            { labelKey: 'settings.revenue.q4', value: 'R$ 252K', change: '+8.6%' },
          ].map((q) => (
            <div key={q.labelKey} className="p-4 rounded-lg bg-[var(--c-surface-hover)] border" style={{ borderColor: 'var(--c-border)' }}>
              <p className="text-[10px] text-muted uppercase tracking-wider">{t(q.labelKey)}</p>
              <p className="text-xl font-bold text-primary mt-1 tabular-nums">{q.value}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {q.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
