export type Business = 'profesional' | 'pequeno' | 'empresa' | 'organizacion' | 'proyecto';
export type Need = 'informativa' | 'captar' | 'interactivo';
export type YesNo = 'si' | 'no' | 'nose';
export type Area = 'clientes' | 'inventario' | 'ventas' | 'procesos' | 'ninguno';
export type Integrations = 'no' | 'algunas' | 'varias' | 'nose';
export type Budget = 'ajustado' | 'moderado' | 'amplio' | 'omitido';
export type Timeline = 'urgente' | 'normal' | 'flexible' | 'nose';

export interface Answers {
  business: Business | null;
  need: Need | null;
  users: YesNo | null;
  areas: Area[];
  integrations: Integrations | null;
  budget: Budget | null;
  timeline: Timeline | null;
}

export type StepKey = keyof Answers;

export interface Option<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

export interface Step {
  key: StepKey;
  title: string;
  help: string;
  multiple?: boolean;
  optional?: boolean;
  options: Option[];
}

export const EMPTY_ANSWERS: Answers = {
  business: null,
  need: null,
  users: null,
  areas: [],
  integrations: null,
  budget: null,
  timeline: null,
};

export const STEPS: Step[] = [
  {
    key: 'business',
    title: '¿Qué tipo de negocio o proyecto tienes?',
    help: 'Elige la opción que más se parezca.',
    options: [
      { value: 'profesional', label: 'Profesional independiente', hint: 'Consultoría, salud, diseño, servicios personales' },
      { value: 'pequeno', label: 'Pequeño negocio o emprendimiento', hint: 'Tienda, restaurante, servicios locales' },
      { value: 'empresa', label: 'Empresa mediana o grande', hint: 'Varias áreas o sedes' },
      { value: 'organizacion', label: 'Institución u organización', hint: 'Educativa, gremial, sin fines de lucro' },
      { value: 'proyecto', label: 'Idea o producto digital nuevo', hint: 'Algo que todavía no existe' },
    ],
  },
  {
    key: 'need',
    title: '¿Necesitas una página informativa o un sistema interactivo?',
    help: 'Piensa en lo que harán las personas cuando entren.',
    options: [
      { value: 'informativa', label: 'Mostrar información', hint: 'Quién soy, qué ofrezco, cómo contactarme' },
      { value: 'captar', label: 'Captar clientes y mostrar un catálogo', hint: 'Varias páginas, productos, formularios' },
      { value: 'interactivo', label: 'Una herramienta que la gente use', hint: 'Registrar, consultar o procesar información' },
    ],
  },
  {
    key: 'users',
    title: '¿Necesitas usuarios, roles o inicio de sesión?',
    help: 'Por ejemplo, que tu equipo o tus clientes entren con su propia cuenta.',
    options: [
      { value: 'no', label: 'No, cualquiera puede ver el contenido' },
      { value: 'si', label: 'Sí, con cuentas o permisos distintos' },
      { value: 'nose', label: 'Todavía no lo sé' },
    ],
  },
  {
    key: 'areas',
    title: '¿Necesitas gestionar alguna de estas áreas?',
    help: 'Puedes elegir varias.',
    multiple: true,
    options: [
      { value: 'clientes', label: 'Clientes y oportunidades de venta' },
      { value: 'inventario', label: 'Inventario o productos' },
      { value: 'ventas', label: 'Ventas, pedidos o facturación' },
      { value: 'procesos', label: 'Procesos internos (compras, tareas, aprobaciones)' },
      { value: 'ninguno', label: 'Ninguna por ahora' },
    ],
  },
  {
    key: 'integrations',
    title: '¿Necesitas integrar otros sistemas?',
    help: 'Por ejemplo, facturación, pagos, inventario existente o herramientas que ya usas.',
    options: [
      { value: 'no', label: 'No' },
      { value: 'algunas', label: 'Sí, uno o dos sistemas' },
      { value: 'varias', label: 'Sí, varios sistemas' },
      { value: 'nose', label: 'No estoy seguro' },
    ],
  },
  {
    key: 'budget',
    title: '¿Cuál es tu presupuesto aproximado?',
    help: 'Es opcional. Solo sirve para orientar la recomendación.',
    optional: true,
    options: [
      { value: 'ajustado', label: 'Ajustado', hint: 'Quiero empezar con lo esencial' },
      { value: 'moderado', label: 'Moderado', hint: 'Puedo invertir en algo más completo' },
      { value: 'amplio', label: 'Amplio', hint: 'Es una inversión estratégica' },
    ],
  },
  {
    key: 'timeline',
    title: '¿Cuál es tu plazo estimado?',
    help: 'Cuándo te gustaría tener una primera versión.',
    options: [
      { value: 'urgente', label: 'Lo antes posible', hint: 'Menos de un mes' },
      { value: 'normal', label: 'En uno a tres meses' },
      { value: 'flexible', label: 'Sin prisa', hint: 'Más de tres meses' },
      { value: 'nose', label: 'Todavía no lo sé' },
    ],
  },
];

export function answerLabel(step: Step, answers: Answers): string {
  const value = answers[step.key];
  if (Array.isArray(value)) {
    return value.map((v) => step.options.find((o) => o.value === v)?.label ?? v).join(', ');
  }
  if (value === 'omitido') return 'Prefiero no indicarlo';
  return step.options.find((o) => o.value === value)?.label ?? '';
}

export function isStepComplete(step: Step, answers: Answers): boolean {
  const value = answers[step.key];
  if (Array.isArray(value)) return value.length > 0;
  return value !== null;
}
