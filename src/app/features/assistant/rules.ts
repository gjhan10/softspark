import type { PlanId } from '../../data/plans.data';
import type { ProjectType } from '../../data/project-types';
import type { AssistantReply } from './assistant.model';

/**
 * Motor por reglas de Spark Assistant. No es inteligencia artificial:
 * busca palabras clave en el mensaje y combina sugerencias fijas definidas
 * por SoftSpark. Es determinista y se puede probar.
 */
interface Rule {
  id: string;
  keywords: string[];
  weight: number;
  solution: { name: string; slug: string; why: string };
  modules: string[];
  integrations: string[];
  toQuote: string[];
  projectType: ProjectType;
  plan: PlanId;
}

const RULES: Rule[] = [
  {
    id: 'inventario',
    keywords: ['inventario', 'stock', 'almacen', 'bodega', 'distribuidora', 'distribuidor', 'productos', 'mercaderia', 'kardex', 'lotes'],
    weight: 3,
    solution: { name: 'Sistema de inventario', slug: 'sistema-de-inventario', why: 'Controlar existencias, entradas, salidas y alertas de stock mínimo en un solo lugar.' },
    modules: ['Catálogo de productos', 'Entradas y salidas de stock', 'Alertas de stock mínimo', 'Reportes de movimientos'],
    integrations: ['Lector de código de barras', 'Exportación a Excel'],
    toQuote: ['Cuántos productos y almacenes manejas', 'Cuántas personas registrarán movimientos', 'Cómo controlas el stock hoy (Excel, papel, otro sistema)'],
    projectType: 'erp',
    plan: 'enterprise',
  },
  {
    id: 'erp',
    keywords: ['erp', 'compras', 'proveedores', 'facturacion', 'facturas', 'contabilidad', 'ordenes de compra', 'planilla', 'areas', 'operacion'],
    weight: 3,
    solution: { name: 'ERP modular', slug: 'erp-modular', why: 'Conectar compras, ventas, inventario y facturación para que cada área trabaje con la misma información.' },
    modules: ['Compras y proveedores', 'Ventas y facturación', 'Inventario', 'Roles y permisos por área', 'Dashboard de indicadores'],
    integrations: ['Facturación electrónica (proveedor autorizado)', 'Bancos o pasarela de pagos'],
    toQuote: ['Qué áreas usarán el sistema', 'Qué módulo es el más urgente', 'Qué sistemas o archivos usan hoy'],
    projectType: 'erp',
    plan: 'enterprise',
  },
  {
    id: 'crm',
    keywords: ['crm', 'clientes', 'vendedores', 'ventas', 'cotizaciones', 'prospectos', 'seguimiento', 'oportunidades', 'comercial', 'leads'],
    weight: 2,
    solution: { name: 'CRM comercial', slug: 'crm-comercial', why: 'Ordenar clientes y oportunidades por etapa para que ninguna venta se pierda por falta de seguimiento.' },
    modules: ['Clientes y contactos', 'Embudo de oportunidades', 'Tareas y recordatorios', 'Reportes por vendedor'],
    integrations: ['Correo electrónico', 'WhatsApp Business (según proveedor)', 'Formularios del sitio web'],
    toQuote: ['Cuántos vendedores lo usarán', 'Cuáles son las etapas de tu venta', 'Dónde guardas hoy los datos de clientes'],
    projectType: 'crm',
    plan: 'enterprise',
  },
  {
    id: 'tienda',
    keywords: ['tienda', 'vender en linea', 'ecommerce', 'e-commerce', 'carrito', 'pagos en linea', 'catalogo', 'pedidos online', 'delivery'],
    weight: 3,
    solution: { name: 'Tienda en línea', slug: 'tienda-en-linea', why: 'Vender por internet con catálogo, carrito y pagos, sin depender solo de mensajes.' },
    modules: ['Catálogo con filtros', 'Carrito y checkout', 'Panel de pedidos', 'Gestión de productos'],
    integrations: ['Pasarela de pagos', 'Inventario', 'Servicio de envíos'],
    toQuote: ['Cuántos productos venderás', 'Qué medios de pago necesitas', 'Cómo haces las entregas'],
    projectType: 'tienda',
    plan: 'premium',
  },
  {
    id: 'reservas',
    keywords: ['reservas', 'citas', 'turnos', 'agenda', 'horarios', 'pacientes', 'alumnos', 'matriculas', 'portal'],
    weight: 2,
    solution: { name: 'Aplicación a medida', slug: 'aplicacion-a-medida', why: 'Una aplicación web para que tus clientes o tu equipo reserven, registren o consulten información sin llamadas ni mensajes.' },
    modules: ['Agenda o calendario', 'Usuarios y roles', 'Notificaciones', 'Panel administrativo'],
    integrations: ['Correo o mensajería', 'Pagos (si se cobran reservas)'],
    toQuote: ['Quiénes usarán la aplicación', 'Qué debe poder hacer cada tipo de usuario', 'Si necesitas cobrar en línea'],
    projectType: 'aplicacion-web',
    plan: 'premium',
  },
  {
    id: 'dashboard',
    keywords: ['reportes', 'indicadores', 'dashboard', 'kpi', 'graficos', 'metricas', 'excel', 'hojas de calculo', 'gerencia'],
    weight: 2,
    solution: { name: 'Panel de indicadores', slug: 'panel-de-indicadores', why: 'Ver los indicadores del negocio actualizados, en lugar de armar reportes a mano.' },
    modules: ['Indicadores por periodo', 'Gráficos interactivos', 'Filtros por área o canal', 'Exportación'],
    integrations: ['Sistemas o bases de datos actuales', 'Hojas de cálculo'],
    toQuote: ['Qué indicadores revisas hoy', 'De dónde salen los datos', 'Cada cuánto deben actualizarse'],
    projectType: 'dashboard',
    plan: 'enterprise',
  },
  {
    id: 'automatizacion',
    keywords: ['automatizar', 'automatizacion', 'manual', 'repetitivo', 'repetitivas', 'copiar datos', 'correos automaticos', 'recordatorios', 'notificaciones'],
    weight: 2,
    solution: { name: 'Automatización de procesos', slug: 'automatizacion-de-procesos', why: 'Que las tareas repetitivas se hagan solas, con registro y alertas cuando algo falla.' },
    modules: ['Flujos programados o por evento', 'Registro de ejecuciones', 'Alertas de error'],
    integrations: ['Correo electrónico', 'Sistemas que ya usas'],
    toQuote: ['Qué tarea quieres automatizar y cada cuánto se hace', 'Qué herramientas intervienen', 'Quién debe enterarse si algo falla'],
    projectType: 'automatizacion',
    plan: 'enterprise',
  },
  {
    id: 'integracion',
    keywords: ['integrar', 'integracion', 'conectar', 'sincronizar', 'api', 'sistema existente', 'otro sistema'],
    weight: 2,
    solution: { name: 'Integración de sistemas', slug: 'integracion-de-sistemas', why: 'Conectar las herramientas que ya usas para no duplicar datos ni tareas.' },
    modules: ['Conectores entre sistemas', 'Sincronización programada', 'Registro de errores'],
    integrations: ['APIs de los sistemas actuales'],
    toQuote: ['Qué sistemas hay que conectar', 'Si esos sistemas ofrecen API o exportaciones', 'Qué datos deben sincronizarse'],
    projectType: 'integracion',
    plan: 'enterprise',
  },
  {
    id: 'web',
    keywords: ['pagina web', 'sitio web', 'web', 'landing', 'presencia', 'internet', 'que me encuentren', 'google', 'informacion de mi negocio'],
    weight: 1,
    solution: { name: 'Sitio corporativo', slug: 'sitio-corporativo', why: 'Presentar tu negocio con claridad y facilitar que te contacten.' },
    modules: ['Páginas de servicios', 'Formulario de contacto', 'Botón de WhatsApp', 'SEO técnico'],
    integrations: ['Proveedor de formularios', 'Analítica web'],
    toQuote: ['Cuántas secciones necesitas', 'Si ya tienes textos, fotos y logotipo', 'Si tienes dominio'],
    projectType: 'sitio-corporativo',
    plan: 'pro',
  },
];

