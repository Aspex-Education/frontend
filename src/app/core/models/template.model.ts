export type MachineType =
  | 'plana' | 'collarin' | 'triple-transporte' | 'fileteadora'
  | 'dos-agujas' | 'de-poste' | 'plana-mecatronica' | 'fileteadora-mecatronica'
  | 'collarin-mecatronica' | 'plana-electronica' | 'fileteadora-electronica'
  | 'collarin-electronica' | 'ribeteadora' | 'presilladora' | 'cerradora'
  | 'empretinadora' | 'botonadora' | 'estampadora' | 'maquina-20u'
  | 'zig-zag' | 'multi-agujas' | 'other';

export interface OperationItem {
  order: number;
  description: string;
  machine: MachineType;
  machine_other: string | null;
  time_seconds: number;
}

export interface ListadoOperacionesPayload {
  product: string;
  operations: OperationItem[];
  total_time_seconds: number;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  userId: string;
  jsonPayload: string;
  resourcesUrl: string | null;
  createdAt: string;
  updatedAt: string;
  public: boolean;
  active: boolean;
  oficial: boolean;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  type: string;
  userId?: string;
  jsonPayload: string;
}

export function parsePayload(jsonPayload: string): ListadoOperacionesPayload {
  return JSON.parse(jsonPayload) as ListadoOperacionesPayload;
}
