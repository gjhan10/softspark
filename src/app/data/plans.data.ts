import { PRICING } from '../core/site.config';

export type PlanId = 'standard' | 'pro' | 'premium' | 'enterprise';
export type FeatureState = 'incluido' | 'opcional' | 'evaluacion' | 'no';

export interface Plan {
  id: PlanId;
  name: string;
  audience: string;
  summary: string;
  scope: 'web' | 'sistemas';
  priceLabel: string;
  highlights: string[];
  cta: string;
}

export interface FeatureRow {
  label: string;
  values: Record<PlanId, FeatureState>;
  note?: string;
}

export interface FeatureGroup {
  id: string;
  title: string;
  rows: FeatureRow[];
}

export const PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    audience: 'Pequeños negocios y proyectos iniciales',
    summary: 'Una presencia web clara y bien construida para empezar a mostrar lo que haces.',
    scope: 'web',
    priceLabel: 'Cotización según alcance',
    highlights: [
      'Landing page o sitio informativo',
      'Diseño responsive',
      'Secciones básicas e información de contacto',
      'SEO técnico inicial',
      'Configuración de despliegue estático',
    ],
    cta: 'Cotizar Standard',
  },
  {
    id: 'pro',
    name: 'Pro',
    audience: 'Negocios que necesitan una presencia digital más completa',
    summary: 'Un sitio multipágina con diseño propio, preparado para captar contactos.',
    scope: 'web',
    priceLabel: 'Cotización según alcance',
    highlights: [
      'Sitio multipágina',
      'Diseño personalizado',
      'Formularios integrables con servicios externos',
      'Mejoras SEO',
      'Integraciones seleccionadas',
      'Analítica cuando se configure un proveedor',
    ],
    cta: 'Cotizar Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    audience: 'Proyectos que necesitan mayor personalización',
    summary: 'Una experiencia más elaborada con funcionalidades específicas y una base preparada para crecer.',
    scope: 'web',
    priceLabel: 'Cotización según alcance',
    highlights: [
      'Experiencia visual más elaborada',
      'Funcionalidades específicas',
      'Integraciones adicionales',
      'Arquitectura preparada para crecer',
      'Optimización de rendimiento',
      'Soporte o mantenimiento según contrato',
    ],
    cta: 'Cotizar Premium',
  },
  {
    id: 'enterprise',
    name: 'Enterprise / Custom',
    audience: 'Sistemas complejos y proyectos empresariales',
    summary: 'Software de gestión, integraciones y flujos de trabajo diseñados para tu operación, planificados por fases.',
    scope: 'sistemas',
    priceLabel: 'Precio personalizado',
    highlights: [
      'ERP y CRM',
      'Paneles administrativos',
      'Gestión de usuarios y roles',
      'Integraciones con APIs',
      'Flujos de trabajo y requisitos de seguridad',
      'Arquitectura personalizada y planificación por fases',
    ],
    cta: 'Conversar sobre mi proyecto',
  },
];

