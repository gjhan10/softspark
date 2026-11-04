import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { pageUrl, Seo } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { findProject, PROJECTS } from '../../data/projects.data';
import { Art } from '../../shared/art/art';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { ProjectVisual } from '../../shared/project-visual/project-visual';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, Icon, CtaBand, ProjectVisual, Art, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as p) {
      <header class="page-head head">
        <div class="container head-grid">
          <div class="head-copy">
            <nav class="crumbs" aria-label="Ruta de navegación"><a routerLink="/proyectos"><app-icon name="arrow-left" [size]="16" /> Proyectos</a></nav>
            <div class="meta">
              <span class="badge" [class.pub]="p.kind === 'publicado'">{{ p.kind === 'publicado' ? 'Publicado' : 'Caso conceptual' }}</span>
              <span>{{ p.category }}</span>
            </div>
            <h1>{{ p.name }}</h1>
            <p class="lead">{{ p.summary }}</p>
            <p class="context"><app-icon name="info" [size]="16" /> {{ p.context }}</p>
            <div class="links">
              @for (l of p.links; track l.href; let first = $first) {
                @if (l.external) {
                  <a [href]="l.href" target="_blank" rel="noopener" class="btn" [class.btn-brand]="first" [class.btn-secondary]="!first">{{ l.label }} <app-icon name="arrow-up-right" [size]="16" /><span class="sr-only"> (se abre en una pestaña nueva)</span></a>
                } @else {
                  <a [routerLink]="l.href" class="btn" [class.btn-brand]="first" [class.btn-secondary]="!first">{{ l.label }} <app-icon name="arrow-right" [size]="16" class="icon-shift" /></a>
                }
              }
            </div>
          </div>
          <app-project-visual [project]="p" [eager]="true" class="vis rise" style="--i: 1" />
        </div>
      </header>

      <section class="container section-tight body">
        <div class="ps">
          <article class="surface-card block" appReveal>
            <app-art name="adapt" class="mini" />
            <h2>El problema</h2>
            <p>{{ p.problem }}</p>
          </article>
          <article class="surface-card block sol" appReveal="1">
            <app-art [name]="p.art" class="mini" />
            <h2>La solución</h2>
            <p>{{ p.solution }}</p>
          </article>
        </div>

        <div class="two">
          <div appReveal>
            <h2>Funcionalidades</h2>
            <ul class="check-list">
              @for (f of p.features; track f) {
                <li><app-icon name="check" [size]="16" /> {{ f }}</li>
              }
            </ul>
          </div>
          <div appReveal="1">
            <h2>{{ p.kind === 'publicado' ? 'Tecnologías' : 'Stack propuesto' }}</h2>
            <ul class="tech">
              @for (t of p.tech; track t) {
                <li>{{ t }}</li>
              }
            </ul>
          </div>
        </div>

        @if (next(); as n) {
          <a class="surface-card next" [routerLink]="['/proyectos', n.slug]">
            <small>Siguiente proyecto</small>
            <strong>{{ n.name }}</strong>
            <app-icon name="arrow-right" [size]="20" class="icon-shift" />
          </a>
        }
      </section>

      <app-cta-band title="¿Necesitas algo parecido?" text="Cuéntanos tu caso y lo adaptamos a cómo trabaja tu negocio." />
    } @else {
      <section class="container section">
        <div class="empty">
          <app-icon name="search" [size]="28" />
          <strong>Este proyecto no existe</strong>
          <a routerLink="/proyectos" class="btn btn-secondary btn-sm">Ver todos los proyectos</a>
        </div>
      </section>
    }
  `,
  styles: `
    .head-grid { display: grid; gap: var(--s-7); align-items: center; }
    .head-copy { display: grid; gap: var(--s-4); justify-items: start; }
    .crumbs a { display: inline-flex; align-items: center; gap: var(--s-2); color: var(--text-2); text-decoration: none; font-size: var(--fs-sm); }
    .crumbs a:hover { color: var(--accent); }
    .meta { display: flex; gap: var(--s-3); align-items: center; font: 500 var(--fs-label) var(--font-mono); text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); }
    .badge { padding: 3px 9px; border-radius: var(--r-pill); border: 1px dashed var(--line-strong); color: var(--text-2); }
    .badge.pub { border: 0; background: var(--ok-soft); color: var(--ok); }
    .context { display: flex; gap: var(--s-2); align-items: flex-start; font-size: var(--fs-sm); color: var(--text-2); }
    .context app-icon { color: var(--accent); margin-top: 3px; flex: none; }
    .links { display: flex; flex-wrap: wrap; gap: var(--s-3); }
    .vis { min-width: 0; }
    .body { display: grid; gap: var(--s-7); }
    .ps { display: grid; gap: var(--s-4); }
    .block { display: grid; gap: var(--s-3); align-content: start; padding: var(--s-6); }
    .block h2, .two h2 { font-size: var(--fs-xl); }
    .block p { color: var(--text-2); }
    .mini { height: 110px; width: 160px; margin-bottom: var(--s-2); }
    .sol { border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); box-shadow: 0 0 0 4px var(--accent-soft); }
    .two { display: grid; gap: var(--s-6); }
    .two h2 { margin-bottom: var(--s-4); }
    .check-list app-icon { color: var(--ok); }
    .tech { display: flex; flex-wrap: wrap; gap: var(--s-2); list-style: none; }
    .tech li { padding: 6px 12px; border-radius: var(--r-pill); border: 1px solid var(--line); background: var(--surface); font-size: var(--fs-sm); }
    .next { display: grid; grid-template-columns: 1fr auto; gap: 2px var(--s-4); align-items: center; padding: var(--s-5) var(--s-6); color: inherit; text-decoration: none; }
    .next small { color: var(--text-3); font: 500 var(--fs-label) var(--font-mono); text-transform: uppercase; letter-spacing: .08em; }
    .next strong { grid-row: 2; font-size: var(--fs-lg); }
    .next app-icon { grid-row: 1 / span 2; grid-column: 2; color: var(--accent); }
    .icon-shift { transition: transform var(--t-fast) var(--ease); }
    .next:hover .icon-shift, .btn:hover .icon-shift { transform: translateX(3px); }
    @media (min-width: 900px) {
      .ps, .two { grid-template-columns: 1fr 1fr; }
    }
    @media (min-width: 1000px) {
      .head-grid { grid-template-columns: 1fr 1.1fr; }
    }
  `,
})
export class ProjectDetail {
  readonly slug = input<string>('');
  protected readonly project = computed(() => findProject(this.slug()));
  protected readonly next = computed(() => {
    const i = PROJECTS.findIndex((p) => p.slug === this.slug());
    return i < 0 ? undefined : PROJECTS[(i + 1) % PROJECTS.length];
  });

  constructor() {
    const seo = inject(Seo);
    effect(() => {
      const p = this.project();
      if (!p) {
        seo.set({ title: 'Proyecto no encontrado', description: 'El proyecto que buscas no existe.', path: 'proyectos', noindex: true });
        return;
      }
      const path = `proyectos/${p.slug}`;
      seo.set({ title: p.name, description: p.summary, path });
      seo.pageData([
        {
          '@type': 'CreativeWork',
          name: p.name,
          description: p.summary,
          url: pageUrl(path),
          genre: p.category,
          creator: { '@type': 'Organization', name: SITE.name, url: `${SITE.siteUrl}/` },
          keywords: p.tech.join(', '),
          ...(p.images?.desktop ? { image: `${SITE.siteUrl}/${p.images.desktop}` } : {}),
        },
        seo.breadcrumbs([
          { name: 'Proyectos', path: 'proyectos' },
          { name: p.name, path },
        ]),
      ]);
    });
  }
}
