import type { PlanId } from '../../data/plans.data';
import type { ProjectType } from '../../data/project-types';
import type { Answers } from './wizard.data';

export type RecommendationId = 'web-standard' | 'web-pro' | 'web-premium' | 'app-web' | 'erp-crm' | 'custom';

export interface Recommendation {
  id: RecommendationId;
  title: string;
  subtitle: string;
  plan: PlanId;
  projectType: ProjectType;
  reasons: string[];
  considerations: string[];
  explore: { label: string; path: string };
}

const BASE: Record<RecommendationId, Omit<Recommendation, 'reasons' | 'considerations' | 'subtitle' | 'projectType'>> = {
  'web-standard': { id: 'web-standard', title: 'Web Standard', plan: 'standard', explore: { label: 'Ver el plan Standard', path: '/planes' } },
  'web-pro': { id: 'web-pro', title: 'Web Pro', plan: 'pro', explore: { label: 'Ver el plan Pro', path: '/planes' } },
  'web-premium': { id: 'web-premium', title: 'Web Premium', plan: 'premium', explore: { label: 'Ver el plan Premium', path: '/planes' } },
  'app-web': { id: 'app-web', title: 'Aplicación web', plan: 'premium', explore: { label: 'Ver aplicaciones web', path: '/servicios' } },
  'erp-crm': { id: 'erp-crm', title: 'ERP / CRM', plan: 'enterprise', explore: { label: 'Ver sistemas de gestión', path: '/soluciones' } },
  custom: { id: 'custom', title: 'Desarrollo personalizado', plan: 'enterprise', explore: { label: 'Ver software a medida', path: '/servicios' } },
};

export function recommend(a: Answers): Recommendation {
  const areas = a.areas.filter((x) => x !== 'ninguno');
  const has = (x: (typeof areas)[number]) => areas.includes(x);
  const bigOrg = a.business === 'empresa' || a.business === 'organizacion';
  const interactive = a.need === 'interactivo' || a.users === 'si' || areas.length > 0;
  const reasons: string[] = [];
  const considerations: string[] = [];
  let id: RecommendationId;
  let subtitle: string;
  let projectType: ProjectType;

  if (!interactive) {
    if (a.need === 'captar') {
      id = a.budget === 'amplio' || a.integrations === 'varias' ? 'web-premium' : 'web-pro';
      reasons.push('Quieres captar clientes y mostrar tu oferta con más detalle que una sola página.');
    } else if (bigOrg) {
      id = 'web-pro';
      reasons.push('Para una empresa u organización, un sitio de varias páginas transmite mejor lo que hace.');
    } else {
      id = 'web-standard';
      reasons.push('Necesitas mostrar información y facilitar el contacto, sin funciones complejas.');
    }
    if (id !== 'web-premium' && a.budget === 'amplio') {
      id = id === 'web-standard' ? 'web-pro' : 'web-premium';
      reasons.push('Tu presupuesto permite un diseño y una experiencia más elaborados.');
    }
    if (id === 'web-premium' && a.integrations === 'varias') {
      reasons.push('Necesitas conectar el sitio con varios sistemas.');
    }
    if (a.integrations === 'algunas') {
      considerations.push('Las integraciones con otros servicios se evalúan una por una y pueden requerir un proveedor externo.');
    }
    subtitle = 'Un sitio web sin usuarios ni base de datos propia, que puede publicarse como sitio estático.';
    projectType = id === 'web-standard' ? 'landing' : a.need === 'captar' ? 'catalogo' : 'sitio-corporativo';
    considerations.push('Si necesitas recibir formularios, se conectan a un proveedor externo o a una API.');
  } else {
    const crm = has('clientes') && !has('inventario') && !has('procesos');
    const erp = has('inventario') || has('procesos') || (has('ventas') && areas.length >= 2);
    const manyIntegrations = a.integrations === 'varias';

    if (manyIntegrations && (bigOrg || areas.length >= 3)) {
      id = 'custom';
      subtitle = 'Un sistema diseñado para tu operación, que conecta varias áreas y sistemas.';
      projectType = 'a-medida';
      reasons.push('Necesitas integrar varios sistemas además de gestionar varias áreas.');
    } else if (crm || erp) {
      id = 'erp-crm';
      if (crm) {
        subtitle = 'Un CRM: clientes, oportunidades y seguimiento comercial.';
        projectType = 'crm';
        reasons.push('Tu prioridad es gestionar clientes y oportunidades de venta, que es lo que resuelve un CRM.');
      } else if (has('clientes')) {
        subtitle = 'Un ERP con funciones de CRM: operación y clientes en el mismo sistema.';
        projectType = 'erp';
        reasons.push('Necesitas gestionar a la vez la operación (inventario, ventas o procesos) y los clientes.');
      } else {
        subtitle = 'Un ERP o un sistema de gestión por módulos.';
        projectType = 'erp';
        reasons.push('Necesitas controlar recursos y procesos de la empresa, que es lo que resuelve un ERP.');
      }
    } else {
      id = 'app-web';
      subtitle = 'Una aplicación web con las funciones que tu caso necesita.';
      projectType = 'aplicacion-web';
      reasons.push('Necesitas una herramienta interactiva más que una página informativa.');
    }

    if (a.users === 'si') reasons.push('Necesitas usuarios con cuentas o permisos distintos.');
    if (a.integrations === 'algunas') reasons.push('Hay que conectar uno o dos sistemas existentes.');
    considerations.push('Necesitará backend, base de datos e infraestructura, con costes aparte del desarrollo.');
    if (a.budget === 'ajustado') considerations.push('Con un presupuesto ajustado, lo recomendable es empezar por una primera versión acotada y crecer por fases.');
  }

  if (a.timeline === 'urgente') {
    considerations.push(interactive ? 'Con un plazo corto, conviene definir una primera fase pequeña y dejar el resto para después.' : 'Un plazo corto es más viable si el contenido (textos e imágenes) está listo desde el inicio.');
  }
  if (a.users === 'nose' || a.integrations === 'nose') {
    considerations.push('Hay respuestas por definir: las aclararemos en la primera conversación.');
  }

  return { ...BASE[id], subtitle, projectType, reasons, considerations };
}
