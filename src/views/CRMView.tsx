import { useState, useRef, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  FileJson,
  File,
  Map as MapIcon,
  Trash2,
  Download,
  UploadCloud,
  FolderOpen,
  Cloud,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { clients } from '@/data/mockData';
import { fileIconType, generateRandomPointsInsidePolygon } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import type { ManagedFile } from '@/types';

const fileIconMap = {
  csv: FileSpreadsheet,
  txt: FileText,
  pdf: FileText,
  geojson: FileJson,
  kml: MapIcon,
};

const fileColorMap: Record<string, string> = {
  csv: 'text-emerald-400 bg-emerald-500/10',
  txt: 'text-secondary bg-white/5',
  pdf: 'text-red-400 bg-red-500/10',
  geojson: 'text-accent-400 bg-accent-500/10',
  kml: 'text-amber-400 bg-amber-500/10',
};

const statusColors: Record<string, string> = {
  active: 'badge-success',
  pending: 'badge-warning',
  archived: 'badge-neutral',
};

export default function CRMView() {
  const { files, addFile, deleteFile, role, addAuditEntry, addMapPoints, t } = useApp();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['c1', 'c1-f1']));
  const [dragging, setDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'parsing' | 'done'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [injectedCount, setInjectedCount] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setUploadStatus('uploading');
      setUploadProgress(15);

      const ingestibleTypes = new Set(['csv', 'txt', 'geojson', 'kml']);

      // Phase 1: Upload
      setTimeout(() => {
        setUploadProgress(45);
        setUploadStatus('parsing');

        // Phase 2: Parsing geo-coordinates
        setTimeout(() => {
          setUploadProgress(80);
          let totalInjected = 0;

          Array.from(fileList).forEach((file) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            const type = fileIconType(ext);
            const now = new Date();
            const newFile: ManagedFile = {
              id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name: file.name,
              type,
              size: formatBytes(file.size),
              uploadedAt: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`,
              category: type === 'pdf' ? t('crm.category.contract') : type === 'csv' || type === 'txt' ? t('crm.category.soil') : t('crm.category.boundary'),
            };
            addFile(newFile);

            // Inject 10 map points for spatial data files
            if (ingestibleTypes.has(type)) {
              const newPoints = generateRandomPointsInsidePolygon(10, `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
              addMapPoints(newPoints);
              totalInjected += newPoints.length;
            }

            addAuditEntry({
              id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              timestamp: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`,
              role,
              component: 'CRM Module',
              action: totalInjected > 0
                ? `User uploaded ${file.name} — ${totalInjected} coordinates ingested`
                : `${type.toUpperCase()} Uploaded`,
              ip: '10.0.4.12',
              severity: 'info',
            });
          });

          setUploadProgress(100);
          setInjectedCount(totalInjected);

          // Phase 3: Done
          setTimeout(() => {
            setUploadStatus('done');
            setRecentUpload(
              totalInjected > 0
                ? `${fileList.length} ${t('crm.drop.done')} — ${totalInjected} ${t('crm.drop.coordsInjected')}`
                : `${fileList.length} ${t('crm.drop.done')}`
            );
            setTimeout(() => {
              setUploadStatus('idle');
              setRecentUpload(null);
              setUploadProgress(0);
              setInjectedCount(0);
            }, 4000);
          }, 400);
        }, 800);
      }, 600);
    },
    [addFile, addAuditEntry, addMapPoints, role, t]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dropRef.current) setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (id: string, name: string) => {
    deleteFile(id);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      role,
      component: 'CRM Module',
      action: `${name} Deleted`,
      ip: '10.0.4.12',
      severity: role === 'admin' ? 'warning' : 'info',
    });
  };

  const handleDownload = (name: string) => {
    const blob = new Blob([JSON.stringify({ filename: name, mock: true, timestamp: new Date().toISOString() })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Registro Hierárquico */}
      <div className="card overflow-hidden animate-slide-up">
        <div className="p-5 border-b border-white/[0.04]">
          <h3 className="text-sm font-semibold text-primary">{t('crm.registry.title')}</h3>
          <p className="text-xs text-muted mt-0.5">{t('crm.registry.subtitle')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="table-header pl-5">{t('crm.table.name')}</th>
                <th className="table-header">{t('crm.table.type')}</th>
                <th className="table-header">{t('crm.table.region')}</th>
                <th className="table-header">{t('crm.table.area')}</th>
                <th className="table-header">{t('crm.table.crop')}</th>
                <th className="table-header pr-5">{t('crm.table.status')}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const clientExpanded = expanded.has(client.id);
                return (
                  <ClientRow
                    key={client.id}
                    client={client}
                    expanded={clientExpanded}
                    expandedSet={expanded}
                    onToggle={toggleExpand}
                    t={t}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zona de descarga */}
      <div className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative card border-2 border-dashed transition-all duration-300 overflow-hidden
            ${dragging ? 'border-accent-500 bg-accent-500/[0.04] scale-[1.01]' : 'border-white/10'}
          `}
        >
          {dragging && <div className="absolute inset-0 grid-bg pointer-events-none" />}
          <div className="p-8 sm:p-12 text-center">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300
              ${dragging ? 'bg-accent-500/20 scale-110' : 'bg-white/[0.04]'}
            `}>
              {uploadStatus === 'uploading' || uploadStatus === 'parsing' ? (
                <Cloud className="w-7 h-7 text-accent-400 animate-pulse" />
              ) : uploadStatus === 'done' ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              ) : (
                <UploadCloud className={`w-7 h-7 transition-colors ${dragging ? 'text-accent-400' : 'text-muted'}`} />
              )}
            </div>

            {uploadStatus === 'uploading' || uploadStatus === 'parsing' ? (
              <div>
                <p className="text-sm font-semibold text-primary mb-1">
                  {uploadStatus === 'uploading' ? t('crm.drop.uploading') : t('crm.drop.parsing')}
                </p>
                <p className="text-[10px] text-muted mb-3">
                  {uploadStatus === 'uploading' ? t('crm.drop.uploadingSub') : t('crm.drop.parsingSub')}
                </p>
                <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${uploadProgress}%`,
                      background: 'linear-gradient(90deg, #3b5af1, #5b78f5)',
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted mt-1.5 tabular-nums">{uploadProgress}%</p>
              </div>
            ) : uploadStatus === 'done' ? (
              <div className="animate-scale-in">
                <p className="text-sm font-semibold text-emerald-400">{recentUpload}</p>
                {injectedCount > 0 && (
                  <p className="text-xs text-accent-400 mt-1 flex items-center justify-center gap-1.5">
                    <MapIcon className="w-3 h-3" />
                    {injectedCount} {t('crm.drop.newPoints')}
                  </p>
                )}
                <p className="text-xs text-muted mt-1">{t('crm.drop.doneSub')}</p>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-primary mb-1">
                  {dragging ? t('crm.drop.dragHere') : t('crm.drop.title')}
                </p>
                <p className="text-xs text-muted mb-4">
                  {t('crm.drop.subtitle')}
                </p>
                <label className="btn-outline cursor-pointer">
                  <FolderOpen className="w-4 h-4" />
                  {t('crm.drop.browse')}
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Badges de formato */}
          <div className="flex flex-wrap justify-center gap-2 pb-6">
            {[
              { ext: 'CSV', icon: FileSpreadsheet, color: 'text-emerald-400/70' },
              { ext: 'TXT', icon: FileText, color: 'text-secondary/70' },
              { ext: 'PDF', icon: File, color: 'text-red-400/70' },
              { ext: 'GEOJSON', icon: FileJson, color: 'text-accent-400/70' },
              { ext: 'KML', icon: MapIcon, color: 'text-amber-400/70' },
            ].map((fmt) => {
              const Icon = fmt.icon;
              return (
                <span key={fmt.ext} className="badge-neutral gap-1.5">
                  <Icon className={`w-3 h-3 ${fmt.color}`} />
                  {fmt.ext}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grade do Gerenciador de Documentos */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-primary">{t('crm.docs.title')}</h3>
            <p className="text-xs text-muted mt-0.5">{files.length} {t('crm.docs.count')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file, i) => {
            const Icon = fileIconMap[file.type] ?? File;
            const colorClass = fileColorMap[file.type] ?? 'text-secondary bg-white/5';
            return (
              <div
                key={file.id}
                className="card card-hover p-4 group animate-scale-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary truncate" title={file.name}>{file.name}</p>
                    <p className="text-[10px] text-muted mt-0.5">{file.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-neutral !px-2 !py-0.5 text-[10px] uppercase">{file.type}</span>
                  <span className="badge-neutral !px-2 !py-0.5 text-[10px]">{file.size}</span>
                </div>

                <p className="text-[10px] text-muted mb-3">{file.uploadedAt}</p>

                <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                  <button
                    onClick={() => handleDownload(file.name)}
                    className="btn-ghost !px-2 !py-1.5 text-xs flex-1 justify-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t('common.download')}
                  </button>
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(file.id, file.name)}
                      className="btn-ghost !px-2 !py-1.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-8 h-8 text-muted mx-auto mb-2" />
            <p className="text-sm text-muted">{t('crm.docs.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClientRow({
  client,
  expanded,
  expandedSet,
  onToggle,
  t,
}: {
  client: typeof clients[0];
  expanded: boolean;
  expandedSet: Set<string>;
  onToggle: (id: string) => void;
  t: (key: string) => string;
}) {
  return (
    <>
      <tr
        className="table-row cursor-pointer group"
        onClick={() => onToggle(client.id)}
      >
        <td className="py-3.5 pl-5">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            )}
            <span className="text-sm font-medium text-primary">{client.name}</span>
          </div>
        </td>
        <td className="py-3.5"><span className="badge-accent">{t('crm.type.client')}</span></td>
        <td className="py-3.5 text-sm text-secondary">{client.region}</td>
        <td className="py-3.5 text-sm text-secondary">—</td>
        <td className="py-3.5 text-sm text-secondary">—</td>
        <td className="py-3.5 pr-5"><span className={statusColors[client.status]}>{t('common.' + client.status)}</span></td>
      </tr>

      {expanded && client.farms.map((farm) => {
        const farmKey = `${client.id}-${farm.id}`;
        const farmExpanded = expandedSet.has(farmKey);
        return (
          <FarmRow
            key={farm.id}
            farm={farm}
            farmKey={farmKey}
            expanded={farmExpanded}
            expandedSet={expandedSet}
            onToggle={onToggle}
            indent={1}
            t={t}
          />
        );
      })}
    </>
  );
}

function FarmRow({
  farm,
  farmKey,
  expanded,
  expandedSet,
  onToggle,
  indent,
  t,
}: {
  farm: typeof clients[0]['farms'][0];
  farmKey: string;
  expanded: boolean;
  expandedSet: Set<string>;
  onToggle: (id: string) => void;
  indent: number;
  t: (key: string) => string;
}) {
  return (
    <>
      <tr
        className="table-row cursor-pointer group bg-white/[0.01]"
        onClick={() => onToggle(farmKey)}
      >
        <td className="py-3 pl-5" style={{ paddingLeft: `${20 + indent * 24}px` }}>
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted" />
            )}
            <span className="text-sm text-primary">{farm.name}</span>
          </div>
        </td>
        <td className="py-3"><span className="badge-warning">{t('crm.type.farm')}</span></td>
        <td className="py-3 text-sm text-muted">—</td>
        <td className="py-3 text-sm text-secondary">{farm.area}</td>
        <td className="py-3 text-sm text-muted">—</td>
        <td className="py-3 pr-5 text-sm text-muted">—</td>
      </tr>

      {expanded && farm.fields.map((field) => (
        <tr key={field.id} className="table-row bg-white/[0.02]">
          <td className="py-2.5 pl-5" style={{ paddingLeft: `${20 + (indent + 1) * 24}px` }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="text-sm text-secondary">{field.name}</span>
            </div>
          </td>
          <td className="py-2.5"><span className="badge-neutral">{t('crm.type.field')}</span></td>
          <td className="py-2.5 text-sm text-muted">—</td>
          <td className="py-2.5 text-sm text-secondary">{field.area}</td>
          <td className="py-2.5 text-sm text-secondary">{field.crop}</td>
          <td className="py-2.5 pr-5 text-sm text-muted">—</td>
        </tr>
      ))}
    </>
  );
}
