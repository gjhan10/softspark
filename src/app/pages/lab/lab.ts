import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { pageUrl, Seo } from '../../core/seo.service';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { Art, ArtName } from '../../shared/art/art';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

/** Qué se puede hacer en cada demo y con qué ilustración se presenta. */
const LAB_INFO: Record<string, { art: ArtName; tries: string[] }> = {
  panel: { art: 'dashboard', tries: ['Ver indicadores del mes', 'Revisar alertas de stock', 'Consultar pedidos recientes'] },
  crm: { art: 'support', tries: ['Mover oportunidades de etapa', 'Buscar y filtrar clientes', 'Ver el valor del pipeline'] },
  inventario: { art: 'store', tries: ['Ajustar stock', 'Registrar productos', 'Filtrar por estado'] },
  analitica: { art: 'dashboard', tries: ['Cambiar el periodo', 'Comparar canales', 'Explorar tendencias'] },
  proyectos: { art: 'app', tries: ['Mover tareas en el tablero', 'Crear tareas', 'Filtrar por responsable'] },
  erp: { art: 'erp', tries: ['Aprobar órdenes de compra', 'Registrar pagos de facturas', 'Filtrar por estado'] },
  automatizacion: { art: 'automation', tries: ['Activar o pausar flujos', 'Ejecutar un flujo paso a paso', 'Revisar el registro de ejecuciones'] },
};

@Component({
  selector: 'app-lab',
  imports: [RouterLink, Icon, Art, CtaBand, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">SoftSpark Lab</span>
        <h1>Prueba el software antes de imaginarlo.</h1>
        <p class="lead">Demos interactivas de los sistemas que construimos: navega entre módulos, cambia filtros y modifica datos. Todo funciona en tu navegador.</p>
        <p class="notice-inline"><app-icon name="info" [size]="16" /> Datos ficticios de empresas inventadas. Los cambios se guardan solo en memoria y no se conectan con ningún sistema real.</p>
      </div>
    </header>

    <section class="container section-tight">
      <div class="grid">
        @for (m of modules; track m.id; let i = $index) {
          <a class="surface-card demo" [class.feature]="i === 0" [routerLink]="['/demo', m.id]" [appReveal]="i % 3">
            <div class="art-wrap"><app-art [name]="info(m.id).art" class="art" /></div>
            <div class="copy">
              <span class="ico"><app-icon [name]="m.icon" [size]="18" /></span>
              <h2>{{ m.label }}</h2>
              <p>{{ m.desc }}</p>
              @if (info(m.id).tries.length) {
                <ul>
                  @for (t of info(m.id).tries; track t) {
                    <li><app-icon name="play" [size]="12" /> {{ t }}</li>
                  }
                </ul>
              }
              <span class="open">Abrir demo <app-icon name="arrow-right" [size]="16" class="icon-shift" /></span>
            </div>
          </a>
        }
      </div>
    </section>

    <app-cta-band title="¿Quieres algo así con tus propios procesos?" text="Las demos muestran el tipo de interfaz; cada sistema real se diseña a partir de tus requisitos." />
  `,
  styles: `
    .notice-inline { display: flex; gap: var(--s-2); align-items: flex-start; max-width: 62ch; padding: var(--s-3) var(--s-4); border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); font-size: var(--fs-sm); color: var(--text-2); }
    .notice-inline app-icon { color: var(--accent); margin-top: 2px; flex: none; }
    .grid { display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); }
    .demo { display: grid; grid-template-rows: auto 1fr; overflow: hidden; color: inherit; text-decoration: none; }
    .art-wrap { padding: var(--s-5) var(--s-5) 0; background: var(--brand-gradient-soft); border-bottom: 1px solid var(--line); }
    .art { height: 150px; }
    .copy { display: grid; gap: var(--s-2); align-content: start; padding: var(--s-5); }
    .ico { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: var(--accent-soft); color: var(--accent); }
    h2 { font-size: var(--fs-lg); letter-spacing: -0.02em; }
    .copy p { color: var(--text-2); font-size: var(--fs-sm); }
    ul { list-style: none; display: grid; gap: 4px; margin-top: var(--s-2); }
    li { display: flex; gap: var(--s-2); align-items: center; font-size: var(--fs-xs); color: var(--text-2); }
    li app-icon { color: var(--violet); }
    .open { display: inline-flex; align-items: center; gap: var(--s-1); margin-top: var(--s-3); color: var(--accent); font-weight: 600; font-size: var(--fs-sm); }
    .icon-shift { transition: transform var(--t-fast) var(--ease); }
    .demo:hover .icon-shift { transform: translateX(3px); }
    @media (min-width: 1000px) {
      .grid { grid-template-columns: repeat(3, 1fr); }
      .feature { grid-column: span 2; grid-template-rows: none; grid-template-columns: 1.2fr 1fr; }
      .feature .art-wrap { display: grid; align-items: center; padding: var(--s-6); border-bottom: 0; border-right: 1px solid var(--line); }
      .feature .art { height: 220px; }
      .feature .copy { align-content: center; padding: var(--s-6); }
      .feature h2 { font-size: var(--fs-xl); }
    }
  `,
})
export class Lab {
  protected readonly modules = DEMO_MODULES;

  constructor() {
    const seo = inject(Seo);
    seo.set({
      title: 'SoftSpark Lab',
      description: 'Demos interactivas con datos ficticios: dashboard empresarial, CRM, inventario, analítica, gestión de proyectos, ERP y automatización de procesos.',
      path: 'lab',
    });
    seo.pageData([
      {
        '@type': 'ItemList',
        name: 'Demos de SoftSpark Lab',
        itemListElement: DEMO_MODULES.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.label, url: pageUrl(`demo/${m.id}`) })),
      },
      seo.breadcrumbs([{ name: 'SoftSpark Lab', path: 'lab' }]),
    ]);
  }

  protected info(id: string) {
    return LAB_INFO[id] ?? { art: 'app' as ArtName, tries: [] };
  }
}
