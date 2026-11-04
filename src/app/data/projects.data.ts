import type { ArtName } from '../shared/art/art';

/**
 * Portfolio. Regla: nada de clientes inventados.
 * - `publicado`: proyecto real y en línea, construido por el equipo de SoftSpark.
 * - `concepto`: caso de estudio ilustrativo con una demo o un mockup; no es un trabajo entregado.
 */
export type ProjectKind = 'publicado' | 'concepto';

export type ProjectCategory = 'Web corporativa' | 'E-commerce' | 'Dashboard' | 'ERP' | 'CRM' | 'Aplicación web' | 'Automatización';

export interface Project {
  slug: string;
  name: string;
  kind: ProjectKind;
  category: ProjectCategory;
  summary: string;
  /** Quién lo hizo o para quién es, dicho con honestidad. */
  context: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  /** Capturas reales (rutas dentro de public/). */
  images?: { desktop?: string; mobile?: string; alt: string };
  /** Mockup cuando no hay capturas reales: slug de una solución del catálogo. */
  preview?: string;
  art: ArtName;
  links: { label: string; href: string; external?: boolean }[];
}

export const PROJECT_CATEGORIES: ProjectCategory[] = ['Web corporativa', 'E-commerce', 'Dashboard', 'ERP', 'CRM', 'Aplicación web', 'Automatización'];

