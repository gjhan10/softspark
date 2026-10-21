import type { IconName } from '../shared/icon/icon';
import type { PlanId } from './plans.data';
import type { ProjectType } from './project-types';

export interface Service {
  id: string;
  name: string;
  icon: IconName;
  tagline: string;
  solves: string;
  forWhom: string;
  features: string[];
  projectKind: string;
  plan: PlanId;
  projectType: ProjectType;
  solutionCategory: string;
}

export const SERVICES: Service[] = [
  {
    id: 'web-esencial',
    name: 'Web esencial',
    icon: 'globe',
    tagline: 'Tu negocio visible, claro y fácil de contactar.',
    solves: 'No tener presencia en internet o tener una página desactualizada que no explica bien lo que ofreces.',
    forWhom: 'Profesionales independientes, emprendimientos y pequeños negocios.',
    features: ['Landing page o sitio de pocas secciones', 'Diseño responsive', 'Botones de contacto directo', 'SEO técnico inicial', 'Publicación en hosting estático'],
    projectKind: 'Sitio estático de alcance acotado.',
    plan: 'standard',
    projectType: 'landing',
    solutionCategory: 'sitios-web',
  },
  {
    id: 'web-comercial',
    name: 'Web comercial',
    icon: 'store',
    tagline: 'Un sitio pensado para atraer y convertir visitantes.',
    solves: 'Recibir visitas que no se convierten en consultas, o no poder mostrar bien un catálogo de productos o servicios.',
    forWhom: 'Negocios en crecimiento, empresas de servicios y marcas con catálogo.',
    features: ['Sitio multipágina', 'Catálogo de productos o servicios', 'Formularios conectados a un servicio externo', 'Mejoras SEO por página', 'Analítica cuando se configure un proveedor'],
    projectKind: 'Sitio corporativo o comercial con diseño propio.',
    plan: 'pro',
    projectType: 'sitio-corporativo',
    solutionCategory: 'sitios-web',
  },
  {
    id: 'aplicaciones-web',
    name: 'Aplicaciones web',
    icon: 'window',
    tagline: 'Herramientas que tus clientes o tu equipo usan en el navegador.',
    solves: 'Procesos que hoy dependen de hojas de cálculo, mensajes sueltos o tareas manuales repetitivas.',
    forWhom: 'Negocios que necesitan registros, cálculos, reservas, paneles o portales para clientes.',
    features: ['Interfaces interactivas', 'Usuarios y roles (con backend)', 'Formularios con validación', 'Paneles y reportes', 'Integración con APIs'],
    projectKind: 'Aplicación con frontend y, normalmente, backend y base de datos.',
    plan: 'premium',
    projectType: 'aplicacion-web',
    solutionCategory: 'a-medida',
  },
  {
    id: 'sistemas-empresariales',
    name: 'Sistemas empresariales',
    icon: 'building',
    tagline: 'ERP, CRM y plataformas de gestión para ordenar la operación.',
    solves: 'Información dispersa entre áreas, falta de control de inventario, ventas o clientes, y reportes que se arman a mano.',
    forWhom: 'Empresas con varias áreas, equipos comerciales y organizaciones con procesos definidos.',
    features: ['Módulos de inventario, ventas o compras', 'Gestión de clientes y oportunidades', 'Roles y permisos', 'Dashboards de indicadores', 'Implementación por fases'],
    projectKind: 'Sistema de gestión con backend, base de datos e infraestructura propia.',
    plan: 'enterprise',
    projectType: 'erp',
    solutionCategory: 'erp',
  },
  {
    id: 'automatizacion',
    name: 'Automatización',
    icon: 'workflow',
    tagline: 'Menos tareas repetitivas, menos errores manuales.',
    solves: 'Copiar datos entre sistemas, generar reportes a mano o depender de que alguien recuerde cada paso.',
    forWhom: 'Equipos con tareas operativas repetitivas y negocios que usan varias herramientas a la vez.',
    features: ['Integraciones entre sistemas', 'Procesos programados', 'Notificaciones automáticas', 'Generación de reportes', 'Registro de cada ejecución'],
    projectKind: 'Servicios o scripts que se ejecutan en un servidor o plataforma de automatización.',
    plan: 'enterprise',
    projectType: 'automatizacion',
    solutionCategory: 'automatizacion',
  },
  {
    id: 'software-a-medida',
    name: 'Software a medida',
    icon: 'code',
    tagline: 'Cuando ninguna herramienta existente encaja con tu forma de trabajar.',
    solves: 'Procesos propios que los productos genéricos no cubren o cubren a costa de adaptar todo el negocio.',
    forWhom: 'Empresas con necesidades específicas, productos digitales nuevos y mejoras de sistemas existentes.',
    features: ['Levantamiento de requisitos', 'Arquitectura según el caso', 'Desarrollo por iteraciones', 'Pruebas y documentación', 'Mantenimiento y evolución'],
    projectKind: 'Proyecto definido a partir de un análisis previo y planificado por fases.',
    plan: 'enterprise',
    projectType: 'a-medida',
    solutionCategory: 'a-medida',
  },
];
