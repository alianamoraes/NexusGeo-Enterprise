import { useState, useRef, useEffect } from 'react';
import { Shield, Lock, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const ADMIN_PASSWORD = 'nexus2026';

export default function AdminPasswordModal({ onClose }: { onClose: () => void }) {
  const { t, setRole, addAuditEntry, role } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(false);
      setSuccess(true);
      setRole('admin');
      addAuditEntry({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        role: 'admin',
        component: 'Auth',
        action: t('admin.modal.auditSuccess'),
        ip: '10.0.4.12',
        severity: 'info',
      });
      setTimeout(() => onClose(), 1200);
    } else {
      setError(true);
      addAuditEntry({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        role,
        component: 'Auth',
        action: t('admin.modal.auditFailed'),
        ip: '10.0.4.12',
        severity: 'warning',
      });
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm animate-scale-in">
        <div className="card overflow-hidden shadow-2xl border" style={{ borderColor: 'var(--c-border-strong)' }}>
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-accent-500/10 to-transparent" style={{ borderColor: 'var(--c-border)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-accent-500/15 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{t('admin.modal.title')}</p>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost !p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Corpo */}
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
            <p className="text-xs text-muted leading-relaxed">
              {t('admin.modal.subtitle')}
            </p>

            {success ? (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-scale-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-400 font-medium">{t('admin.modal.success')}</p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    placeholder={t('admin.modal.placeholder')}
                    className="input !pl-9 !pr-10 text-sm"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 animate-scale-in">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-400 font-medium">{t('admin.modal.error')}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="button" onClick={onClose} className="btn-outline flex-1">
                    {t('admin.modal.cancel')}
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    <Shield className="w-3.5 h-3.5" />
                    {t('admin.modal.confirm')}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
