import type { IconName } from '../shared/icon/icon';

export interface SoftwareType {
  id: string;
  name: string;
  icon: IconName;
  what: string;
  example: string;
  users: string;
  backend: string;
  scale: 1 | 2 | 3 | 4;
}

export const SOFTWARE_TYPES: SoftwareType[] = [
  {
    id: 'estatica',
    name: 'Página estática',
    icon: 'globe',
    what: 'Muestra información que cambia poco: quién eres, qué ofreces y cómo contactarte.',
    example: 'La página de un consultor con sus servicios y un botón de contacto.',
    users: 'No',
    backend: 'No',
    scale: 1,
  },
  {
    id: 'corporativa',
    name: 'Web corporativa',
    icon: 'layers',
    what: 'Un sitio de varias páginas que presenta una empresa, sus servicios y su forma de trabajar.',
    example: 'El sitio de una empresa de servicios con una página por servicio.',
    users: 'No',
    backend: 'Opcional',
    scale: 2,
  },
  {
    id: 'aplicacion',
    name: 'Aplicación web',
    icon: 'window',
    what: 'Una herramienta interactiva: las personas registran, consultan o procesan información.',
    example: 'Un sistema de reservas o un portal donde los clientes ven sus pedidos.',
    users: 'Normalmente sí',
    backend: 'Sí',
    scale: 3,
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: 'users',
    what: 'Gestiona clientes, oportunidades y la relación comercial a lo largo del tiempo.',
    example: 'Un equipo de ventas que sigue cada oportunidad hasta cerrarla.',
    users: 'Sí, con roles',
    backend: 'Sí',
    scale: 3,
  },
  {
    id: 'erp',
    name: 'ERP',
    icon: 'building',
    what: 'Gestiona los procesos y recursos de la empresa: inventario, compras, ventas o finanzas.',
    example: 'Una distribuidora que controla stock, compras y ventas desde un mismo sistema.',
    users: 'Sí, con roles por área',
    backend: 'Sí',
    scale: 4,
  },
  {
    id: 'a-medida',
    name: 'Sistema a medida',
    icon: 'code',
    what: 'Software diseñado para procesos propios que los productos genéricos no cubren.',
    example: 'Una plataforma que integra operaciones, clientes y proveedores con reglas propias.',
    users: 'Según el caso',
    backend: 'Sí',
    scale: 4,
  },
];

export interface Scenario {
  who: string;
  need: string;
  answer: string;
  typeId: string;
}

export const SCENARIOS: Scenario[] = [
  {
    who: 'Un profesional independiente',
    need: 'quiere mostrar sus servicios y que lo contacten.',
    answer: 'Una página estática o landing page es suficiente para empezar.',
    typeId: 'estatica',
  },
  {
    who: 'Un negocio en crecimiento',
    need: 'quiere captar clientes y mostrar su catálogo.',
    answer: 'Una web corporativa o comercial con formularios conectados a un servicio.',
    typeId: 'corporativa',
  },
  {
    who: 'Una empresa con almacén',
    need: 'necesita controlar su inventario.',
    answer: 'Una aplicación web de inventario o el módulo de inventario de un ERP.',
    typeId: 'aplicacion',
  },
  {
    who: 'Un equipo comercial',
    need: 'necesita administrar oportunidades y clientes.',
    answer: 'Un CRM adaptado a sus etapas de venta.',
    typeId: 'crm',
  },
  {
    who: 'Una organización con varias áreas',
    need: 'necesita integrar su operación.',
    answer: 'Un ERP implementado por fases o un sistema a medida.',
    typeId: 'erp',
  },
];
