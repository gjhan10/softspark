export interface NavLink {
  label: string;
  path: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Servicios', path: '/servicios' },
  { label: 'Soluciones', path: '/soluciones' },
  { label: 'Planes', path: '/planes' },
  { label: 'Demo', path: '/demo' },
  { label: 'Proceso', path: '/proceso' },
  { label: 'FAQ', path: '/preguntas-frecuentes' },
];
