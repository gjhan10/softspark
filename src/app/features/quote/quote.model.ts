import { findPlan, isPlanId, PlanId } from '../../data/plans.data';
import { ProjectType, projectTypeLabel } from '../../data/project-types';

export type Timeline = 'urgente' | 'normal' | 'flexible' | 'nose';

export const TIMELINES: { id: Timeline; label: string }[] = [
  { id: 'urgente', label: 'Lo antes posible (menos de un mes)' },
  { id: 'normal', label: 'En uno a tres meses' },
  { id: 'flexible', label: 'Sin prisa (más de tres meses)' },
  { id: 'nose', label: 'Todavía no lo sé' },
];

export interface QuoteRequest {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType | '';
  plan: PlanId | 'sin-definir';
  description: string;
  budget: string;
  timeline: Timeline | '';
}

export type SendResult = { ok: true } | { ok: false; reason: 'network' | 'server' | 'timeout'; message: string };

export function planLabel(plan: QuoteRequest['plan']): string {
  return isPlanId(plan) ? findPlan(plan).name : 'Aún no lo sé';
}

export function timelineLabel(id: QuoteRequest['timeline']): string {
  return TIMELINES.find((t) => t.id === id)?.label ?? '';
}

export function summaryRows(r: QuoteRequest): { label: string; value: string }[] {
  return [
    { label: 'Nombre', value: r.name },
    { label: 'Correo', value: r.email },
    { label: 'Empresa', value: r.company || '—' },
    { label: 'Tipo de proyecto', value: projectTypeLabel(r.projectType) },
    { label: 'Plan', value: planLabel(r.plan) },
    { label: 'Presupuesto aproximado', value: r.budget || 'No indicado' },
    { label: 'Plazo', value: timelineLabel(r.timeline) },
    { label: 'Necesidad', value: r.description },
  ];
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
