import type {
  KPIData,
  FunnelStage,
  HistogramBin,
  KanbanColumn,
  Client,
  ManagedFile,
  AuditEntry,
  MapPoint,
  ColorScale,
} from '@/types';

export const kpis: KPIData[] = [
  {
    label: 'Conversion Rate',
    value: '8.42%',
    change: 12.4,
    trend: 'up',
    sparkline: [42, 48, 45, 52, 58, 61, 67, 72, 84],
  },
  {
    label: 'Managed Clients',
    value: '247',
    change: 3.1,
    trend: 'up',
    sparkline: [210, 218, 225, 230, 234, 238, 240, 244, 247],
  },
  {
    label: 'Server Uptime',
    value: '99.97%',
    change: -0.03,
    trend: 'down',
    sparkline: [99.99, 99.98, 99.99, 99.97, 99.98, 99.96, 99.97, 99.97, 99.97],
  },
  {
    label: 'Pipeline Value',
    value: '$1.84M',
    change: 8.7,
    trend: 'up',
    sparkline: [1.2, 1.3, 1.35, 1.5, 1.58, 1.62, 1.71, 1.78, 1.84],
  },
];

export const funnelStages: FunnelStage[] = [
  { stage: 'Traffic', value: 12000, color: '#3b5af1' },
  { stage: 'Leads', value: 8400, color: '#5b78f5' },
  { stage: 'Qualified', value: 5200, color: '#8da6ff' },
  { stage: 'Proposal', value: 3100, color: '#bccaff' },
  { stage: 'Closed', value: 1008, color: '#d9e2ff' },
];

export const histogramBins: HistogramBin[] = [
  { range: '0-10', count: 8 },
  { range: '10-20', count: 15 },
  { range: '20-30', count: 32 },
  { range: '30-40', count: 48 },
  { range: '40-50', count: 65 },
  { range: '50-60', count: 52 },
  { range: '60-70', count: 38 },
  { range: '70-80', count: 22 },
  { range: '80-90', count: 12 },
  { range: '90-100', count: 5 },
];

export const kanbanColumns: KanbanColumn[] = [
  { title: 'Data Ingestion', count: 14, accent: 'accent' },
  { title: 'Boundary Reviews', count: 7, accent: 'warning' },
  { title: 'Contract Approvals', count: 3, accent: 'error' },
  { title: 'Completed Syncs', count: 42, accent: 'success' },
];

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'AgroNorte Holdings',
    region: 'Mato Grosso, BR',
    status: 'active',
    farms: [
      {
        id: 'f1',
        name: 'Fazenda São Lourenço',
        area: '2,840 ha',
        fields: [
          { id: 'fl1', name: 'Talhão A-01', crop: 'Soybean', area: '420 ha' },
          { id: 'fl2', name: 'Talhão A-02', crop: 'Corn', area: '380 ha' },
          { id: 'fl3', name: 'Talhão B-01', crop: 'Cotton', area: '310 ha' },
        ],
      },
      {
        id: 'f2',
        name: 'Fazenda Boa Vista',
        area: '1,920 ha',
        fields: [
          { id: 'fl4', name: 'Talhão C-01', crop: 'Soybean', area: '290 ha' },
          { id: 'fl5', name: 'Talhão C-02', crop: 'Soybean', area: '245 ha' },
        ],
      },
    ],
  },
  {
    id: 'c2',
    name: 'VerdeVale Co-op',
    region: 'Paraná, BR',
    status: 'active',
    farms: [
      {
        id: 'f3',
        name: 'Sitio Esperança',
        area: '860 ha',
        fields: [
          { id: 'fl6', name: 'Talhão D-01', crop: 'Coffee', area: '180 ha' },
          { id: 'fl7', name: 'Talhão D-02', crop: 'Sugarcane', area: '220 ha' },
        ],
      },
    ],
  },
  {
    id: 'c3',
    name: 'Cerrado Agrocorp',
    region: 'Goiás, BR',
    status: 'pending',
    farms: [
      {
        id: 'f4',
        name: 'Fazenda Triângulo',
        area: '3,100 ha',
        fields: [
          { id: 'fl8', name: 'Talhão E-01', crop: 'Soybean', area: '510 ha' },
          { id: 'fl9', name: 'Talhão E-02', crop: 'Corn', area: '440 ha' },
          { id: 'fl10', name: 'Talhão E-03', crop: 'Soybean', area: '390 ha' },
        ],
      },
    ],
  },
];

export const initialFiles: ManagedFile[] = [
  { id: 'file1', name: 'soil_metrics_q3.csv', type: 'csv', size: '2.4 MB', uploadedAt: '2026-10-08 14:22', category: 'Soil Data' },
  { id: 'file2', name: 'fazenda_sao_lourenco.geojson', type: 'geojson', size: '847 KB', uploadedAt: '2026-10-07 09:15', category: 'Field Boundary' },
  { id: 'file3', name: 'service_contract_2026.pdf', type: 'pdf', size: '1.1 MB', uploadedAt: '2026-10-06 16:40', category: 'Contract' },
  { id: 'file4', name: 'talhao_b01_boundary.kml', type: 'kml', size: '326 KB', uploadedAt: '2026-10-05 11:08', category: 'Field Boundary' },
  { id: 'file5', name: 'moisture_readings.txt', type: 'txt', size: '89 KB', uploadedAt: '2026-10-04 08:30', category: 'Soil Data' },
];

