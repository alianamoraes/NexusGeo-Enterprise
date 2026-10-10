import { TrendingUp, TrendingDown, Users, Server, DollarSign, Percent, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { kpis, funnelStages, histogramBins, kanbanColumns } from '@/data/mockData';
import Sparkline from '@/components/Sparkline';
import { useApp } from '@/context/AppContext';
import type { ViewKey } from '@/types';

const iconMap = [Percent, Users, Server, DollarSign];

const kpiLabelKeys = [
  'dash.kpi.conversion',
  'dash.kpi.clients',
  'dash.kpi.uptime',
  'dash.kpi.pipeline',
];

const kanbanTitleKeys = [
  'dash.kanban.ingestion',
  'dash.kanban.boundaries',
  'dash.kanban.contracts',
  'dash.kanban.syncs',
];

export default function DashboardView() {
  const { setCurrentView, t } = useApp();

  const maxFunnel = funnelStages[0].value;
  const funnelData = funnelStages.map((s) => ({
    ...s,
    pct: ((s.value / maxFunnel) * 100).toFixed(1),
    dropOff: s.value,
  }));

  const histogramData = histogramBins.map((b) => ({
    range: b.range,
    count: b.count,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Cartões de KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = iconMap[i] ?? Percent;
          const up = kpi.trend === 'up';
          return (
            <div
              key={kpi.label}
              className="card card-hover p-5 group animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--c-surface-hover)] flex items-center justify-center group-hover:bg-accent-500/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-secondary group-hover:text-accent-400 transition-colors" />
                </div>
                <div
                  className={`
                    flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md
                    ${up ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}
                  `}
                >
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </div>
              </div>
              <p className="text-xs text-muted mb-1 font-medium uppercase tracking-wider">{t(kpiLabelKeys[i])}</p>
              <p className="text-2xl font-bold text-primary mb-3 tabular-nums">{kpi.value}</p>
              <div className="flex items-end justify-between">
                <p className="text-[11px] text-muted">{t('dash.vsLastQuarter')}</p>
                <Sparkline data={kpi.sparkline} color={up ? '#34d399' : '#f87171'} width={100} height={32} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grade de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funil de Conversão */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-primary">{t('dash.funnel.title')}</h3>
              <p className="text-xs text-muted mt-0.5">{t('dash.funnel.subtitle')}</p>
            </div>
            <span className="badge-accent">{t('dash.funnel.live')}</span>
          </div>

          <div className="space-y-3">
            {funnelData.map((stage, i) => (
              <div key={stage.stage} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-primary">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary tabular-nums">{stage.value.toLocaleString()}</span>
                    <span className="text-[10px] text-muted tabular-nums">{stage.pct}%</span>
                  </div>
                </div>
                <div className="h-7 bg-ink-800 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md flex items-center justify-end pr-2 transition-all duration-700 ease-out group-hover:brightness-110"
                    style={{
                      width: `${stage.pct}%`,
                      background: `linear-gradient(90deg, ${stage.color}80, ${stage.color})`,
                      minWidth: '8px',
                    }}
                  >
                    <span className="text-[9px] text-white/70 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                      {stage.pct}%
                    </span>
                  </div>
                </div>
                {i < funnelData.length - 1 && (
                  <div className="flex items-center gap-1 pl-1 pt-1">
                    <ArrowRight className="w-2.5 h-2.5 text-muted" />
                    <span className="text-[9px] text-muted">
                      {(((funnelData[i + 1].value / stage.value) * 100).toFixed(1))}% {t('dash.funnel.passThrough')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Histograma de Distribuição */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-primary">{t('dash.histogram.title')}</h3>
              <p className="text-xs text-muted mt-0.5">{t('dash.histogram.subtitle')}</p>
            </div>
            <span className="badge-neutral">N = 297</span>
          </div>

          <div className="h-[260px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--c-chart-grid)" vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fill: 'var(--c-chart-text)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--c-chart-grid)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--c-chart-text)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    background: 'var(--c-chart-bg)',
                    border: '1px solid var(--c-chart-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--c-text)',
                  }}
                  labelStyle={{ color: 'var(--c-chart-text)' }}
                />
                <ReferenceLine y={50} stroke="#3b5af1" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {histogramData.map((_, i) => (
                    <Cell key={i} fill={`url(#histGrad${i})`} />
                  ))}
                </Bar>
                <defs>
                  {histogramData.map((_, i) => (
                    <linearGradient key={i} id={`histGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5b78f5" stopOpacity="1" />
                      <stop offset="100%" stopColor="#3b5af1" stopOpacity="0.4" />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tendência do gráfico de área */}
          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">{t('dash.histogram.cumulative')}</span>
              <span className="text-xs text-emerald-400 font-medium">+8.4% MoM</span>
            </div>
            <div className="h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={histogramData.map((b, i) => ({ idx: i, cum: b.count * (i + 1) }))}>
                  <defs>
                    <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b5af1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b5af1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="cum" stroke="#5b78f5" strokeWidth={2} fill="url(#cumGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Contador estilo Kanban */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '240ms' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-primary">{t('dash.kanban.title')}</h3>
            <p className="text-xs text-muted mt-0.5">{t('dash.kanban.subtitle')}</p>
          </div>
          <button
            onClick={() => setCurrentView('crm' as ViewKey)}
            className="text-xs text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1"
          >
            {t('dash.kanban.viewAll')} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col, i) => {
            const colorMap: Record<string, string> = {
              accent: 'border-accent-500/30 bg-accent-500/[0.06]',
              warning: 'border-amber-500/30 bg-amber-500/[0.06]',
              error: 'border-red-500/30 bg-red-500/[0.06]',
              success: 'border-emerald-500/30 bg-emerald-500/[0.06]',
            };
            const dotMap: Record<string, string> = {
              accent: 'bg-accent-500',
              warning: 'bg-amber-500',
              error: 'bg-red-500',
              success: 'bg-emerald-500',
            };
            return (
              <div
                key={col.title}
                className={`rounded-xl border p-4 ${colorMap[col.accent]} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${dotMap[col.accent]} animate-pulse-slow`} />
                  <span className="text-xs font-medium text-secondary">{t(kanbanTitleKeys[i])}</span>
                </div>
                <p className="text-3xl font-bold text-primary tabular-nums">{col.count}</p>
                <p className="text-[10px] text-muted mt-1">
                  {col.count > 10 ? t('dash.kanban.highVolume') : col.count > 3 ? t('dash.kanban.normal') : t('dash.kanban.lowVolume')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
