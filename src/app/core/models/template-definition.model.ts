export type TemplateType = 'SAM' | 'LISTADO_OPERACIONES' | 'EXCEL' | 'PDF';
export type AccessLevel = 'FREE' | 'PREMIUM';
export type TemplateCategory = 'TIPS' | 'LEGAL' | 'PATTERN' | 'TECHNICAL_DATASHEET' | 'BUSSINESS_DATASHEET';

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  TIPS: 'Tips',
  LEGAL: 'Legal',
  PATTERN: 'Patrón',
  TECHNICAL_DATASHEET: 'Ficha Técnica',
  BUSSINESS_DATASHEET: 'Ficha de Negocio',
};

export const TEMPLATE_CATEGORY_OPTIONS: { value: TemplateCategory; label: string }[] = [
  { value: 'TIPS', label: 'Tips' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'PATTERN', label: 'Patrón' },
  { value: 'TECHNICAL_DATASHEET', label: 'Ficha Técnica' },
  { value: 'BUSSINESS_DATASHEET', label: 'Ficha de Negocio' },
];

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  accessLevel: AccessLevel;
  resourceUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imagePreview: string | null;
  explainVideo: string | null;
  category: TemplateCategory | null;
}

export interface CreateTemplateDefinitionRequest {
  name: string;
  description: string;
  type: TemplateType;
  accessLevel: AccessLevel;
  resourceUrl?: string | null;
  imagePreview?: string | null;
  explainVideo?: string | null;
  category?: TemplateCategory | null;
}

export interface UpdateTemplateDefinitionRequest {
  name?: string;
  description?: string;
  type?: TemplateType;
  accessLevel?: AccessLevel;
  resourceUrl?: string | null;
  isActive?: boolean;
  imagePreview?: string | null;
  explainVideo?: string | null;
  category?: TemplateCategory | null;
}
