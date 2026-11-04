import { findPlan, isPlanId, PlanId } from '../../data/plans.data';
import { ProjectType, projectTypeLabel } from '../../data/project-types';

export type Timeline = 'urgente' | 'normal' | 'flexible' | 'nose';

export const TIMELINES: { id: Timeline; label: string }[] = [
  { id: 'urgente', label: 'Lo antes posible (menos de un mes)' },
  { id: 'normal', label: 'En uno a tres meses' },
  { id: 'flexible', label: 'Sin prisa (más de tres meses)' },
  { id: 'nose', label: 'Todavía no lo sé' },
];

export interface Option {
  id: string;
  label: string;
}

/** Funcionalidades que se pueden marcar en el paso 2 del configurador. */
export const FEATURES: Option[] = [
  { id: 'autenticacion', label: 'Autenticación' },
  { id: 'roles', label: 'Roles y permisos' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'usuarios', label: 'Gestión de usuarios' },
  { id: 'reportes', label: 'Reportes' },
  { id: 'integraciones', label: 'Integraciones' },
  { id: 'notificaciones', label: 'Notificaciones' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'otros', label: 'Otros módulos' },
];

export const OTHER_FEATURES_ID = 'otros';

/** Características generales del paso 3. */
export const EXTRAS: Option[] = [
  { id: 'diseno', label: 'Diseño personalizado' },
  { id: 'panel', label: 'Panel administrativo' },
  { id: 'responsive', label: 'Responsive' },
  { id: 'integraciones-externas', label: 'Integraciones externas' },
  { id: 'mantenimiento', label: 'Mantenimiento' },
];

/** Paso del configurador donde se edita cada dato. */
export type QuoteStep = 1 | 2 | 3 | 4;

export interface QuoteRequest {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType | '';
  plan: PlanId | 'sin-definir';
  description: string;
  budget: string;
  timeline: Timeline | '';
  features: string[];
  otherFeatures: string;
  extras: string[];
}

export interface SummaryRow {
  label: string;
  value: string;
  step: QuoteStep;
}

export type SendResult = { ok: true } | { ok: false; reason: 'network' | 'server' | 'timeout'; message: string };

export function planLabel(plan: QuoteRequest['plan']): string {
  return isPlanId(plan) ? findPlan(plan).name : 'Aún no lo sé';
}

export function timelineLabel(id: QuoteRequest['timeline']): string {
  return TIMELINES.find((t) => t.id === id)?.label ?? '';
}

export function optionLabels(ids: string[], options: Option[]): string {
  const list = options.filter((o) => ids.includes(o.id)).map((o) => o.label);
  return list.length ? list.join(', ') : 'Ninguna seleccionada';
}

export function summaryRows(r: QuoteRequest): SummaryRow[] {
  const rows: SummaryRow[] = [
    { label: 'Tipo de proyecto', value: projectTypeLabel(r.projectType), step: 1 },
    { label: 'Funcionalidades', value: optionLabels(r.features, FEATURES), step: 2 },
  ];
  if (r.features.includes(OTHER_FEATURES_ID) && r.otherFeatures) {
    rows.push({ label: 'Otros módulos', value: r.otherFeatures, step: 2 });
  }
  rows.push(
    { label: 'Características', value: optionLabels(r.extras, EXTRAS), step: 3 },
    { label: 'Plan', value: planLabel(r.plan), step: 3 },
    { label: 'Plazo', value: timelineLabel(r.timeline), step: 3 },
    { label: 'Presupuesto aproximado', value: r.budget || 'No indicado', step: 3 },
    { label: 'Nombre', value: r.name, step: 4 },
    { label: 'Empresa', value: r.company || '—', step: 4 },
    { label: 'Correo', value: r.email, step: 4 },
    { label: 'Necesidad', value: r.description, step: 4 },
  );
  return rows;
}

export function buildSubject(r: QuoteRequest): string {
  const type = projectTypeLabel(r.projectType);
  return `Solicitud de cotización: ${type}${r.company ? ` · ${r.company}` : ''}`;
}

export function buildMessage(r: QuoteRequest): string {
  const lines = summaryRows(r)
    .filter((row) => row.label !== 'Necesidad')
    .map((row) => `${row.label}: ${row.value}`);
  return ['Hola, equipo de SoftSpark:', '', 'Quiero solicitar una cotización con estos datos.', '', ...lines, '', 'Necesidad:', r.description, '', 'Gracias.'].join('\n');
}

export function mailtoHref(to: string, r: QuoteRequest): string {
  return `mailto:${to}?subject=${encodeURIComponent(buildSubject(r))}&body=${encodeURIComponent(buildMessage(r))}`;
}
