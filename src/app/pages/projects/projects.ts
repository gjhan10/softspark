import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { PROJECT_CATEGORIES, PROJECTS, ProjectCategory } from '../../data/projects.data';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { ProjectVisual } from '../../shared/project-visual/project-visual';
import { Reveal } from '../../shared/reveal/reveal';

type Filter = 'Todos' | ProjectCategory;

@Component({
  selector: 'app-projects',
  imports: [RouterLink, Icon, CtaBand, ProjectVisual, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Proyectos</span>
        <h1>De ideas a productos digitales.</h1>
        <p class="lead">Proyectos publicados y casos conceptuales. Cada uno indica qué es: no mostramos clientes ni resultados que no podamos respaldar.</p>
      </div>
    </header>

    <section class="container section-tight">
      <div class="chips filters" role="group" aria-label="Filtrar por categoría">
        @for (f of filters; track f) {
          <button type="button" class="chip" [attr.aria-pressed]="active() === f" (click)="active.set(f)">{{ f }} <span class="count">{{ count(f) }}</span></button>
        }
      </div>
      <p class="sr-only" aria-live="polite">{{ visible().length }} proyectos</p>

      @if (published().length) {
        <h2 class="group-t"><span class="dot pub"></span> Publicados</h2>
        <div class="grid">
          @for (p of published(); track p.slug; let i = $index) {
            <a class="surface-card card big" [routerLink]="['/proyectos', p.slug]" [appReveal]="i">
              <app-project-visual [project]="p" class="vis" />
              <div class="copy">
                <div class="meta"><span class="badge pub">Publicado</span><span>{{ p.category }}</span></div>
                <h3>{{ p.name }}</h3>
                <p>{{ p.summary }}</p>
                <ul class="tech">@for (t of p.tech.slice(0, 4); track t) {<li>{{ t }}</li>}</ul>
                <span class="more">Ver el caso <app-icon name="arrow-right" [size]="16" class="icon-shift" /></span>
              </div>
            </a>
          }
        </div>
      }

      @if (concepts().length) {
        <h2 class="group-t"><span class="dot"></span> Casos conceptuales</h2>
        <p class="group-p">Ejemplos de lo que podemos construir, con datos ficticios. Varios tienen una demo que puedes probar en el Lab.</p>
        <div class="grid two">
          @for (p of concepts(); track p.slug; let i = $index) {
            <a class="surface-card card" [routerLink]="['/proyectos', p.slug]" [appReveal]="i % 2">
              <app-project-visual [project]="p" class="vis" />
              <div class="copy">
                <div class="meta"><span class="badge">Concepto</span><span>{{ p.category }}</span></div>
                <h3>{{ p.name }}</h3>
                <p>{{ p.summary }}</p>
                <span class="more">Ver el caso <app-icon name="arrow-right" [size]="16" class="icon-shift" /></span>
              </div>
            </a>
          }
        </div>
      }

      @if (!visible().length) {
        <div class="empty"><app-icon name="search" [size]="28" /><strong>Todavía no hay proyectos en esta categoría</strong><p>Prueba con otra o cuéntanos tu caso.</p></div>
      }
    </section>

    <app-cta-band title="¿Tu proyecto podría ser el siguiente?" text="Cuéntanos qué necesitas y te proponemos un alcance a medida." />
  `,
  styles: `
    .filters { margin-bottom: var(--s-6); }
    .count { margin-left: 4px; font: 500 var(--fs-label) var(--font-mono); color: var(--text-3); }
    .group-t { display: flex; align-items: center; gap: var(--s-3); font-size: var(--fs-xl); margin: var(--s-6) 0 var(--s-3); }
    .group-p { color: var(--text-2); margin: calc(var(--s-2) * -1) 0 var(--s-5); max-width: 62ch; }
    .dot { width: 10px; height: 10px; border-radius: 50%; border: 2px dashed var(--text-3); }
    .dot.pub { border: 0; background: var(--ok); box-shadow: 0 0 0 4px var(--ok-soft); }
    .grid { display: grid; gap: var(--s-5); }
    .card { display: grid; overflow: hidden; color: inherit; text-decoration: none; }
    .vis { background: var(--brand-gradient-soft); border-bottom: 1px solid var(--line); }
    .copy { display: grid; gap: var(--s-3); align-content: center; padding: var(--s-5) var(--s-6) var(--s-6); }
    .meta { display: flex; flex-wrap: wrap; gap: var(--s-3); align-items: center; font: 500 var(--fs-label) var(--font-mono); text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); }
    .badge { padding: 3px 9px; border-radius: var(--r-pill); border: 1px dashed var(--line-strong); color: var(--text-2); }
    .badge.pub { border: 0; background: var(--ok-soft); color: var(--ok); }
    h3 { font-size: clamp(1.35rem, 2.4vw, 1.75rem); letter-spacing: -0.03em; }
    .copy p { color: var(--text-2); }
    .tech { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
    .tech li { padding: 3px 9px; border-radius: var(--r-pill); background: var(--surface-2); border: 1px solid var(--line); font-size: var(--fs-2xs); color: var(--text-2); }
    .more { display: inline-flex; align-items: center; gap: var(--s-1); color: var(--accent); font-weight: 600; font-size: var(--fs-sm); }
    .icon-shift { transition: transform var(--t-fast) var(--ease); }
    .card:hover .icon-shift { transform: translateX(3px); }
    .card:hover .vis { transform: none; }
    @media (min-width: 900px) {
      .big { grid-template-columns: 1.25fr 1fr; }
      .big .vis { border-bottom: 0; border-right: 1px solid var(--line); }
      .two { grid-template-columns: 1fr 1fr; }
    }
  `,
})
export class Projects {
  protected readonly filters: Filter[] = ['Todos', ...PROJECT_CATEGORIES.filter((c) => PROJECTS.some((p) => p.category === c))];
  protected readonly active = signal<Filter>('Todos');
  protected readonly visible = computed(() => PROJECTS.filter((p) => this.active() === 'Todos' || p.category === this.active()));
  protected readonly published = computed(() => this.visible().filter((p) => p.kind === 'publicado'));
  protected readonly concepts = computed(() => this.visible().filter((p) => p.kind === 'concepto'));

  constructor() {
    const seo = inject(Seo);
    seo.set({
      title: 'Proyectos',
      description: 'Proyectos publicados por SoftSpark y casos conceptuales de ERP, CRM, dashboards, automatización y e-commerce, con el problema, la solución y la tecnología de cada uno.',
      path: 'proyectos',
    });
    seo.pageData(seo.breadcrumbs([{ name: 'Proyectos', path: 'proyectos' }]));
  }

  protected count(f: Filter): number {
    return f === 'Todos' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
  }
}
