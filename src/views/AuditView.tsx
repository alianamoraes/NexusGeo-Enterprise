import { useState, useMemo } from 'react';
import {
  Shield,
  User,
  AlertTriangle,
  Info,
  Lock,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const severityConfig = {
  info: { icon: Info, color: 'text-zinc-400', bg: 'bg-white/5', labelKey: 'audit.severity.info' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', labelKey: 'audit.severity.warning' },
  critical: { icon: Lock, color: 'text-red-400', bg: 'bg-red-500/10', labelKey: 'audit.severity.critical' },
};

const pageSize = 8;

export default function AuditView() {
  const { auditLog, role, setRole, t } = useApp();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filterLabels: Record<string, string> = {
    all: t('audit.ledger.all'),
    info: t('audit.severity.info'),
    warning: t('audit.severity.warning'),
    critical: t('audit.severity.critical'),
  };

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      const matchesSearch =
        !search ||
        entry.action.toLowerCase().includes(search.toLowerCase()) ||
        entry.component.toLowerCase().includes(search.toLowerCase()) ||
        entry.ip.includes(search);
      const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [auditLog, search, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageData = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const stats = useMemo(() => {
    return {
      total: auditLog.length,
      critical: auditLog.filter((e) => e.severity === 'critical').length,
      warnings: auditLog.filter((e) => e.severity === 'warning').length,
      adminActions: auditLog.filter((e) => e.role === 'admin').length,
      operatorActions: auditLog.filter((e) => e.role === 'operator').length,
    };
  }, [auditLog]);

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Painel de Status de Autenticação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${role === 'admin' ? 'bg-accent-500/15' : 'bg-[var(--c-surface-hover)]'}`}>
              {role === 'admin' ? (
                <Shield className="w-6 h-6 text-accent-400" />
              ) : (
                <User className="w-6 h-6 text-secondary" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{t('audit.currentRole')}</p>
              <p className="text-xs text-muted capitalize">{role === 'admin' ? t('audit.administrator') : t('common.operator')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRole('admin')}
              className={`
                flex-1 btn !py-2 !text-xs
                ${role === 'admin' ? 'bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30' : 'bg-[var(--c-surface-hover)] text-muted hover:text-primary'}
              `}
            >
              <Shield className="w-3.5 h-3.5" />
              {t('common.admin')}
            </button>
            <button
              onClick={() => setRole('operator')}
              className={`
                flex-1 btn !py-2 !text-xs
                ${role === 'operator' ? 'bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30' : 'bg-[var(--c-surface-hover)] text-muted hover:text-primary'}
              `}
            >
              <User className="w-3.5 h-3.5" />
              {t('common.operator')}
            </button>
          </div>
        </div>

        <div className="card p-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{t('audit.securityPosture')}</p>
              <p className="text-xs text-muted">{t('audit.allSecured')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center py-2 rounded-lg bg-[var(--c-surface-hover)]">
              <p className="text-lg font-bold text-primary tabular-nums">{stats.critical}</p>
              <p className="text-[10px] text-muted">{t('audit.critical')}</p>
            </div>
            <div className="text-center py-2 rounded-lg bg-[var(--c-surface-hover)]">
              <p className="text-lg font-bold text-primary tabular-nums">{stats.warnings}</p>
              <p className="text-[10px] text-muted">{t('audit.warnings')}</p>
            </div>
          </div>
        </div>

        <div className="card p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--c-surface-hover)] flex items-center justify-center">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{t('audit.activitySplit')}</p>
              <p className="text-xs text-muted">{stats.total} {t('audit.totalEvents')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted w-12">{t('common.admin')}</span>
              <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full transition-all duration-500" style={{ width: `${(stats.adminActions / stats.total) * 100}%` }} />
              </div>
              <span className="text-xs text-primary tabular-nums w-6 text-right">{stats.adminActions}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted w-12">{t('common.operator')}</span>
              <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(stats.operatorActions / stats.total) * 100}%` }} />
              </div>
              <span className="text-xs text-primary tabular-nums w-6 text-right">{stats.operatorActions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela do Ledger de Auditoria */}
      <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '180ms' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <div>
            <h3 className="text-sm font-semibold text-primary">{t('audit.ledger.title')}</h3>
            <p className="text-xs text-muted mt-0.5">{filtered.length} {t('audit.ledger.entries')}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('audit.ledger.search')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="input !py-2 !pl-9 !pr-3 text-sm w-full sm:w-56"
              />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800 border" style={{ borderColor: 'var(--c-border)' }}>
              <Filter className="w-3.5 h-3.5 text-muted ml-1.5" />
              {['all', 'info', 'warning', 'critical'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => { setSeverityFilter(sev); setPage(0); }}
                  className={`
                    px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors
                    ${severityFilter === sev ? 'bg-[var(--c-surface-hover)] text-primary' : 'text-muted hover:text-primary'}
                  `}
                >
                  {filterLabels[sev]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[var(--c-surface-hover)]">
                <th className="table-header">{t('audit.table.timestamp')}</th>
                <th className="table-header">{t('audit.table.role')}</th>
                <th className="table-header">{t('audit.table.component')}</th>
                <th className="table-header">{t('audit.table.action')}</th>
                <th className="table-header">{t('audit.table.ip')}</th>
                <th className="table-header pr-5">{t('audit.table.severity')}</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((entry) => {
                const sev = severityConfig[entry.severity as keyof typeof severityConfig];
                const SevIcon = sev.icon;
                return (
                  <tr key={entry.id} className="table-row group">
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono text-secondary whitespace-nowrap">{entry.timestamp}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`
                        badge ${entry.role === 'admin' ? 'badge-accent' : 'badge-success'} !text-[10px] capitalize
                      `}>
                        {entry.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {entry.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-primary">{entry.component}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${sev.color.replace('text-', 'bg-')}`} />
                        <span className="text-xs text-primary font-medium">{entry.action}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono text-secondary">{entry.ip}</span>
                    </td>
                    <td className="py-3 px-4 pr-5">
                      <span className={`badge ${sev.bg} ${sev.color} !text-[10px]`}>
                        <SevIcon className="w-3 h-3" />
                        {t(sev.labelKey)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted">
                    {t('audit.noEntries')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--c-border)' }}>
          <p className="text-xs text-muted">
            {t('audit.page')} {currentPage + 1} {t('audit.of')} {totalPages} / {filtered.length} {t('audit.ledger.entries')}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="btn-ghost !px-2.5 !py-1.5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`
                  w-7 h-7 rounded-md text-xs font-medium transition-colors
                  ${currentPage === i ? 'bg-accent-500/20 text-accent-300' : 'text-muted hover:text-primary hover:bg-[var(--c-surface-hover)]'}
                `}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="btn-ghost !px-2.5 !py-1.5 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
