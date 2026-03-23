export type TemplateType = 'SAM' | 'LISTADO_OPERACIONES' | 'EXCEL' | 'PDF';
export type AccessLevel = 'FREE' | 'PREMIUM';

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
}