export const PROJECTS: Project[] = [
  {
    slug: 'apuntes-java-backend',
    name: 'Apuntes interactivos de Java backend',
    kind: 'publicado',
    category: 'Aplicación web',
    summary: 'Plataforma educativa con 5 rutas y 192 lecciones de Java, Spring Boot, WebFlux, patrones de diseño y microservicios.',
    context: 'Proyecto propio de Jhan Gutierrez, fundador de SoftSpark. Publicado y en uso.',
    problem: 'El material para aprender Java backend suele estar disperso, sin práctica guiada y sin forma de saber cuánto se ha avanzado. Además, el contenido de una aplicación de una sola página no siempre es visible para los buscadores.',
    solution: 'Una aplicación web estática donde cada lección tiene su propia URL prerenderizada, con ejemplos que se pueden editar y ejecutar, evaluaciones con la respuesta explicada y el progreso guardado en el navegador, sin necesidad de cuentas ni servidor.',
    features: [
      'Una página prerenderizada por lección, con datos estructurados para buscadores',
      'Editor de Java con ejecución real en OpenJDK 21',
      'Evaluaciones con puntuación y mejor resultado guardado',
      'Progreso y "continuar donde lo dejé" sin registro',
      'Tema claro y oscuro, diseño responsive y navegación por teclado',
      'Pruebas automatizadas y despliegue continuo',
    ],
    tech: ['Angular 21', 'TypeScript', 'Prerender (SSG)', 'SCSS', 'Karma y Jasmine', 'GitHub Actions', 'GitHub Pages'],
    images: {
      desktop: 'projects/apuntes-leccion-desktop.webp',
      mobile: 'projects/apuntes-curso-mobile.webp',
      alt: 'Lección «Variables y tipos» del curso de Java en escritorio y ficha del curso de Spring Boot en móvil',
    },
    art: 'code',
    links: [{ label: 'Abrir la plataforma', href: 'https://gjhan10.github.io/blog-personal/java-backend/', external: true }],
  },
  {
    slug: 'sitio-softspark',
    name: 'Sitio web de SoftSpark',
    kind: 'publicado',
    category: 'Web corporativa',
    summary: 'El sitio que estás viendo: catálogo de soluciones, demos interactivas, asistente de orientación y configurador de proyectos.',
    context: 'Proyecto propio de SoftSpark. Publicado.',
    problem: 'Explicar servicios técnicos a negocios que no conocen los términos (ERP, CRM, API) y recibir solicitudes de cotización bien definidas, sin depender de un servidor propio.',
    solution: 'Un sitio estático y rápido, con contenido comercial centralizado en datos, demos que funcionan en el navegador, un asistente que orienta según el caso y un configurador que arma la solicitud paso a paso.',
    features: [
      'Diseño propio con tema claro y oscuro',
      'Catálogo de 12 soluciones con fichas detalladas',
      'SoftSpark Lab: demos de ERP, CRM, inventario, analítica y más',
      'Configurador de proyectos en cinco pasos',
      'SEO técnico, datos estructurados y sitemap',
      'Pruebas unitarias y despliegue automático',
    ],
    tech: ['Angular 21', 'TypeScript', 'Signals', 'Prerender (SSG)', 'SCSS', 'Vitest', 'GitHub Pages'],
    images: {
      desktop: 'projects/softspark-inicio-desktop.webp',
      mobile: 'projects/softspark-inicio-mobile.webp',
      alt: 'Inicio del sitio de SoftSpark en escritorio y en móvil',
    },
    art: 'web',
    links: [{ label: 'Ver el inicio', href: '/' }],
  },
  {
    slug: 'erp-distribuidora',
    name: 'ERP para una distribuidora',
    kind: 'concepto',
    category: 'ERP',
    summary: 'Compras, facturación e inventario de una distribuidora en un solo sistema, con indicadores para decidir a tiempo.',
    context: 'Caso conceptual con datos ficticios. Puedes probar una versión de demostración en el Lab.',
    problem: 'Las compras se aprueban por mensajes, las facturas se controlan en hojas de cálculo y nadie sabe con certeza qué está por cobrar o qué producto se está agotando.',
    solution: 'Un ERP modular con flujo de aprobación de órdenes de compra, control de facturas por estado y alertas de stock, implementado por fases empezando por el módulo más urgente.',
    features: ['Órdenes de compra con estados y aprobación', 'Facturas pendientes, vencidas y pagadas', 'Alertas de stock mínimo', 'Roles por área', 'Reportes exportables'],
    tech: ['Angular', 'Spring Boot', 'SQL Server', 'APIs REST', 'Docker'],
    preview: 'erp-modular',
    art: 'erp',
    links: [
      { label: 'Probar la demo de ERP', href: '/demo/erp' },
      { label: 'Ver la solución', href: '/soluciones/erp-modular' },
    ],
  },
  {
    slug: 'crm-equipo-comercial',
    name: 'CRM para un equipo comercial',
    kind: 'concepto',
    category: 'CRM',
    summary: 'Oportunidades por etapa, seguimiento de clientes y una vista clara del embudo de ventas.',
    context: 'Caso conceptual con datos ficticios. La demo del CRM está en el Lab.',
    problem: 'Cada vendedor lleva sus clientes a su manera y las oportunidades se pierden porque nadie ve en qué etapa está cada una.',
    solution: 'Un CRM con embudo por etapas, búsqueda y filtros, historial por cliente y paneles para el responsable comercial.',
    features: ['Embudo de oportunidades por etapa', 'Búsqueda y filtros', 'Historial por cliente', 'Valor del pipeline en tiempo real'],
    tech: ['Angular', 'Spring Boot', 'APIs REST', 'Base de datos relacional'],
    preview: 'crm-comercial',
    art: 'support',
    links: [
      { label: 'Probar la demo de CRM', href: '/demo/crm' },
      { label: 'Ver la solución', href: '/soluciones/crm-comercial' },
    ],
  },
  {
    slug: 'panel-indicadores',
    name: 'Panel de indicadores para gerencia',
    kind: 'concepto',
    category: 'Dashboard',
    summary: 'Ventas, canales y tendencias en un panel que reemplaza los reportes armados a mano.',
    context: 'Caso conceptual con datos ficticios. Explora el panel de análisis en el Lab.',
    problem: 'Los reportes se arman a mano cada mes, llegan tarde y cada área calcula los indicadores de forma distinta.',
    solution: 'Un dashboard que lee los datos de los sistemas existentes y muestra indicadores consistentes por periodo y canal.',
    features: ['Indicadores por periodo', 'Comparación por canal', 'Gráficos interactivos', 'Definición única de cada indicador'],
    tech: ['Angular', 'APIs REST', 'Spring Boot', 'SQL'],
    preview: 'panel-de-indicadores',
    art: 'dashboard',
    links: [
      { label: 'Probar el panel de análisis', href: '/demo/analitica' },
      { label: 'Ver la solución', href: '/soluciones/panel-de-indicadores' },
    ],
  },
  {
    slug: 'automatizacion-facturas',
    name: 'Automatización de facturación y avisos',
    kind: 'concepto',
    category: 'Automatización',
    summary: 'Flujos que generan documentos, envían avisos y registran cada ejecución sin intervención manual.',
    context: 'Caso conceptual con datos ficticios. Ejecuta los flujos de ejemplo en el Lab.',
    problem: 'Alguien del equipo dedica horas cada semana a copiar datos entre sistemas, generar documentos y avisar a los clientes.',
    solution: 'Flujos programados o activados por eventos que hacen esas tareas, con registro de cada ejecución y alertas cuando algo falla.',
    features: ['Disparadores por horario o evento', 'Pasos encadenados', 'Registro de ejecuciones', 'Alertas de error'],
    tech: ['Spring Boot', 'APIs REST', 'Tareas programadas', 'Integraciones'],
    preview: 'automatizacion-de-procesos',
    art: 'automation',
    links: [
      { label: 'Probar la demo de automatización', href: '/demo/automatizacion' },
      { label: 'Ver la solución', href: '/soluciones/automatizacion-de-procesos' },
    ],
  },
  {
    slug: 'tienda-en-linea',
    name: 'Tienda en línea con catálogo',
    kind: 'concepto',
    category: 'E-commerce',
    summary: 'Catálogo con filtros, carrito y pedidos conectados al inventario.',
    context: 'Caso conceptual: mockup ilustrativo, sin demo interactiva.',
    problem: 'Las ventas por redes sociales y mensajes no escalan: se pierden pedidos y el stock nunca coincide.',
    solution: 'Una tienda con catálogo administrable, carrito y pasarela de pago de un proveedor externo, conectada al inventario.',
    features: ['Catálogo con filtros', 'Carrito y checkout', 'Pagos mediante un proveedor externo', 'Panel de pedidos'],
    tech: ['Angular', 'Spring Boot', 'Pasarela de pagos externa', 'SQL'],
    preview: 'tienda-en-linea',
    art: 'store',
    links: [{ label: 'Ver la solución', href: '/soluciones/tienda-en-linea' }],
  },
];

export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
