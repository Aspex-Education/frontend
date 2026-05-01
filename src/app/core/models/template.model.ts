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
  jsonPayload: string;
}

export interface UpdateTemplateRequest extends CreateTemplateRequest {

}

export interface SAMOperation {
  operationId: string;
  order: number;
  description: string;
  machine: MachineType;
  timeSeconds: number;
  operatorRating: number;
  supplement: number;
  samIndividual: number;
}

export interface SAMFullResponse {
  id: string;
  name: string;
  sourceTemplateId: string;
  sourceTemplateName: string;
  operations: SAMOperation[];
  totalSam: number;
}

export interface SAMConfigItem {
  operation_id: string;
  operator_rating: number;
  supplement: number;
}

export interface SAMPayload {
  source_template_id: string;
  sam_config: SAMConfigItem[];
}

export function parsePayload(jsonPayload: string): ListadoOperacionesPayload {
  return JSON.parse(jsonPayload) as ListadoOperacionesPayload;
}

export function parseSAMPayload(jsonPayload: string): SAMPayload {
  return JSON.parse(jsonPayload) as SAMPayload;
}
