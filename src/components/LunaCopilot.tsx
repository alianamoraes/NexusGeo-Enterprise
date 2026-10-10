import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ChevronDown, Send, Brain, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LunaCopilot() {
  const { lunaOpen, setLunaOpen, lunaReports, t } = useApp();
  const [expanded, setExpanded] = useState(true);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lunaReports, expanded]);

  if (!lunaOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] animate-slide-up">
      <div className="card overflow-hidden shadow-2xl shadow-black/40 border" style={{ borderColor: 'var(--c-border-strong)' }}>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-accent-500/10 to-transparent" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                {t('luna.title')}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              </p>
              <p className="text-[10px] text-muted">{t('luna.model')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setExpanded(!expanded)} className="btn-ghost !p-1.5">
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? '' : 'rotate-180'}`} />
            </button>
            <button onClick={() => setLunaOpen(false)} className="btn-ghost !p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <>
            {/* Área de relatórios */}
            <div ref={scrollRef} className="max-h-[320px] overflow-y-auto px-4 py-3 space-y-3">
              {lunaReports.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="text-xs text-secondary">{t('luna.ready')}</p>
                  <p className="text-[10px] text-muted mt-1">{t('luna.readySub')}</p>
                </div>
              )}

              {lunaReports.map((report) => (
                <div key={report.id} className="rounded-lg border p-3 animate-slide-up" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface-hover)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-primary">{t('luna.reportTitle')}</span>
                    <span className="ml-auto flex items-center gap-1 text-[9px] text-muted font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {report.timestamp.slice(11, 19)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="badge-accent !text-[9px] !px-2 !py-0.5">{report.scaleName}</span>
                    <span className="badge-neutral !text-[9px] !px-2 !py-0.5">{report.pointCount} nodes</span>
                    <span className="badge-success !text-[9px] !px-2 !py-0.5">avg {report.avgValue.toFixed(1)}</span>
                  </div>
                  <pre className="text-[11px] text-secondary font-mono whitespace-pre-wrap leading-relaxed">
                    {report.text}
                  </pre>
                </div>
              ))}
            </div>

            {/* Barra de entrada */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t bg-ink-900" style={{ borderColor: 'var(--c-border)' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('luna.ask')}
                className="flex-1 bg-transparent text-xs text-primary placeholder:text-muted focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setInput('');
                }}
              />
              <button
                onClick={() => setInput('')}
                className="btn-ghost !p-1.5 text-accent-400"
                disabled={!input.trim()}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
