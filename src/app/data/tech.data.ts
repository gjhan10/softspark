/**
 * Tecnologías que SoftSpark usa en proyectos. Solo se listan como "consolidadas"
 * las que forman parte de la experiencia real del equipo; lo que se está
 * explorando va aparte y se presenta como tal.
 */
export type TechLevel = 'consolidada' | 'exploracion';

export interface Tech {
  name: string;
  /** Abreviatura para el distintivo visual (no es un logotipo de marca). */
  mark: string;
  use: string;
  level: TechLevel;
}

export interface TechGroup {
  id: string;
  label: string;
  items: Tech[];
}

export const TECH_GROUPS: TechGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'Angular', mark: 'Ng', use: 'Aplicaciones web y paneles', level: 'consolidada' },
      { name: 'TypeScript', mark: 'TS', use: 'Código tipado y mantenible', level: 'consolidada' },
      { name: 'RxJS', mark: 'Rx', use: 'Flujos de datos en la interfaz', level: 'consolidada' },
      { name: 'HTML y CSS', mark: '</>', use: 'Interfaces accesibles y responsive', level: 'consolidada' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'Java', mark: 'Jv', use: 'Lógica de negocio robusta', level: 'consolidada' },
      { name: 'Spring Boot', mark: 'SB', use: 'APIs y servicios empresariales', level: 'consolidada' },
      { name: 'APIs REST', mark: '{}', use: 'Integración entre sistemas', level: 'consolidada' },
      { name: 'Microservicios', mark: 'μS', use: 'Sistemas que crecen por partes', level: 'consolidada' },
    ],
  },
  {
    id: 'datos',
    label: 'Datos y mensajería',
    items: [
      { name: 'SQL Server', mark: 'SQL', use: 'Bases de datos relacionales', level: 'consolidada' },
      { name: 'Oracle Database', mark: 'Or', use: 'Entornos corporativos', level: 'consolidada' },
      { name: 'MongoDB', mark: 'Mg', use: 'Documentos y datos flexibles', level: 'consolidada' },
      { name: 'Redis y Kafka', mark: 'Ev', use: 'Caché y eventos', level: 'consolidada' },
    ],
  },
  {
    id: 'infra',
    label: 'Infraestructura y entrega',
    items: [
      { name: 'Docker', mark: 'Dk', use: 'Entornos reproducibles', level: 'consolidada' },
      { name: 'Git y GitHub', mark: 'Git', use: 'Control de versiones y revisión', level: 'consolidada' },
      { name: 'CI/CD', mark: 'CI', use: 'Pruebas y despliegues automáticos', level: 'consolidada' },
      { name: 'Microsoft Azure', mark: 'Az', use: 'Nube y servicios gestionados', level: 'consolidada' },
    ],
  },
  {
    id: 'ia',
    label: 'Automatización e IA',
    items: [
      { name: 'Integraciones', mark: '⇄', use: 'Conectar herramientas existentes', level: 'consolidada' },
      { name: 'Automatización de procesos', mark: 'Au', use: 'Tareas programadas y flujos', level: 'consolidada' },
      { name: 'IA aplicada a negocios', mark: 'IA', use: 'En exploración: se evalúa caso por caso', level: 'exploracion' },
    ],
  },
];