const v = (standard: FeatureState, pro: FeatureState, premium: FeatureState, enterprise: FeatureState) => ({
  standard,
  pro,
  premium,
  enterprise,
});

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'presencia',
    title: 'Presencia web',
    rows: [
      { label: 'Landing page o sitio informativo', values: v('incluido', 'incluido', 'incluido', 'opcional') },
      { label: 'Sitio multipágina', values: v('no', 'incluido', 'incluido', 'opcional') },
      { label: 'Diseño responsive', values: v('incluido', 'incluido', 'incluido', 'incluido') },
      { label: 'Diseño visual personalizado', values: v('opcional', 'incluido', 'incluido', 'incluido') },
      { label: 'Experiencia visual elaborada (animaciones, interacciones)', values: v('no', 'opcional', 'incluido', 'evaluacion') },
    ],
  },
  {
    id: 'seo',
    title: 'Contenido, SEO y analítica',
    rows: [
      { label: 'SEO técnico inicial', values: v('incluido', 'incluido', 'incluido', 'incluido') },
      { label: 'Mejoras SEO por página', values: v('opcional', 'incluido', 'incluido', 'incluido') },
      {
        label: 'Analítica web',
        values: v('opcional', 'incluido', 'incluido', 'incluido'),
        note: 'Requiere configurar un proveedor de analítica; puede tener condiciones propias.',
      },
    ],
  },
  {
    id: 'integraciones',
    title: 'Formularios e integraciones',
    rows: [
      { label: 'Información de contacto y enlaces', values: v('incluido', 'incluido', 'incluido', 'incluido') },
      {
        label: 'Formularios conectados a un servicio externo',
        values: v('opcional', 'incluido', 'incluido', 'incluido'),
        note: 'Un sitio estático no recibe formularios por sí solo: se conecta a un proveedor o a una API.',
      },
      { label: 'Integraciones seleccionadas (mapas, mensajería, calendarios)', values: v('no', 'opcional', 'incluido', 'incluido') },
      { label: 'Integraciones con APIs propias o de terceros', values: v('no', 'no', 'evaluacion', 'incluido') },
    ],
  },
  {
    id: 'sistemas',
    title: 'Aplicación y gestión',
    rows: [
      { label: 'Funcionalidades específicas del negocio', values: v('no', 'no', 'incluido', 'incluido') },
      {
        label: 'Usuarios, roles e inicio de sesión',
        values: v('no', 'no', 'evaluacion', 'incluido'),
        note: 'Requiere backend y base de datos.',
      },
      { label: 'Paneles administrativos', values: v('no', 'no', 'opcional', 'incluido') },
      { label: 'Módulos ERP / CRM y flujos de trabajo', values: v('no', 'no', 'no', 'incluido') },
      { label: 'Requisitos de seguridad específicos', values: v('no', 'no', 'evaluacion', 'incluido') },
    ],
  },
  {
    id: 'entrega',
    title: 'Entrega y evolución',
    rows: [
      {
        label: 'Configuración de despliegue',
        values: v('incluido', 'incluido', 'incluido', 'evaluacion'),
        note: 'Los sistemas con backend necesitan infraestructura propia, con costes aparte.',
      },
      { label: 'Componentes reutilizables', values: v('opcional', 'incluido', 'incluido', 'incluido') },
      { label: 'Optimización de rendimiento', values: v('opcional', 'opcional', 'incluido', 'incluido') },
      { label: 'Planificación por fases', values: v('no', 'no', 'opcional', 'incluido') },
      {
        label: 'Mantenimiento y soporte',
        values: v('opcional', 'opcional', 'opcional', 'opcional'),
        note: 'Sujeto a condiciones contractuales.',
      },
    ],
  },
];

export const FEATURE_STATES: Record<FeatureState, { label: string; short: string }> = {
  incluido: { label: 'Incluido', short: 'Incluido' },
  opcional: { label: 'Opcional, se cotiza aparte', short: 'Opcional' },
  evaluacion: { label: 'Sujeto a evaluación', short: 'A evaluar' },
  no: { label: 'No aplica en este plan', short: 'No aplica' },
};

export const PLAN_CONDITIONS = [
  'Los planes son propuestas comerciales iniciales: el alcance y el precio final se definen en una cotización.',
  'Hosting, dominio, mantenimiento, servicios de terceros y backend pueden tener condiciones y costes separados.',
  'Un sitio estático no ejecuta un servidor: formularios, usuarios o bases de datos requieren servicios adicionales.',
];

export function isPlanId(value: unknown): value is PlanId {
  return PLANS.some((p) => p.id === value);
}

export function findPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!;
}

export function planPrice(plan: Plan): string {
  const amount = PRICING.amounts[plan.id];
  if (!PRICING.showAmounts || amount == null) return plan.priceLabel;
  const formatted = new Intl.NumberFormat('es-PE', { style: 'currency', currency: PRICING.currency, maximumFractionDigits: 0 }).format(amount);
  return `Desde ${formatted}`;
}
