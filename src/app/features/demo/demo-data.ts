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

export type PoStatus = 'borrador' | 'aprobada' | 'recibida';

export interface PurchaseOrder {
  code: string;
  supplier: string;
  item: string;
  total: number;
  status: PoStatus;
  updated: string;
}

export type InvoiceStatus = 'pendiente' | 'pagada' | 'vencida';

export interface Invoice {
  code: string;
  customer: string;
  total: number;
  due: string;
  status: InvoiceStatus;
}

export const PO_STATUSES: { id: PoStatus; label: string }[] = [
  { id: 'borrador', label: 'Borrador' },
  { id: 'aprobada', label: 'Aprobada' },
  { id: 'recibida', label: 'Recibida' },
];

export const INVOICE_STATUSES: { id: InvoiceStatus; label: string }[] = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'vencida', label: 'Vencida' },
  { id: 'pagada', label: 'Pagada' },
];

export function seedPurchaseOrders(): PurchaseOrder[] {
  const rows: [string, string, string, number, PoStatus, string][] = [
    ['OC-1048', 'Proveedora Andina', 'Monitores 24 pulgadas (10 u.)', 6490, 'borrador', 'hoy'],
    ['OC-1047', 'TecnoImport', 'Laptops 14 pulgadas (4 u.)', 13196, 'aprobada', 'ayer'],
    ['OC-1046', 'Insumos del Sur', 'Cables HDMI (200 u.)', 3800, 'recibida', 'hace 3 días'],
    ['OC-1045', 'Papelería Central', 'Material de oficina', 920, 'borrador', 'hace 3 días'],
    ['OC-1044', 'Logística Norte', 'Transporte mensual', 2400, 'aprobada', 'hace 5 días'],
    ['OC-1043', 'Proveedora Andina', 'Hubs USB-C (40 u.)', 4120, 'recibida', 'hace 1 semana'],
    ['OC-1042', 'TecnoImport', 'Mini PC (6 u.)', 9870, 'aprobada', 'hace 1 semana'],
    ['OC-1041', 'Insumos del Sur', 'Mouse inalámbrico (60 u.)', 2760, 'recibida', 'hace 2 semanas'],
  ];
  return rows.map(([code, supplier, item, total, status, updated]) => ({ code, supplier, item, total, status, updated }));
}

export function seedInvoices(): Invoice[] {
  const rows: [string, string, number, string, InvoiceStatus][] = [
    ['F001-000231', 'Gamma Salud', 4820, 'vence en 12 días', 'pendiente'],
    ['F001-000230', 'Delta Retail', 1290, 'vence en 8 días', 'pendiente'],
    ['F001-000229', 'Lambda Agro', 7640, 'venció hace 3 días', 'vencida'],
    ['F001-000228', 'Alfa Distribuciones', 2315, 'pagada hace 2 días', 'pagada'],
    ['F001-000227', 'Iota Textiles', 980, 'venció hace 10 días', 'vencida'],
    ['F001-000226', 'Beta Logística', 6150, 'vence en 4 días', 'pendiente'],
    ['F001-000225', 'Zeta Consultores', 3400, 'pagada hace 5 días', 'pagada'],
    ['F001-000224', 'Mu Farmacias', 2870, 'venció hace 1 día', 'vencida'],
    ['F001-000223', 'Kappa Seguros', 5200, 'pagada hace 1 semana', 'pagada'],
    ['F001-000222', 'Theta Construcciones', 11800, 'vence en 20 días', 'pendiente'],
  ];
  return rows.map(([code, customer, total, due, status]) => ({ code, customer, total, due, status }));
}

export interface Workflow {
  id: number;
  name: string;
  trigger: string;
  steps: string[];
  active: boolean;
  /** Minutos de trabajo manual que se estima ahorrar por ejecución (cifra ficticia). */
  minutesSaved: number;
  /** Si se define, una de cada `failEvery` ejecuciones falla en el paso `failStep` (índice). */
  failEvery?: number;
  failStep?: number;
}

export type RunStatus = 'ok' | 'error';

export interface RunLog {
  id: number;
  workflowId: number;
  time: string;
  status: RunStatus;
  durationMs: number;
  detail: string;
}

export function seedWorkflows(): Workflow[] {
  return [
    { id: 1, name: 'Reporte diario de ventas', trigger: 'Cada día 08:00', steps: ['Consultar ventas del día anterior', 'Generar archivo de resumen', 'Enviar por correo a gerencia'], active: true, minutesSaved: 25 },
    { id: 2, name: 'Aviso de pedido nuevo', trigger: 'Al registrar un pedido', steps: ['Leer datos del pedido', 'Notificar al almacén', 'Registrar en la hoja de seguimiento'], active: true, minutesSaved: 10 },
    { id: 3, name: 'Recordatorio de facturas por vencer', trigger: 'Cada lunes 09:00', steps: ['Buscar facturas que vencen en 7 días', 'Preparar un mensaje por cliente', 'Enviar recordatorios'], active: true, minutesSaved: 30 },
    { id: 4, name: 'Sincronizar stock con la tienda en línea', trigger: 'Cada hora', steps: ['Leer stock del inventario', 'Comparar con la tienda en línea', 'Actualizar productos con diferencias'], active: true, minutesSaved: 15, failEvery: 3, failStep: 2 },
    { id: 5, name: 'Alta de cliente desde formulario web', trigger: 'Al recibir un formulario', steps: ['Validar los datos', 'Crear el cliente en el CRM', 'Enviar correo de bienvenida'], active: false, minutesSaved: 8 },
  ];
}

export function seedRuns(): RunLog[] {
  const rows: [number, string, RunStatus, number, string][] = [
    [4, '10:00', 'ok', 1840, '12 productos actualizados'],
    [2, '09:41', 'ok', 920, 'Pedido PED-2041 notificado'],
    [4, '09:00', 'error', 2310, 'Falló «Actualizar productos con diferencias»: la tienda no respondió (simulado)'],
    [2, '08:57', 'ok', 870, 'Pedido PED-2040 notificado'],
    [4, '08:00', 'ok', 1760, '3 productos actualizados'],
    [1, '08:00', 'ok', 2480, 'Resumen enviado a 2 destinatarios'],
    [2, '07:32', 'ok', 940, 'Pedido PED-2039 notificado'],
    [4, '07:00', 'ok', 1690, 'Sin diferencias'],
  ];
  return rows.map(([workflowId, time, status, durationMs, detail], i) => ({ id: rows.length - i, workflowId, time, status, durationMs, detail }));
}

/** Ejecuciones de los 6 días anteriores (sintéticas); la barra de hoy sale del registro. */
export const RUN_HISTORY = [14, 17, 12, 16, 15, 11];

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
export const seconds = (ms: number) => `${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(ms / 1000)} s`;
