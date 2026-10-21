import type { IconName } from '../shared/icon/icon';
import type { PlanId } from './plans.data';
import type { ProjectType } from './project-types';

export type SolutionCategory = 'sitios-web' | 'ecommerce' | 'gestion' | 'erp' | 'crm' | 'dashboards' | 'automatizacion' | 'a-medida';
export type DemoModule = 'panel' | 'crm' | 'inventario' | 'analitica' | 'proyectos';

export interface SolutionModule {
  name: string;
  desc: string;
}

export interface Solution {
  slug: string;
  name: string;
  category: SolutionCategory;
  icon: IconName;
  summary: string;
  problem: string;
  forWhom: string[];
  modules: SolutionModule[];
  includes: string[];
  optional: string[];
  backend: 'no' | 'opcional' | 'si';
  backendNote: string;
  complexity: 'Inicial' | 'Media' | 'Alta';
  plan: PlanId;
  projectType: ProjectType;
  demo?: DemoModule;
}

export const SOLUTION_CATEGORIES: { id: SolutionCategory; label: string }[] = [
  { id: 'sitios-web', label: 'Sitios web' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'gestion', label: 'Sistemas de gestión' },
  { id: 'erp', label: 'ERP' },
  { id: 'crm', label: 'CRM' },
  { id: 'dashboards', label: 'Dashboards' },
  { id: 'automatizacion', label: 'Automatización' },
  { id: 'a-medida', label: 'Aplicaciones personalizadas' },
];