export const auditEntries: AuditEntry[] = [
  { id: 'a1', timestamp: '2026-10-09 08:42:18', role: 'admin', component: 'GIS Engine', action: 'Base Map Scale Modified', ip: '10.0.4.12', severity: 'info' },
  { id: 'a2', timestamp: '2026-10-09 08:35:02', role: 'operator', component: 'CRM Module', action: 'CSV Uploaded', ip: '10.0.4.55', severity: 'info' },
  { id: 'a3', timestamp: '2026-10-09 08:21:45', role: 'admin', component: 'Auth Service', action: 'Unauthorized Login Attempt', ip: '203.0.113.7', severity: 'critical' },
  { id: 'a4', timestamp: '2026-10-09 07:58:11', role: 'operator', component: 'CRM Module', action: 'Client Record Updated', ip: '10.0.4.55', severity: 'info' },
  { id: 'a5', timestamp: '2026-10-09 07:42:33', role: 'admin', component: 'Settings', action: 'Backup Schedule Modified', ip: '10.0.4.12', severity: 'warning' },
  { id: 'a6', timestamp: '2026-10-08 22:14:07', role: 'operator', component: 'GIS Engine', action: 'Color Scale Exported', ip: '10.0.4.88', severity: 'info' },
  { id: 'a7', timestamp: '2026-10-08 21:03:52', role: 'admin', component: 'CRM Module', action: 'Contract PDF Deleted', ip: '10.0.4.12', severity: 'warning' },
  { id: 'a8', timestamp: '2026-10-08 19:47:20', role: 'operator', component: 'Auth Service', action: 'Session Token Refreshed', ip: '10.0.4.55', severity: 'info' },
  { id: 'a9', timestamp: '2026-10-08 18:30:14', role: 'admin', component: 'Dashboard', action: 'KPI Threshold Updated', ip: '10.0.4.12', severity: 'info' },
  { id: 'a10', timestamp: '2026-10-08 17:15:38', role: 'operator', component: 'GIS Engine', action: 'Field Boundary Imported', ip: '10.0.4.88', severity: 'info' },
  { id: 'a11', timestamp: '2026-10-08 16:02:55', role: 'admin', component: 'Settings', action: 'Billing Rate Modified', ip: '10.0.4.12', severity: 'warning' },
  { id: 'a12', timestamp: '2026-10-08 14:48:11', role: 'operator', component: 'CRM Module', action: 'Farm Record Created', ip: '10.0.4.55', severity: 'info' },
];

export const mapPolygon = [
  { x: 0.2, y: 0.15 },
  { x: 0.85, y: 0.1 },
  { x: 0.9, y: 0.75 },
  { x: 0.55, y: 0.9 },
  { x: 0.15, y: 0.7 },
];

export function generateMapPoints(): MapPoint[] {
  const points: MapPoint[] = [];
  let seed = 42;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const poly = mapPolygon;
  const inside = (px: number, py: number) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };
  let attempts = 0;
  while (points.length < 60 && attempts < 500) {
    attempts++;
    const px = 0.1 + rng() * 0.8;
    const py = 0.05 + rng() * 0.9;
    if (inside(px, py)) {
      points.push({ id: `pt${points.length}`, x: px, y: py, value: rng() * 100 });
    }
  }
  return points;
}

export function generateRandomPointsInsidePolygon(count: number, idPrefix: string): MapPoint[] {
  const points: MapPoint[] = [];
  let seed = Date.now() & 0x7fffffff;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const poly = mapPolygon;
  const inside = (px: number, py: number) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };
  let attempts = 0;
  while (points.length < count && attempts < count * 20) {
    attempts++;
    const px = 0.1 + rng() * 0.8;
    const py = 0.05 + rng() * 0.9;
    if (inside(px, py)) {
      points.push({ id: `${idPrefix}-${points.length}`, x: px, y: py, value: rng() * 100 });
    }
  }
  return points;
}

export const colorScales: ColorScale[] = [
  { name: 'Viridis', stops: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'] },
  { name: 'Inferno', stops: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'] },
  { name: 'Ocean', stops: ['#0d1b2a', '#1b4965', '#5fa8d3', '#62b6cb', '#b8e0d2'] },
  { name: 'Thermal', stops: ['#03045e', '#0077b6', '#00f5d4', '#ffd166', '#ef476f'] },
  { name: 'Monochrome', stops: ['#1a1a2e', '#3a3a4d', '#6a6a80', '#9a9ab0', '#d0d0e0'] },
];

export function fileIconType(ext: string): 'csv' | 'txt' | 'pdf' | 'geojson' | 'kml' {
  const map: Record<string, 'csv' | 'txt' | 'pdf' | 'geojson' | 'kml'> = {
    csv: 'csv',
    txt: 'txt',
    pdf: 'pdf',
    geojson: 'geojson',
    json: 'geojson',
    kml: 'kml',
  };
  return map[ext] ?? 'csv';
}
