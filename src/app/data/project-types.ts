export type ProjectType =
  | 'landing'
  | 'sitio-corporativo'
  | 'catalogo'
  | 'tienda'
  | 'aplicacion-web'
  | 'dashboard'
  | 'crm'
  | 'erp'
  | 'automatizacion'
  | 'integracion'
  | 'a-medida'
  | 'mantenimiento'
  | 'otro';

export const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: 'landing', label: 'Landing page o página informativa' },
  { id: 'sitio-corporativo', label: 'Sitio web corporativo' },
  { id: 'catalogo', label: 'Catálogo o página comercial' },
  { id: 'tienda', label: 'Tienda en línea' },
  { id: 'aplicacion-web', label: 'Aplicación web interactiva' },
  { id: 'dashboard', label: 'Dashboard o panel administrativo' },
  { id: 'crm', label: 'CRM (clientes y ventas)' },
  { id: 'erp', label: 'ERP o sistema de gestión empresarial' },
  { id: 'automatizacion', label: 'Automatización de procesos' },
  { id: 'integracion', label: 'Integración entre sistemas' },
  { id: 'a-medida', label: 'Software a medida' },
  { id: 'mantenimiento', label: 'Mantenimiento o mejoras de un producto existente' },
  { id: 'otro', label: 'Otro / aún no lo sé' },
];

export function isProjectType(value: unknown): value is ProjectType {
  return PROJECT_TYPES.some((t) => t.id === value);
}

export function projectTypeLabel(id: ProjectType | ''): string {
  return PROJECT_TYPES.find((t) => t.id === id)?.label ?? '';
}