export const SOLUTIONS: Solution[] = [
  {
    slug: 'landing-page',
    name: 'Landing page',
    category: 'sitios-web',
    icon: 'globe',
    summary: 'Una página enfocada en un solo objetivo: presentar una oferta y conseguir el contacto.',
    problem: 'Necesitas un lugar claro al que enviar a tus clientes potenciales desde redes sociales, anuncios o tarjetas.',
    forWhom: ['Profesionales independientes', 'Lanzamientos de productos o servicios', 'Campañas puntuales'],
    modules: [
      { name: 'Propuesta de valor', desc: 'Título, beneficios y llamada a la acción principal.' },
      { name: 'Servicios u oferta', desc: 'Qué ofreces, para quién y en qué condiciones.' },
      { name: 'Contacto directo', desc: 'Correo, mensajería o formulario conectado a un servicio externo.' },
    ],
    includes: ['Diseño responsive', 'SEO técnico inicial', 'Metadatos para compartir en redes', 'Publicación en hosting estático'],
    optional: ['Formulario conectado a un proveedor', 'Analítica web', 'Dominio propio'],
    backend: 'no',
    backendNote: 'Funciona como sitio estático. Un formulario que reciba datos necesita un proveedor externo o una API.',
    complexity: 'Inicial',
    plan: 'standard',
    projectType: 'landing',
  },
  {
    slug: 'sitio-corporativo',
    name: 'Sitio corporativo',
    category: 'sitios-web',
    icon: 'layers',
    summary: 'Un sitio multipágina que presenta la empresa, sus servicios y sus canales de contacto.',
    problem: 'La empresa necesita transmitir confianza y explicar con detalle lo que hace, para clientes y para posibles socios.',
    forWhom: ['Empresas de servicios', 'Negocios con varias líneas de oferta', 'Organizaciones e instituciones'],
    modules: [
      { name: 'Páginas de servicios', desc: 'Una página por servicio con su propio contenido y metadatos.' },
      { name: 'Nosotros y proceso', desc: 'Cómo trabaja la empresa y qué la diferencia.' },
      { name: 'Contenido actualizable', desc: 'Estructura preparada para noticias, casos o recursos.' },
      { name: 'Contacto', desc: 'Formulario conectado a un servicio externo y canales directos.' },
    ],
    includes: ['Diseño personalizado', 'Mejoras SEO por página', 'Componentes reutilizables', 'Diseño responsive'],
    optional: ['Gestor de contenidos', 'Analítica web', 'Versión en otro idioma'],
    backend: 'opcional',
    backendNote: 'Puede publicarse como sitio estático. Un gestor de contenidos o formularios propios requieren servicios adicionales.',
    complexity: 'Media',
    plan: 'pro',
    projectType: 'sitio-corporativo',
  },
  {
    slug: 'catalogo-digital',
    name: 'Catálogo digital',
    category: 'ecommerce',
    icon: 'store',
    summary: 'Un catálogo navegable de productos con búsqueda, filtros y consulta directa por cada artículo.',
    problem: 'Tus clientes preguntan una y otra vez por los mismos productos, precios o disponibilidad.',
    forWhom: ['Comercios con catálogo amplio', 'Distribuidores', 'Negocios que venden por mensajería'],
    modules: [
      { name: 'Catálogo con filtros', desc: 'Categorías, búsqueda y fichas de producto.' },
      { name: 'Consulta por producto', desc: 'Botón que prepara un mensaje con el producto elegido.' },
      { name: 'Gestión del catálogo', desc: 'Actualización de productos desde un archivo o un panel.' },
    ],
    includes: ['Fichas de producto', 'Búsqueda y filtros', 'Diseño responsive', 'SEO por categoría'],
    optional: ['Panel para editar productos', 'Integración con inventario', 'Analítica de productos consultados'],
    backend: 'opcional',
    backendNote: 'Un catálogo basado en archivos puede ser estático. Editarlo desde un panel requiere backend.',
    complexity: 'Media',
    plan: 'pro',
    projectType: 'catalogo',
  },
  {
    slug: 'tienda-en-linea',
    name: 'Tienda en línea',
    category: 'ecommerce',
    icon: 'box',
    summary: 'Venta en línea con carrito, pedidos y pagos mediante una pasarela de pago.',
    problem: 'Quieres vender en internet sin depender solo de mensajes y transferencias manuales.',
    forWhom: ['Comercios que ya venden y quieren un canal en línea', 'Marcas con productos propios'],
    modules: [
      { name: 'Catálogo y carrito', desc: 'Productos, variantes y carrito de compra.' },
      { name: 'Pedidos', desc: 'Registro y seguimiento del estado de cada pedido.' },
      { name: 'Pagos', desc: 'Integración con una pasarela de pago autorizada.' },
      { name: 'Administración', desc: 'Panel para productos, stock y pedidos.' },
    ],
    includes: ['Análisis de requisitos y del proveedor de pagos', 'Diseño de la experiencia de compra'],
    optional: ['Integración con inventario', 'Facturación electrónica', 'Envíos y logística'],
    backend: 'si',
    backendNote: 'Requiere backend, base de datos, una pasarela de pago y un hosting distinto de un sitio estático.',
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'tienda',
  },
  {
    slug: 'sistema-de-inventario',
    name: 'Sistema de inventario',
    category: 'gestion',
    icon: 'box',
    summary: 'Control de productos, stock, entradas y salidas con alertas de stock bajo.',
    problem: 'No sabes con certeza cuánto stock tienes, qué se mueve más o cuándo reponer.',
    forWhom: ['Comercios y almacenes', 'Distribuidores', 'Negocios con varios puntos de venta'],
    modules: [
      { name: 'Productos y categorías', desc: 'Fichas con SKU, precios y unidades.' },
      { name: 'Movimientos', desc: 'Entradas, salidas y ajustes con historial.' },
      { name: 'Alertas', desc: 'Avisos cuando un producto baja de su mínimo.' },
      { name: 'Reportes', desc: 'Rotación, valorización y exportación.' },
    ],
    includes: ['Levantamiento del proceso actual', 'Roles de usuario', 'Panel de indicadores'],
    optional: ['Lectura de códigos de barras', 'Integración con ventas o facturación', 'Varios almacenes'],
    backend: 'si',
    backendNote: 'Requiere backend, base de datos y autenticación de usuarios.',
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'erp',
    demo: 'inventario',
  },
  {
    slug: 'gestion-de-proyectos',
    name: 'Gestión de proyectos',
    category: 'gestion',
    icon: 'kanban',
    summary: 'Tareas, responsables, estados y avances del equipo en un solo lugar.',
    problem: 'Las tareas se pierden entre mensajes y nadie tiene una visión clara del avance.',
    forWhom: ['Equipos de servicios', 'Áreas internas con proyectos', 'Agencias y consultoras'],
    modules: [
      { name: 'Tablero de tareas', desc: 'Estados, responsables y prioridades.' },
      { name: 'Proyectos', desc: 'Agrupación de tareas por cliente o iniciativa.' },
      { name: 'Seguimiento', desc: 'Avance, vencimientos y carga del equipo.' },
    ],
    includes: ['Roles de usuario', 'Tablero configurable', 'Reportes de avance'],
    optional: ['Registro de horas', 'Portal para clientes', 'Notificaciones por correo'],
    backend: 'si',
    backendNote: 'Requiere backend, base de datos y autenticación de usuarios.',
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'aplicacion-web',
    demo: 'proyectos',
  },
  {
    slug: 'erp-modular',
    name: 'ERP modular',
    category: 'erp',
    icon: 'building',
    summary: 'Gestión integrada de inventario, compras, ventas y finanzas, implementada módulo a módulo.',
    problem: 'Cada área trabaja con su propia herramienta y los datos no coinciden entre ellas.',
    forWhom: ['Empresas medianas', 'Organizaciones con varias áreas operativas'],
    modules: [
      { name: 'Inventario', desc: 'Stock, almacenes y movimientos.' },
      { name: 'Compras y ventas', desc: 'Órdenes, proveedores y clientes.' },
      { name: 'Finanzas básicas', desc: 'Cuentas por cobrar y por pagar.' },
      { name: 'Reportes', desc: 'Indicadores consolidados por área.' },
    ],
    includes: ['Análisis de procesos', 'Planificación por fases', 'Roles y permisos', 'Migración de datos acordada'],
    optional: ['Integración con facturación electrónica', 'Aplicación móvil', 'Integración con sistemas existentes'],
    backend: 'si',
    backendNote: 'Requiere backend, base de datos, infraestructura y acuerdos de soporte.',
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'erp',
    demo: 'panel',
  },
  {
    slug: 'crm-comercial',
    name: 'CRM comercial',
    category: 'crm',
    icon: 'users',
    summary: 'Clientes, oportunidades y seguimiento comercial con un embudo de ventas claro.',
    problem: 'Las oportunidades se olvidan, no se sabe en qué etapa está cada cliente y no hay historial.',
    forWhom: ['Equipos comerciales', 'Empresas de servicios B2B', 'Negocios con ventas consultivas'],
    modules: [
      { name: 'Contactos y empresas', desc: 'Ficha de cada cliente con su historial.' },
      { name: 'Embudo de oportunidades', desc: 'Etapas configurables y valor estimado.' },
      { name: 'Actividades', desc: 'Llamadas, reuniones y recordatorios.' },
      { name: 'Indicadores', desc: 'Conversión por etapa y por responsable.' },
    ],
    includes: ['Etapas adaptadas a tu proceso', 'Roles de usuario', 'Panel de indicadores'],
    optional: ['Integración con correo', 'Importación desde hojas de cálculo', 'Integración con el sitio web'],
    backend: 'si',
    backendNote: 'Requiere backend, base de datos y autenticación de usuarios.',
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'crm',
    demo: 'crm',
  },
  {
    slug: 'panel-de-indicadores',
    name: 'Panel de indicadores',
    category: 'dashboards',
    icon: 'chart',
    summary: 'Indicadores clave del negocio en tiempo casi real, con filtros y gráficos.',
    problem: 'Los reportes se arman a mano cada semana y llegan tarde para tomar decisiones.',
    forWhom: ['Gerencias', 'Áreas comerciales y operativas', 'Equipos que ya tienen datos en otros sistemas'],
    modules: [
      { name: 'Indicadores principales', desc: 'Tarjetas con variaciones respecto a periodos anteriores.' },
      { name: 'Gráficos', desc: 'Tendencias, comparativas y distribución.' },
      { name: 'Filtros', desc: 'Por periodo, área, producto o responsable.' },
    ],
    includes: ['Definición de indicadores', 'Conexión con las fuentes de datos acordadas', 'Diseño responsive'],
    optional: ['Exportación de reportes', 'Alertas por umbral', 'Acceso por roles'],
    backend: 'si',
    backendNote: 'Requiere acceso seguro a las fuentes de datos mediante un backend o una API.',
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'dashboard',
    demo: 'analitica',
  },
  {
    slug: 'automatizacion-de-procesos',
    name: 'Automatización de procesos',
    category: 'automatizacion',
    icon: 'workflow',
    summary: 'Tareas repetitivas que se ejecutan solas: reportes, notificaciones y traspaso de datos.',
    problem: 'Tu equipo dedica horas a copiar datos, enviar recordatorios o preparar los mismos reportes.',
    forWhom: ['Áreas administrativas', 'Equipos de operaciones', 'Negocios con varias herramientas digitales'],
    modules: [
      { name: 'Disparadores', desc: 'Horarios, eventos o cambios en otro sistema.' },
      { name: 'Acciones', desc: 'Crear registros, enviar mensajes o generar archivos.' },
      { name: 'Registro', desc: 'Historial de ejecuciones y errores.' },
    ],
    includes: ['Mapeo del proceso actual', 'Pruebas con datos de ejemplo', 'Documentación de cada flujo'],
    optional: ['Panel de monitoreo', 'Alertas de fallos', 'Integraciones adicionales'],
    backend: 'si',
    backendNote: 'Se ejecuta en un servidor o en una plataforma de automatización, con sus propios costes.',
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'automatizacion',
  },
  {
    slug: 'integracion-de-sistemas',
    name: 'Integración de sistemas',
    category: 'automatizacion',
    icon: 'plug',
    summary: 'Conexión entre herramientas que hoy no se comunican: ventas, inventario, facturación o sitio web.',
    problem: 'La misma información se registra dos o tres veces en sistemas distintos.',
    forWhom: ['Empresas con varios sistemas', 'Negocios que crecieron con herramientas sueltas'],
    modules: [
      { name: 'Conectores', desc: 'Lectura y escritura en las APIs de cada sistema.' },
      { name: 'Transformación', desc: 'Adaptación de formatos y validaciones.' },
      { name: 'Monitoreo', desc: 'Registro de sincronizaciones y reintentos.' },
    ],
    includes: ['Revisión de las APIs disponibles', 'Manejo de errores y reintentos', 'Documentación técnica'],
    optional: ['Panel de estado', 'Sincronización programada', 'Alertas'],
    backend: 'si',
    backendNote: 'Requiere un servicio que se ejecute en un servidor y credenciales gestionadas de forma segura.',
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'integracion',
  },
  {
    slug: 'aplicacion-a-medida',
    name: 'Aplicación a medida',
    category: 'a-medida',
    icon: 'code',
    summary: 'Una aplicación web diseñada desde cero para un proceso o producto propio.',
    problem: 'Tu necesidad no encaja en ningún producto existente sin forzar la forma en que trabajas.',
    forWhom: ['Empresas con procesos propios', 'Productos digitales nuevos', 'Equipos que quieren reemplazar herramientas improvisadas'],
    modules: [
      { name: 'Descubrimiento', desc: 'Requisitos, usuarios y prioridades.' },
      { name: 'Producto mínimo', desc: 'Una primera versión acotada y usable.' },
      { name: 'Iteraciones', desc: 'Mejoras por fases según el uso real.' },
    ],
    includes: ['Arquitectura según el caso', 'Pruebas automatizadas', 'Documentación'],
    optional: ['Aplicación móvil', 'Integraciones', 'Mantenimiento evolutivo'],
    backend: 'si',
    backendNote: 'Casi siempre requiere backend, base de datos e infraestructura propia.',
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'a-medida',
    demo: 'proyectos',
  },
];

export function findSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function categoryLabel(id: SolutionCategory): string {
  return SOLUTION_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function isSolutionCategory(value: unknown): value is SolutionCategory {
  return SOLUTION_CATEGORIES.some((c) => c.id === value);
}

export const BACKEND_LABEL: Record<Solution['backend'], string> = {
  no: 'Funciona como sitio estático',
  opcional: 'Backend opcional',
  si: 'Requiere backend',
};
