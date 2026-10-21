export type Stage = 'prospecto' | 'contactado' | 'propuesta' | 'negociacion' | 'ganada' | 'perdida';

export interface Opportunity {
  id: number;
  company: string;
  contact: string;
  stage: Stage;
  value: number;
  owner: string;
  updated: string;
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  min: number;
  price: number;
}

export type TaskStatus = 'pendiente' | 'en-curso' | 'hecho';

export interface Task {
  id: number;
  title: string;
  project: string;
  owner: string;
  status: TaskStatus;
  priority: 'alta' | 'media' | 'baja';
}

export interface Order {
  code: string;
  customer: string;
  total: number;
  status: 'pagado' | 'pendiente' | 'enviado';
}

export const STAGES: { id: Stage; label: string }[] = [
  { id: 'prospecto', label: 'Prospecto' },
  { id: 'contactado', label: 'Contactado' },
  { id: 'propuesta', label: 'Propuesta' },
  { id: 'negociacion', label: 'Negociación' },
  { id: 'ganada', label: 'Ganada' },
  { id: 'perdida', label: 'Perdida' },
];

export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'en-curso', label: 'En curso' },
  { id: 'hecho', label: 'Hecho' },
];

export const OWNERS = ['Ana R.', 'Luis M.', 'Carla P.', 'Diego S.'];

export function seedOpportunities(): Opportunity[] {
  const rows: [string, string, Stage, number, number, string][] = [
    ['Alfa Distribuciones', 'Marta Quispe', 'propuesta', 18500, 0, 'hace 2 días'],
    ['Beta Logística', 'Jorge Salas', 'negociacion', 42000, 1, 'hoy'],
    ['Gamma Salud', 'Rosa Medina', 'ganada', 26000, 2, 'hace 5 días'],
    ['Delta Retail', 'Pablo Ríos', 'contactado', 9800, 3, 'ayer'],
    ['Épsilon Alimentos', 'Lucía Vargas', 'prospecto', 12000, 0, 'hace 1 semana'],
    ['Zeta Consultores', 'Andrés Paz', 'propuesta', 15400, 1, 'hace 3 días'],
    ['Eta Educación', 'Sofía León', 'perdida', 7200, 2, 'hace 2 semanas'],
    ['Theta Construcciones', 'Raúl Campos', 'negociacion', 58000, 3, 'hace 4 días'],
    ['Iota Textiles', 'Elena Cruz', 'contactado', 11300, 0, 'hoy'],
    ['Kappa Seguros', 'Mario Soto', 'prospecto', 21000, 1, 'hace 6 días'],
    ['Lambda Agro', 'Paula Ortiz', 'ganada', 33500, 2, 'hace 1 semana'],
    ['Mu Farmacias', 'Iván Rojas', 'propuesta', 16700, 3, 'ayer'],
  ];
  return rows.map(([company, contact, stage, value, owner, updated], i) => ({ id: i + 1, company, contact, stage, value, owner: OWNERS[owner], updated }));
}

export function seedProducts(): Product[] {
  const rows: [string, string, string, number, number, number][] = [
    ['SKU-1001', 'Teclado mecánico', 'Periféricos', 34, 10, 189],
    ['SKU-1002', 'Mouse inalámbrico', 'Periféricos', 6, 15, 59],
    ['SKU-1003', 'Monitor 24 pulgadas', 'Monitores', 12, 5, 649],
    ['SKU-1004', 'Monitor 27 pulgadas', 'Monitores', 3, 4, 989],
    ['SKU-1005', 'Laptop 14 pulgadas', 'Equipos', 8, 3, 3299],
    ['SKU-1006', 'Mini PC', 'Equipos', 0, 2, 1799],
    ['SKU-1007', 'Cable HDMI 2 m', 'Accesorios', 120, 30, 25],
    ['SKU-1008', 'Hub USB-C', 'Accesorios', 18, 20, 129],
    ['SKU-1009', 'Auriculares con micrófono', 'Periféricos', 22, 8, 149],
    ['SKU-1010', 'Soporte para laptop', 'Accesorios', 40, 10, 79],
    ['SKU-1011', 'Impresora láser', 'Equipos', 5, 2, 899],
    ['SKU-1012', 'Cámara web HD', 'Periféricos', 9, 10, 219],
  ];
  return rows.map(([sku, name, category, stock, min, price]) => ({ sku, name, category, stock, min, price }));
}

export function seedTasks(): Task[] {
  const rows: [string, string, number, TaskStatus, Task['priority']][] = [
    ['Levantamiento de requisitos', 'Portal de clientes', 0, 'hecho', 'alta'],
    ['Diseño de pantallas', 'Portal de clientes', 2, 'en-curso', 'alta'],
    ['Modelo de datos', 'Portal de clientes', 1, 'en-curso', 'media'],
    ['Pruebas de usabilidad', 'Portal de clientes', 2, 'pendiente', 'media'],
    ['Integración con facturación', 'ERP fase 1', 3, 'pendiente', 'alta'],
    ['Módulo de inventario', 'ERP fase 1', 1, 'en-curso', 'alta'],
    ['Migración de productos', 'ERP fase 1', 3, 'pendiente', 'media'],
    ['Reportes de stock', 'ERP fase 1', 0, 'pendiente', 'baja'],
    ['Landing de campaña', 'Sitio corporativo', 2, 'hecho', 'media'],
    ['SEO por página', 'Sitio corporativo', 0, 'hecho', 'baja'],
  ];
  return rows.map(([title, project, owner, status, priority], i) => ({ id: i + 1, title, project, owner: OWNERS[owner], status, priority }));
}

export function seedOrders(): Order[] {
  return [
    { code: 'PED-2041', customer: 'Gamma Salud', total: 4820, status: 'pagado' },
    { code: 'PED-2040', customer: 'Delta Retail', total: 1290, status: 'enviado' },
    { code: 'PED-2039', customer: 'Lambda Agro', total: 7640, status: 'pendiente' },
    { code: 'PED-2038', customer: 'Alfa Distribuciones', total: 2315, status: 'pagado' },
    { code: 'PED-2037', customer: 'Iota Textiles', total: 980, status: 'enviado' },
  ];
}

export function seededSeries(days: number, seed: number, base: number, amplitude: number): number[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    const weekly = Math.sin((i / 7) * Math.PI * 2) * amplitude * 0.35;
    v = Math.max(base * 0.4, v + (rand() - 0.46) * amplitude * 0.3);
    out.push(Math.round(v + weekly + i * (amplitude / days) * 0.6));
  }
  return out;
}

export const money = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(n);
export const num = (n: number) => new Intl.NumberFormat('es-PE').format(n);