export const EXAMPLES = [
  'Tengo una distribuidora y necesito controlar mis inventarios.',
  'Mis vendedores llevan los clientes en Excel y perdemos el seguimiento.',
  'Quiero vender mis productos en línea con pagos.',
  'Cada semana copiamos datos a mano entre dos sistemas.',
];

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const unique = (list: string[]) => [...new Set(list)];

export function ruleReply(message: string): AssistantReply {
  const text = ` ${normalize(message)} `;
  const scored = RULES.map((r) => {
    const hits = r.keywords.filter((k) => text.includes(` ${k} `) || text.includes(` ${k}s `) || (k.includes(' ') && text.includes(k)));
    // Posición de la primera coincidencia: ante un empate, lo que se menciona primero suele ser la necesidad principal.
    const first = Math.min(...hits.map((k) => text.indexOf(k)));
    return { r, hits, score: hits.length * r.weight, first };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.first - b.first);

  if (!scored.length) {
    return {
      understood: false,
      intro: 'No identifiqué una necesidad concreta en tu mensaje. Prueba a contarme a qué se dedica tu negocio y qué tarea quieres mejorar, por ejemplo: «Tengo una clínica y quiero que los pacientes reserven citas en línea».',
      modules: [],
      integrations: [],
      toQuote: [],
      projectType: 'otro',
      plan: 'pro',
      matched: [],
    };
  }

  const [main, ...rest] = scored;
  const secondary = rest.filter((s) => s.score >= main.score / 2).slice(0, 2);
  const all = [main, ...secondary];
  const extra = secondary.length ? ` También detecté temas de ${secondary.map((s) => s.r.solution.name.toLowerCase()).join(' y ')}, que se pueden sumar como módulos.` : '';

  return {
    understood: true,
    intro: `Por lo que cuentas, el punto de partida sería un ${main.r.solution.name.toLowerCase()}.${extra}`,
    solution: main.r.solution,
    modules: unique(all.flatMap((s) => s.r.modules)).slice(0, 7),
    integrations: unique(all.flatMap((s) => s.r.integrations)).slice(0, 4),
    toQuote: unique([...main.r.toQuote, 'Plazo deseado y presupuesto aproximado']),
    projectType: main.r.projectType,
    plan: main.r.plan,
    matched: unique(all.flatMap((s) => s.hits)),
  };
}
