export interface NavLink {
  label: string;
  path: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Servicios', path: '/servicios' },
  { label: 'Soluciones', path: '/soluciones' },
  { label: 'Proyectos', path: '/proyectos' },
  { label: 'Lab', path: '/lab' },
  { label: 'Planes', path: '/planes' },
  { label: 'Proceso', path: '/proceso' },
  { label: 'FAQ', path: '/preguntas-frecuentes' },
];
