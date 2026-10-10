import { useState } from 'react';
import {
  Map as MapIcon,
  Layers,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Eye,
  SlidersHorizontal,
  Brain,
  Loader2,
} from 'lucide-react';
import { mapPolygon, colorScales } from '@/data/mockData';
import { useApp, type LunaReport } from '@/context/AppContext';
import { scaleInsights, type Locale } from '@/i18n';

function interpolateColor(stops: string[], value: number): string {
  const t = Math.max(0, Math.min(1, value));
  const idx = t * (stops.length - 1);
  const i = Math.floor(idx);
  const frac = idx - i;
  if (i >= stops.length - 1) return stops[stops.length - 1];

  const c1 = hexToRgb(stops[i]);
  const c2 = hexToRgb(stops[i + 1]);
  if (!c1 || !c2) return stops[i];

  const r = Math.round(c1.r + (c2.r - c1.r) * frac);
  const g = Math.round(c1.g + (c2.g - c1.g) * frac);
  const b = Math.round(c1.b + (c2.b - c1.b) * frac);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}

export default function GISView() {
  const { addAuditEntry, role, mapPoints, addLunaReport, setLunaOpen, t, locale } = useApp();
  const [scaleIndex, setScaleIndex] = useState(0);
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(100);
  const [pointSize, setPointSize] = useState(6);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const scale = colorScales[scaleIndex];

  const colorForValue = (value: number) => {
    const range = maxVal - minVal || 1;
    const norm = (value - minVal) / range;
    return interpolateColor(scale.stops, norm);
  };

  const handleScaleChange = (idx: number) => {
    setScaleIndex(idx);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'GIS Engine',
      action: 'Color Scale Modified',
      ip: '10.0.4.12',
      severity: 'info',
    });
  };

  const handleAiDiagnostic = () => {
    setAiLoading(true);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'GIS Engine',
      action: 'AI Soil Diagnostics Initiated',
      ip: '10.0.4.12',
      severity: 'info',
    });

    setTimeout(() => {
      const values = mapPoints.map((p) => p.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const minV = Math.min(...values);
      const maxV = Math.max(...values);
      const now = new Date();
      const insight = scaleInsights[locale][scale.name] ?? 'no anomalies detected within current scale parameters.';

      const reportText = `${t('luna.report.template')}
════════════════════════
${t('luna.report.scalePreset')}  ${scale.name}
${t('luna.report.nodesAnalyzed')} ${mapPoints.length}
${t('luna.report.valueRange')}   ${minV.toFixed(2)} – ${maxV.toFixed(2)}
${t('luna.report.meanValue')}    ${avg.toFixed(2)}
${t('luna.report.stdDev')}       ${Math.sqrt(values.reduce((s, v) => s + (v - avg) ** 2, 0) / values.length).toFixed(2)}

${t('luna.report.analysis')}
${insight}

${t('luna.report.recommendations')}
${t('luna.report.rec1')}
${t('luna.report.rec2')}
${t('luna.report.rec3')}

${t('luna.report.generated')}`;

      const report: LunaReport = {
        id: `luna-${Date.now()}`,
        timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
        scaleName: scale.name,
        pointCount: mapPoints.length,
        avgValue: avg,
        minValue: minV,
        maxValue: maxV,
        text: reportText,
      };

      addLunaReport(report);
      setLunaOpen(true);
      setAiLoading(false);
      addAuditEntry({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        role,
        component: 'GIS Engine',
        action: 'AI Soil Diagnostics Report Generated',
        ip: '10.0.4.12',
        severity: 'info',
      });
    }, 3000);
  };

  const polyPointsStr = mapPolygon.map((p) => `${p.x * 100},${p.y * 100}`).join(' ');

  return (
    <div className="p-4 sm:p-6 animate-fade-in max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Workspace do Mapa */}
        <div className="card overflow-hidden animate-slide-up">
          {/* Barra de ferramentas do mapa */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-primary">{t('gis.workspace')}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Botão de Diagnóstico IA */}
              <button
                onClick={handleAiDiagnostic}
                disabled={aiLoading}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 mr-1
                  ${aiLoading
                    ? 'bg-accent-500/15 text-accent-300 cursor-wait'
                    : 'bg-gradient-to-r from-accent-500/20 to-accent-600/20 text-accent-300 hover:from-accent-500/30 hover:to-accent-600/30 ring-1 ring-accent-500/20'
                  }
                `}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">{t('gis.ai.loading')}</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('gis.ai.button')}</span>
                    <span className="sm:hidden">AI</span>
                  </>
                )}
              </button>
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`btn-ghost !p-2 ${showGrid ? 'text-accent-400' : ''}`}
                title="Toggle grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`btn-ghost !p-2 ${showLabels ? 'text-accent-400' : ''}`}
                title="Toggle labels"
              >
                <Eye className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="btn-ghost !p-2" title="Zoom out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(2, z + 0.2))} className="btn-ghost !p-2" title="Zoom in">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overlay de carregamento IA */}
          {aiLoading && (
            <div className="absolute inset-0 z-20 bg-ink-950/40 backdrop-blur-[2px] flex items-center justify-center" style={{ top: '49px' }}>
              <div className="glass rounded-xl px-6 py-5 text-center max-w-xs">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/15 mb-3">
                  <Brain className="w-6 h-6 text-accent-400 animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-primary mb-1">{t('gis.ai.analyzing')}</p>
                <p className="text-xs text-muted mb-3">{t('gis.ai.viaModel')}</p>
                <div className="h-1 bg-ink-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent-500 to-accent-300 rounded-full shimmer-bg animate-shimmer" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Canvas do mapa */}
          <div className="relative bg-ink-900" style={{ height: 'clamp(400px, 55vh, 640px)' }}>
            {/* Grade de fundo */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                  backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center',
                }}
              />
            )}

            {/* Rótulos de coordenadas */}
            {showLabels && (
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-2 left-3 text-[9px] text-muted font-mono">0°N, 0°W</span>
                <span className="absolute top-2 right-3 text-[9px] text-muted font-mono">0°N, 90°W</span>
                <span className="absolute bottom-2 left-3 text-[9px] text-muted font-mono">90°S, 0°W</span>
                <span className="absolute bottom-2 right-3 text-[9px] text-muted font-mono">90°S, 90°W</span>
              </div>
            )}

            {/* Mapa SVG */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            >
              <defs>
                <linearGradient id="polyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={scale.stops[0]} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={scale.stops[scale.stops.length - 1]} stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Preenchimento do polígono */}
              <polygon
                points={polyPointsStr}
                fill="url(#polyGrad)"
                stroke={scale.stops[Math.floor(scale.stops.length / 2)]}
                strokeWidth="0.3"
                strokeDasharray="0.8 0.4"
                className="transition-all duration-500"
              />

              {/* Vértices do polígono */}
              {mapPolygon.map((v, i) => (
                <g key={i}>
                  <circle
                    cx={v.x * 100}
                    cy={v.y * 100}
                    r="0.6"
                    fill={scale.stops[0]}
                    opacity="0.6"
                  />
                  <text
                    x={v.x * 100}
                    y={v.y * 100 - 1.5}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="1.4"
                    fill="rgba(255,255,255,0.3)"
                  >
                    V{i + 1}
                  </text>
                </g>
              ))}

              {/* Pontos de amostragem */}
              {mapPoints.map((pt) => {
                const color = colorForValue(pt.value);
                const isHovered = hoveredPoint === pt.id;
                return (
                  <circle
                    key={pt.id}
                    cx={pt.x * 100}
                    cy={pt.y * 100}
                    r={isHovered ? (pointSize + 2) / 10 : pointSize / 10}
                    fill={color}
                    opacity={isHovered ? 1 : 0.85}
                    filter={isHovered ? 'url(#glow)' : undefined}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(pt.id)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}

              {/* Informação do ponto hover */}
              {hoveredPoint && (() => {
                const pt = mapPoints.find((p) => p.id === hoveredPoint);
                if (!pt) return null;
                return (
                  <g pointerEvents="none">
                    <rect
                      x={pt.x * 100 - 8}
                      y={pt.y * 100 - 9}
                      width="16"
                      height="6"
                      rx="1"
                      fill="rgba(12,12,15,0.95)"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.15"
                    />
                    <text
                      x={pt.x * 100}
                      y={pt.y * 100 - 5.5}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="2"
                      fill="white"
                    >
                      {pt.value.toFixed(1)}
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Tooltip de hover */}
            {hoveredPoint && (() => {
              const pt = mapPoints.find((p) => p.id === hoveredPoint);
              if (!pt) return null;
              return (
                <div
                  className="absolute pointer-events-none glass rounded-lg px-3 py-2 text-xs shadow-xl z-10"
                  style={{
                    left: `${pt.x * 100}%`,
                    top: `${pt.y * 100}%`,
                    transform: 'translate(-50%, calc(-100% - 12px))',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-3 h-3 text-accent-400" />
                    <span className="font-mono text-primary">{pt.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: colorForValue(pt.value) }}
                    />
                    <span className="text-primary">{t('gis.value')}: <span className="font-mono text-primary">{pt.value.toFixed(2)}</span></span>
                  </div>
                  <div className="text-[10px] text-muted mt-1 font-mono">
                    ({(pt.x * 90).toFixed(2)}°W, {(pt.y * 90).toFixed(2)}°S)
                  </div>
                </div>
              );
            })()}

            {/* Informações de overlay no canto */}
            <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 text-[10px] text-muted font-mono space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> {scale.name} {t('gis.scale')}
              </div>
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3 h-3" /> {mapPoints.length} {t('gis.samplePoints')}
              </div>
            </div>
          </div>
        </div>

        {/* Barra lateral de Controle de Escala de Cores */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '60ms' }}>
          {/* Seletor de Escala de Cores */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-accent-400" />
              <h3 className="text-sm font-semibold text-primary">{t('gis.scale.title')}</h3>
            </div>

            {/* Barra de gradiente prévia da escala */}
            <div
              className="h-8 rounded-lg mb-4 transition-all duration-500"
              style={{
                background: `linear-gradient(90deg, ${scale.stops.join(', ')})`,
              }}
            />

            {/* Opções de escala */}
            <div className="space-y-2">
              {colorScales.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => handleScaleChange(i)}
                  className={`
                    w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200
                    ${scaleIndex === i ? 'bg-white/[0.06] ring-1 ring-accent-500/30' : 'hover:bg-white/[0.03]'}
                  `}
                >
                  <div
                    className="h-6 w-16 rounded-md flex-shrink-0"
                    style={{ background: `linear-gradient(90deg, ${s.stops.join(', ')})` }}
                  />
                  <span className={`text-xs font-medium ${scaleIndex === i ? 'text-primary' : 'text-secondary'}`}>
                    {s.name}
                  </span>
                  {scaleIndex === i && (
                    <span className="ml-auto text-[10px] text-accent-400 font-mono">{t('gis.scale.active')}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Faixa de Valores */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-primary mb-4">{t('gis.range.title')}</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted">{t('gis.range.min')}</label>
                  <span className="text-xs font-mono text-primary tabular-nums">{minVal}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={minVal}
                  onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - 1))}
                  className="w-full accent-accent-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted">{t('gis.range.max')}</label>
                  <span className="text-xs font-mono text-primary tabular-nums">{maxVal}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={maxVal}
                  onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + 1))}
                  className="w-full accent-accent-500"
                />
              </div>

              {/* Visualização da faixa */}
              <div className="relative h-6 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(90deg, ${scale.stops.join(', ')})` }}
                />
                <div className="absolute inset-y-0 left-0 bg-ink-800" style={{ width: `${minVal}%` }} />
                <div className="absolute inset-y-0 right-0 bg-ink-800" style={{ width: `${100 - maxVal}%` }} />
              </div>
            </div>
          </div>

          {/* Tamanho do Ponto */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-primary">{t('gis.pointSize')}</h3>
              <span className="text-xs font-mono text-primary tabular-nums">{pointSize}px</span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              value={pointSize}
              onChange={(e) => setPointSize(Number(e.target.value))}
              className="w-full accent-accent-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
