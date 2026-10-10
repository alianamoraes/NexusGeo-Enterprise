export type Role = 'admin' | 'operator';

export type ViewKey =
  | 'dashboard'
  | 'crm'
  | 'gis'
  | 'audit'
  | 'settings';

export interface User {
  name: string;
  email: string;
  role: Role;
}

export interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  sparkline: number[];
}

export interface FunnelStage {
  stage: string;
  value: number;
  color: string;
}

export interface HistogramBin {
  range: string;
  count: number;
}

export interface KanbanColumn {
  title: string;
  count: number;
  accent: string;
}

export interface Client {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'pending' | 'archived';
  farms: Farm[];
}

export interface Farm {
  id: string;
  name: string;
  area: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  crop: string;
  area: string;
}

export interface ManagedFile {
  id: string;
  name: string;
  type: 'csv' | 'txt' | 'pdf' | 'geojson' | 'kml';
  size: string;
  uploadedAt: string;
  category: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  role: Role;
  component: string;
  action: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface MapPoint {
  id: string;
  x: number;
  y: number;
  value: number;
}

export interface ColorScale {
  name: string;
  stops: string[];
}
