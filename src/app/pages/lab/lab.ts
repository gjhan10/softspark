import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { pageUrl, Seo } from '../../core/seo.service';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

/** Qué se puede hacer en cada demo. La imagen es una captura real de la demo (public/projects/lab-<id>.webp). */
const LAB_INFO: Record<string, { tries: string[] }> = {
  panel: { tries: ['Ver indicadores del mes', 'Revisar alertas de stock', 'Consultar pedidos recientes'] },
  crm: { tries: ['Mover oportunidades de etapa', 'Buscar y filtrar clientes', 'Ver el valor del pipeline'] },
  inventario: { tries: ['Ajustar stock', 'Registrar productos', 'Filtrar por estado'] },
  analitica: { tries: ['Cambiar el periodo', 'Comparar canales', 'Explorar tendencias'] },
  proyectos: { tries: ['Mover tareas en el tablero', 'Crear tareas', 'Filtrar por responsable'] },
  erp: { tries: ['Aprobar órdenes de compra', 'Registrar pagos de facturas', 'Filtrar por estado'] },
  automatizacion: { tries: ['Activar o pausar flujos', 'Ejecutar un flujo paso a paso', 'Revisar el registro de ejecuciones'] },
};

@Component({
  selector: 'app-lab',
  imports: [RouterLink, Icon, CtaBand, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <h1>SoftSpark Lab</h1>
        <p class="lead">Demos interactivas de los sistemas que construimos: navega entre módulos, cambia filtros y modifica datos. Todo funciona en tu navegador.</p>
        <p class="notice-inline"><app-icon name="info" [size]="16" /> Datos ficticios de empresas inventadas. Los cambios se guardan solo en memoria y no se conectan con ningún sistema real.</p>
      </div>
    </header>

    <section class="container section-tight">
      <h2 class="sr-only">Demos disponibles</h2>
      <div class="grid">
        @for (m of modules; track m.id; let i = $index) {
          <a class="surface-card demo" [class.feature]="i === 0" [routerLink]="['/demo', m.id]" [appReveal]="i % 3">
            <figure class="shot"><img [src]="'projects/lab-' + m.id + '.webp'" [alt]="'Captura de la demo: ' + m.label" width="1312" height="820" loading="lazy" decoding="async" /></figure>
            <div class="copy">
              <span class="ico"><app-icon [name]="m.icon" [size]="18" /></span>
              <h3>{{ m.label }}</h3>
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
    .shot { margin: 0; border-bottom: var(--rule-hair) solid var(--color-rule); background: var(--color-paper-2); aspect-ratio: 16 / 10; overflow: hidden; }
    .shot img { width: 100%; height: 100%; object-fit: cover; object-position: top left; }
    .copy { display: grid; gap: var(--s-2); align-content: start; padding: var(--s-5); }
    .ico { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: var(--accent-soft); color: var(--accent); }
    h3 { font-size: var(--text-title); }
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
      .feature .shot { aspect-ratio: auto; border-bottom: 0; border-right: var(--rule-hair) solid var(--color-rule); }
      .feature .copy { align-content: center; padding: var(--s-6); }
      .feature h3 { font-size: var(--text-section); }
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
    return LAB_INFO[id] ?? { tries: [] };
  }
}
