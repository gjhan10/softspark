import type { IconName } from '../shared/icon/icon';
import type { PlanId } from './plans.data';
import type { ProjectType } from './project-types';

export type SolutionCategory = 'sitios-web' | 'ecommerce' | 'gestion' | 'erp' | 'crm' | 'dashboards' | 'automatizacion' | 'a-medida';
export type SolutionFamily = 'web' | 'empresa' | 'flujo';
export type DemoModule = 'panel' | 'crm' | 'inventario' | 'analitica' | 'proyectos';

export interface SolutionModule {
  name: string;
  desc: string;
}

export interface TechSplit {
  frontend: string[];
  backend: string[];
  external: string[];
  analysis: string[];
}

export interface Solution {
  slug: string;
  name: string;
  category: SolutionCategory;
  family: SolutionFamily;
  icon: IconName;
  summary: string;
  capabilities: string[];
  overview: string;
  problem: string;
  forWhom: string[];
  modules: SolutionModule[];
  integrations: string[];
  includes: string[];
  optional: string[];
  backend: 'no' | 'opcional' | 'si';
  external: boolean;
  backendNote: string;
  tech: TechSplit;
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

export const SOLUTION_FAMILIES: { id: SolutionFamily; label: string; desc: string }[] = [
  {
    id: 'web',
    label: 'Web y comercio digital',
    desc: 'Sitios y catálogos para presentar tu negocio y vender. Varios pueden publicarse como sitio estático.',
  },
  {
    id: 'empresa',
    label: 'Software empresarial',
    desc: 'Sistemas con usuarios, datos y procesos internos. Funcionan con backend, base de datos e infraestructura propia.',
  },
  {
    id: 'flujo',
    label: 'Automatización e integraciones',
    desc: 'Flujos que se ejecutan solos, conexiones entre sistemas y aplicaciones diseñadas para un caso propio.',
  },
];

export const SOLUTIONS: Solution[] = [
  {
    slug: 'landing-page',
    name: 'Landing page',
    category: 'sitios-web',
    family: 'web',
    icon: 'globe',
    summary: 'Presenta tu oferta en una página rápida y enfocada en convertir visitas en consultas.',
    capabilities: ['Propuesta de valor y llamada a la acción', 'Contacto directo por correo o mensajería', 'SEO técnico y vista previa para redes'],
    overview:
      'Una sola página con un objetivo claro: que quien llega entienda lo que ofreces y te contacte. Se publica como sitio estático, sin servidor que mantener, y puede crecer después hacia un sitio de varias páginas.',
    problem: 'Necesitas un lugar claro al que enviar a tus clientes potenciales desde redes sociales, anuncios o tarjetas.',
    forWhom: ['Profesionales independientes', 'Lanzamientos de productos o servicios', 'Campañas puntuales'],
    modules: [
      { name: 'Propuesta de valor', desc: 'Título, beneficios y llamada a la acción principal.' },
      { name: 'Servicios u oferta', desc: 'Qué ofreces, para quién y en qué condiciones.' },
      { name: 'Contacto directo', desc: 'Correo, mensajería o formulario conectado a un servicio externo.' },
    ],
    integrations: ['Mensajería (enlace directo)', 'Proveedor de formularios', 'Analítica web'],
    includes: ['Diseño responsive', 'SEO técnico inicial', 'Metadatos para compartir en redes', 'Publicación en hosting estático'],
    optional: ['Formulario conectado a un proveedor', 'Analítica web', 'Dominio propio'],
    backend: 'no',
    external: false,
    backendNote: 'Funciona como sitio estático. Recibir datos de un formulario requiere un proveedor externo o una API.',
    tech: {
      frontend: ['Diseño responsive y contenidos', 'Botones de contacto y enlaces', 'Metadatos y SEO técnico'],
      backend: [],
      external: ['Proveedor de formularios, si se quieren recibir datos', 'Dominio y analítica, si se contratan'],
      analysis: ['Objetivo principal y mensaje', 'Textos e imágenes disponibles'],
    },
    complexity: 'Inicial',
    plan: 'standard',
    projectType: 'landing',
  },
  {
    slug: 'sitio-corporativo',
    name: 'Sitio corporativo',
    category: 'sitios-web',
    family: 'web',
    icon: 'layers',
    summary: 'Un sitio de varias páginas que explica quién es tu empresa, qué ofrece y cómo contactarla, pensado para generar confianza.',
    capabilities: ['Una página por servicio', 'Secciones de empresa y proceso', 'Formulario conectado a un servicio'],
    overview:
      'Organiza la información de la empresa en páginas claras, cada una con su propio contenido y metadatos para buscadores. Puede publicarse como sitio estático o conectarse a un gestor de contenidos si el equipo necesita editarlo sin programar.',
    problem: 'La empresa necesita transmitir confianza y explicar con detalle lo que hace, para clientes y para posibles socios.',
    forWhom: ['Empresas de servicios', 'Negocios con varias líneas de oferta', 'Organizaciones e instituciones'],
    modules: [
      { name: 'Páginas de servicios', desc: 'Una página por servicio con su propio contenido y metadatos.' },
      { name: 'Nosotros y proceso', desc: 'Cómo trabaja la empresa y qué la diferencia.' },
      { name: 'Contenido actualizable', desc: 'Estructura preparada para noticias, casos o recursos.' },
      { name: 'Contacto', desc: 'Formulario conectado a un servicio externo y canales directos.' },
    ],
    integrations: ['Gestor de contenidos', 'Proveedor de formularios', 'Analítica web', 'Mapas'],
    includes: ['Diseño personalizado', 'Mejoras SEO por página', 'Componentes reutilizables', 'Diseño responsive'],
    optional: ['Gestor de contenidos', 'Analítica web', 'Versión en otro idioma'],
    backend: 'opcional',
    external: false,
    backendNote: 'Puede publicarse como sitio estático. Editarlo sin programar o recibir formularios propios requiere servicios adicionales.',
    tech: {
      frontend: ['Páginas y navegación', 'Componentes reutilizables', 'SEO por página'],
      backend: ['Gestor de contenidos, si el equipo edita el sitio sin programar'],
      external: ['Proveedor de formularios', 'Analítica web, si se configura'],
      analysis: ['Mapa de páginas y contenidos', 'Quién actualizará el sitio y con qué frecuencia'],
    },
    complexity: 'Media',
    plan: 'pro',
    projectType: 'sitio-corporativo',
  },
  {
    slug: 'catalogo-digital',
    name: 'Catálogo digital',
    category: 'ecommerce',
    family: 'web',
    icon: 'grid',
    summary: 'Muestra tus productos con búsqueda y filtros, y deja que cada cliente consulte directamente por el artículo que le interesa.',
    capabilities: ['Búsqueda y filtros por categoría', 'Ficha por producto', 'Consulta directa desde cada ficha'],
    overview:
      'Un catálogo navegable para negocios que venden por mensajería o en tienda física. No procesa pagos: cada producto lleva a una consulta directa. Si los productos cambian a menudo, se puede añadir un panel para editarlos.',
    problem: 'Tus clientes preguntan una y otra vez por los mismos productos, precios o disponibilidad.',
    forWhom: ['Comercios con catálogo amplio', 'Distribuidores', 'Negocios que venden por mensajería'],
    modules: [
      { name: 'Catálogo con filtros', desc: 'Categorías, búsqueda y fichas de producto.' },
      { name: 'Consulta por producto', desc: 'Botón que prepara un mensaje con el producto elegido.' },
      { name: 'Gestión del catálogo', desc: 'Actualización de productos desde un archivo o un panel.' },
    ],
    integrations: ['Mensajería', 'Archivo u hoja de cálculo de productos', 'Inventario existente'],
    includes: ['Fichas de producto', 'Búsqueda y filtros', 'Diseño responsive', 'SEO por categoría'],
    optional: ['Panel para editar productos', 'Integración con inventario', 'Analítica de productos consultados'],
    backend: 'opcional',
    external: false,
    backendNote: 'Un catálogo basado en archivos puede ser estático. Editarlo desde un panel requiere backend.',
    tech: {
      frontend: ['Catálogo, búsqueda y filtros', 'Fichas de producto', 'Mensaje de consulta prellenado'],
      backend: ['Panel para editar productos, si se necesita'],
      external: ['Canal de mensajería para recibir las consultas'],
      analysis: ['Cantidad de productos y frecuencia de cambios', 'De dónde salen los datos de producto'],
    },
    complexity: 'Media',
    plan: 'pro',
    projectType: 'catalogo',
  },
  {
    slug: 'tienda-en-linea',
    name: 'Tienda en línea',
    category: 'ecommerce',
    family: 'web',
    icon: 'store',
    summary: 'Vende en internet con carrito, pedidos y pagos en línea, para comercios que quieren un canal de venta propio.',
    capabilities: ['Carrito y gestión de pedidos', 'Pagos con una pasarela autorizada', 'Panel de productos y stock'],
    overview:
      'Una tienda completa necesita más que páginas: registra pedidos, controla el stock y cobra mediante una pasarela de pago autorizada. Por eso se construye con backend, base de datos y un hosting distinto al de un sitio estático.',
    problem: 'Quieres vender en internet sin depender solo de mensajes y transferencias manuales.',
    forWhom: ['Comercios que ya venden y quieren un canal en línea', 'Marcas con productos propios'],
    modules: [
      { name: 'Catálogo y carrito', desc: 'Productos, variantes y carrito de compra.' },
      { name: 'Pedidos', desc: 'Registro y seguimiento del estado de cada pedido.' },
      { name: 'Pagos', desc: 'Integración con una pasarela de pago autorizada.' },
      { name: 'Administración', desc: 'Panel para productos, stock y pedidos.' },
    ],
    integrations: ['Pasarela de pago', 'Facturación electrónica', 'Servicios de envío', 'Inventario'],
    includes: ['Análisis de requisitos y del proveedor de pagos', 'Diseño de la experiencia de compra'],
    optional: ['Integración con inventario', 'Facturación electrónica', 'Envíos y logística'],
    backend: 'si',
    external: true,
    backendNote: 'Funciona con backend, base de datos, una pasarela de pago y un hosting que ejecute servidor.',
    tech: {
      frontend: ['Catálogo, carrito y proceso de compra', 'Seguimiento de pedidos para el cliente'],
      backend: ['Pedidos, stock y clientes', 'Confirmación segura de los pagos', 'Panel de administración'],
      external: ['Pasarela de pago', 'Envíos y facturación electrónica, si se integran'],
      analysis: ['Proveedor de pagos y sus comisiones', 'Logística de entrega y devoluciones'],
    },
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'tienda',
  },
  {
    slug: 'sistema-de-inventario',
    name: 'Sistema de inventario',
    category: 'gestion',
    family: 'empresa',
    icon: 'box',
    summary: 'Controla productos, stock y movimientos en un solo lugar, con alertas antes de quedarte sin existencias.',
    capabilities: ['Entradas, salidas y ajustes', 'Alertas de stock mínimo', 'Reportes de rotación'],
    overview:
      'Reemplaza las hojas de cálculo y los conteos manuales por un registro de cada movimiento, con usuarios y permisos. Es útil por sí solo y también como primer módulo de un ERP.',
    problem: 'No sabes con certeza cuánto stock tienes, qué se mueve más o cuándo reponer.',
    forWhom: ['Comercios y almacenes', 'Distribuidores', 'Negocios con varios puntos de venta'],
    modules: [
      { name: 'Productos y categorías', desc: 'Fichas con SKU, precios y unidades.' },
      { name: 'Movimientos', desc: 'Entradas, salidas y ajustes con historial.' },
      { name: 'Alertas', desc: 'Avisos cuando un producto baja de su mínimo.' },
      { name: 'Reportes', desc: 'Rotación, valorización y exportación.' },
    ],
    integrations: ['Ventas o punto de venta', 'Facturación', 'Lectores de código de barras'],
    includes: ['Levantamiento del proceso actual', 'Roles de usuario', 'Panel de indicadores'],
    optional: ['Lectura de códigos de barras', 'Integración con ventas o facturación', 'Varios almacenes'],
    backend: 'si',
    external: false,
    backendNote: 'Funciona con backend, base de datos y autenticación de usuarios.',
    tech: {
      frontend: ['Pantallas de productos y movimientos', 'Panel de alertas e indicadores'],
      backend: ['Base de datos de productos y movimientos', 'Usuarios, roles y permisos', 'Historial y reportes'],
      external: ['Sistemas de venta o facturación, si se integran'],
      analysis: ['Almacenes y unidades de medida', 'Datos actuales que se migrarán'],
    },
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'erp',
    demo: 'inventario',
  },
  {
    slug: 'gestion-de-proyectos',
    name: 'Gestión de proyectos',
    category: 'gestion',
    family: 'empresa',
    icon: 'kanban',
    summary: 'Reúne tareas, responsables y plazos del equipo en un tablero compartido para ver qué avanza y qué está detenido.',
    capabilities: ['Tablero por estados', 'Responsables y vencimientos', 'Avance por proyecto'],
    overview:
      'Pensado para equipos que hoy se coordinan por mensajes y hojas sueltas. Cada proyecto tiene sus tareas y responsables, y el avance se ve sin pedir reportes.',
    problem: 'Las tareas se pierden entre mensajes y nadie tiene una visión clara del avance.',
    forWhom: ['Equipos de servicios', 'Áreas internas con proyectos', 'Agencias y consultoras'],
    modules: [
      { name: 'Tablero de tareas', desc: 'Estados, responsables y prioridades.' },
      { name: 'Proyectos', desc: 'Agrupación de tareas por cliente o iniciativa.' },
      { name: 'Seguimiento', desc: 'Avance, vencimientos y carga del equipo.' },
    ],
    integrations: ['Correo para notificaciones', 'Calendario', 'Portal para clientes'],
    includes: ['Roles de usuario', 'Tablero configurable', 'Reportes de avance'],
    optional: ['Registro de horas', 'Portal para clientes', 'Notificaciones por correo'],
    backend: 'si',
    external: false,
    backendNote: 'Funciona con backend, base de datos y autenticación de usuarios.',
    tech: {
      frontend: ['Tablero, listas y filtros', 'Vistas de avance por proyecto'],
      backend: ['Proyectos, tareas y usuarios', 'Permisos por equipo', 'Notificaciones'],
      external: ['Servicio de correo, si se envían avisos'],
      analysis: ['Estados y flujo de trabajo del equipo', 'Quién puede ver cada proyecto'],
    },
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'aplicacion-web',
    demo: 'proyectos',
  },
  {
    slug: 'erp-modular',
    name: 'ERP modular',
    category: 'erp',
    family: 'empresa',
    icon: 'building',
    summary: 'Conecta inventario, compras, ventas y finanzas en un sistema que organiza las operaciones de tu empresa, módulo a módulo.',
    capabilities: ['Módulos conectados entre áreas', 'Roles y permisos por área', 'Implementación por fases'],
    overview:
      'Cuando cada área usa su propia herramienta, los datos no coinciden. Un ERP centraliza la información y se implementa por fases, empezando por el módulo que más impacto tiene en la operación.',
    problem: 'Cada área trabaja con su propia herramienta y los datos no coinciden entre ellas.',
    forWhom: ['Empresas medianas', 'Organizaciones con varias áreas operativas'],
    modules: [
      { name: 'Inventario', desc: 'Stock, almacenes y movimientos.' },
      { name: 'Compras y ventas', desc: 'Órdenes, proveedores y clientes.' },
      { name: 'Finanzas básicas', desc: 'Cuentas por cobrar y por pagar.' },
      { name: 'Reportes', desc: 'Indicadores consolidados por área.' },
    ],
    integrations: ['Facturación electrónica', 'Bancos o pasarelas de pago', 'Sistemas existentes', 'CRM'],
    includes: ['Análisis de procesos', 'Planificación por fases', 'Roles y permisos', 'Migración de datos acordada'],
    optional: ['Integración con facturación electrónica', 'Aplicación móvil', 'Integración con sistemas existentes'],
    backend: 'si',
    external: false,
    backendNote: 'Funciona con backend, base de datos, infraestructura propia y acuerdos de soporte.',
    tech: {
      frontend: ['Pantallas por módulo', 'Indicadores consolidados'],
      backend: ['Base de datos central', 'Reglas de negocio por área', 'Roles, permisos y auditoría'],
      external: ['Facturación electrónica y otros sistemas, si se integran'],
      analysis: ['Procesos de cada área', 'Orden de implementación de los módulos', 'Migración de datos'],
    },
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'erp',
    demo: 'panel',
  },
  {
    slug: 'crm-comercial',
    name: 'CRM comercial',
    category: 'crm',
    family: 'empresa',
    icon: 'users',
    summary: 'Organiza clientes, oportunidades comerciales y seguimientos en un flujo de ventas claro para todo el equipo.',
    capabilities: ['Embudo de ventas por etapas', 'Historial de cada cliente', 'Recordatorios de seguimiento'],
    overview:
      'El equipo comercial ve en qué etapa está cada oportunidad, quién la lleva y cuál es el siguiente paso. Las etapas se adaptan a la forma en que vendes hoy.',
    problem: 'Las oportunidades se olvidan, no se sabe en qué etapa está cada cliente y no hay historial.',
    forWhom: ['Equipos comerciales', 'Empresas de servicios B2B', 'Negocios con ventas consultivas'],
    modules: [
      { name: 'Contactos y empresas', desc: 'Ficha de cada cliente con su historial.' },
      { name: 'Embudo de oportunidades', desc: 'Etapas configurables y valor estimado.' },
      { name: 'Actividades', desc: 'Llamadas, reuniones y recordatorios.' },
      { name: 'Indicadores', desc: 'Conversión por etapa y por responsable.' },
    ],
    integrations: ['Correo', 'Formularios del sitio web', 'Importación desde hojas de cálculo', 'ERP'],
    includes: ['Etapas adaptadas a tu proceso', 'Roles de usuario', 'Panel de indicadores'],
    optional: ['Integración con correo', 'Importación desde hojas de cálculo', 'Integración con el sitio web'],
    backend: 'si',
    external: false,
    backendNote: 'Funciona con backend, base de datos y autenticación de usuarios.',
    tech: {
      frontend: ['Embudo, fichas y filtros', 'Indicadores comerciales'],
      backend: ['Clientes, oportunidades y actividades', 'Usuarios y permisos', 'Recordatorios'],
      external: ['Servicio de correo, si se conecta'],
      analysis: ['Etapas de venta actuales', 'Datos de clientes que se importarán'],
    },
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'crm',
    demo: 'crm',
  },
  {
    slug: 'panel-de-indicadores',
    name: 'Panel de indicadores',
    category: 'dashboards',
    family: 'empresa',
    icon: 'chart',
    summary: 'Reúne los indicadores clave del negocio en un panel con gráficos y filtros, sin armar reportes a mano cada semana.',
    capabilities: ['Indicadores con comparativas', 'Gráficos y filtros por periodo', 'Acceso por roles'],
    overview:
      'Toma los datos que ya existen en tus sistemas y los presenta de forma clara para decidir a tiempo. Su valor depende de definir bien qué medir y de dónde salen los datos.',
    problem: 'Los reportes se arman a mano cada semana y llegan tarde para tomar decisiones.',
    forWhom: ['Gerencias', 'Áreas comerciales y operativas', 'Equipos que ya tienen datos en otros sistemas'],
    modules: [
      { name: 'Indicadores principales', desc: 'Tarjetas con variaciones respecto a periodos anteriores.' },
      { name: 'Gráficos', desc: 'Tendencias, comparativas y distribución.' },
      { name: 'Filtros', desc: 'Por periodo, área, producto o responsable.' },
    ],
    integrations: ['Bases de datos existentes', 'ERP o CRM', 'Hojas de cálculo'],
    includes: ['Definición de indicadores', 'Conexión con las fuentes de datos acordadas', 'Diseño responsive'],
    optional: ['Exportación de reportes', 'Alertas por umbral', 'Acceso por roles'],
    backend: 'si',
    external: false,
    backendNote: 'Funciona con un backend o una API que acceda de forma segura a las fuentes de datos.',
    tech: {
      frontend: ['Tarjetas de indicadores', 'Gráficos y filtros'],
      backend: ['Acceso seguro a las fuentes de datos', 'Cálculo y actualización de indicadores'],
      external: ['Sistemas de los que salen los datos'],
      analysis: ['Qué indicadores medir', 'Fuentes y frecuencia de actualización'],
    },
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'dashboard',
    demo: 'analitica',
  },
  {
    slug: 'automatizacion-de-procesos',
    name: 'Automatización de procesos',
    category: 'automatizacion',
    family: 'flujo',
    icon: 'workflow',
    summary: 'Convierte tareas repetitivas en flujos que se ejecutan solos: reportes, recordatorios y traspaso de datos entre herramientas.',
    capabilities: ['Disparadores por horario o evento', 'Acciones encadenadas', 'Registro de cada ejecución'],
    overview:
      'Se parte del proceso que tu equipo ya hace a mano, se automatiza paso a paso y se deja un registro de cada ejecución para detectar fallos. Se ejecuta en un servidor o en una plataforma de automatización.',
    problem: 'Tu equipo dedica horas a copiar datos, enviar recordatorios o preparar los mismos reportes.',
    forWhom: ['Áreas administrativas', 'Equipos de operaciones', 'Negocios con varias herramientas digitales'],
    modules: [
      { name: 'Disparadores', desc: 'Horarios, eventos o cambios en otro sistema.' },
      { name: 'Acciones', desc: 'Crear registros, enviar mensajes o generar archivos.' },
      { name: 'Registro', desc: 'Historial de ejecuciones y errores.' },
    ],
    integrations: ['Correo', 'Hojas de cálculo', 'Sistemas con API', 'Mensajería'],
    includes: ['Mapeo del proceso actual', 'Pruebas con datos de ejemplo', 'Documentación de cada flujo'],
    optional: ['Panel de monitoreo', 'Alertas de fallos', 'Integraciones adicionales'],
    backend: 'si',
    external: true,
    backendNote: 'Se ejecuta en un servidor o en una plataforma de automatización, con sus propios costes.',
    tech: {
      frontend: ['Panel de monitoreo, si se necesita'],
      backend: ['Ejecución programada de los flujos', 'Reintentos y registro de errores'],
      external: ['APIs de las herramientas que se conectan', 'Plataforma de automatización, si se usa'],
      analysis: ['Pasos actuales del proceso', 'Herramientas y accesos disponibles'],
    },
    complexity: 'Media',
    plan: 'enterprise',
    projectType: 'automatizacion',
  },
  {
    slug: 'integracion-de-sistemas',
    name: 'Integración de sistemas',
    category: 'automatizacion',
    family: 'flujo',
    icon: 'plug',
    summary: 'Conecta herramientas que hoy no se comunican, como ventas, inventario o facturación, para registrar cada dato una sola vez.',
    capabilities: ['Sincronización entre sistemas', 'Validación de datos', 'Monitoreo y reintentos'],
    overview:
      'La integración lee y escribe en las APIs de cada sistema y adapta los formatos entre ellos. Antes de construirla se revisa qué permite cada API y cómo se guardan las credenciales de forma segura.',
    problem: 'La misma información se registra dos o tres veces en sistemas distintos.',
    forWhom: ['Empresas con varios sistemas', 'Negocios que crecieron con herramientas sueltas'],
    modules: [
      { name: 'Conectores', desc: 'Lectura y escritura en las APIs de cada sistema.' },
      { name: 'Transformación', desc: 'Adaptación de formatos y validaciones.' },
      { name: 'Monitoreo', desc: 'Registro de sincronizaciones y reintentos.' },
    ],
    integrations: ['Facturación', 'Inventario', 'Tienda o sitio web', 'CRM o ERP'],
    includes: ['Revisión de las APIs disponibles', 'Manejo de errores y reintentos', 'Documentación técnica'],
    optional: ['Panel de estado', 'Sincronización programada', 'Alertas'],
    backend: 'si',
    external: true,
    backendNote: 'Se ejecuta en un servidor, con las credenciales de cada sistema guardadas de forma segura.',
    tech: {
      frontend: ['Panel de estado, si se necesita'],
      backend: ['Conectores con cada API', 'Transformación y validación de datos', 'Credenciales guardadas de forma segura'],
      external: ['APIs de los sistemas que se conectan'],
      analysis: ['APIs disponibles y sus límites', 'Qué sistema manda en cada dato'],
    },
    complexity: 'Alta',
    plan: 'enterprise',
    projectType: 'integracion',
  },
  {
    slug: 'aplicacion-a-medida',
    name: 'Aplicación a medida',
    category: 'a-medida',
    family: 'flujo',
    icon: 'code',
    summary: 'Una aplicación web diseñada desde cero para un proceso o producto propio que ningún software existente cubre bien.',
    capabilities: ['Requisitos definidos contigo', 'Primera versión acotada', 'Mejoras por iteraciones'],
    overview:
      'Empieza con un análisis de usuarios y prioridades, sigue con una primera versión usable y crece por iteraciones según el uso real. La arquitectura se decide según el caso.',
    problem: 'Tu necesidad no encaja en ningún producto existente sin forzar la forma en que trabajas.',
    forWhom: ['Empresas con procesos propios', 'Productos digitales nuevos', 'Equipos que quieren reemplazar herramientas improvisadas'],
    modules: [
      { name: 'Descubrimiento', desc: 'Requisitos, usuarios y prioridades.' },
      { name: 'Producto mínimo', desc: 'Una primera versión acotada y usable.' },
      { name: 'Iteraciones', desc: 'Mejoras por fases según el uso real.' },
    ],
    integrations: ['APIs de terceros', 'Sistemas existentes', 'Aplicación móvil'],
    includes: ['Arquitectura según el caso', 'Pruebas automatizadas', 'Documentación'],
    optional: ['Aplicación móvil', 'Integraciones', 'Mantenimiento evolutivo'],
    backend: 'si',
    external: false,
    backendNote: 'Casi siempre funciona con backend, base de datos e infraestructura propia.',
    tech: {
      frontend: ['Interfaz y experiencia de uso'],
      backend: ['Lógica de negocio y datos', 'Autenticación y permisos'],
      external: ['Servicios de terceros, según el caso'],
      analysis: ['Usuarios y casos de uso', 'Alcance de la primera versión'],
    },
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

export function familyOf(id: SolutionFamily) {
  return SOLUTION_FAMILIES.find((f) => f.id === id)!;
}

export function isSolutionCategory(value: unknown): value is SolutionCategory {
  return SOLUTION_CATEGORIES.some((c) => c.id === value);
}

export const BACKEND_LABEL: Record<Solution['backend'], string> = {
  no: 'Sitio estático',
  opcional: 'Backend opcional',
  si: 'Requiere backend',
};

export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function searchText(s: Solution): string {
  return normalize(
    [
      s.name,
      categoryLabel(s.category),
      familyOf(s.family).label,
      s.summary,
      s.overview,
      s.problem,
      ...s.capabilities,
      ...s.forWhom,
      ...s.modules.flatMap((m) => [m.name, m.desc]),
      ...s.integrations,
      ...s.includes,
      ...s.optional,
    ].join(' '),
  );
}

export function matches(s: Solution, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const text = searchText(s);
  return terms.every((t) => text.includes(t));
}
