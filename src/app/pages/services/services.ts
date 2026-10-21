import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { findPlan } from '../../data/plans.data';
import { SERVICES } from '../../data/services.data';
import { SOLUTIONS } from '../../data/solutions.data';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-services',
  imports: [RouterLink, Icon, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Servicios</span>
        <h1>Seis formas de llevar tu negocio al siguiente nivel</h1>
        <p class="lead">Cada línea de servicio explica qué resuelve, para quién es, qué puede incluir y qué tipo de proyecto representa.</p>
      </div>
    </header>

    <div class="container layout">
      <nav class="toc" aria-label="Servicios en esta página">
        <span class="toc-title">En esta página</span>
        <ul>
          @for (s of services; track s.id) {
            <li><a [href]="'servicios#' + s.id" (click)="go($event, s.id)">{{ s.name }}</a></li>
          }
        </ul>
      </nav>

      <div class="list">
        @for (s of services; track s.id; let i = $index) {
          <article class="svc" [id]="s.id" [attr.aria-labelledby]="s.id + '-t'">
            <div class="svc-head">
              <span class="ico"><app-icon [name]="s.icon" [size]="24" /></span>
              <div>
                <span class="num">0{{ i + 1 }}</span>
                <h2 [id]="s.id + '-t'">{{ s.name }}</h2>
                <p class="tagline">{{ s.tagline }}</p>
              </div>
            </div>
            <dl class="facts">
              <div><dt>Qué resuelve</dt><dd>{{ s.solves }}</dd></div>
              <div><dt>Para quién es</dt><dd>{{ s.forWhom }}</dd></div>
              <div><dt>Tipo de proyecto</dt><dd>{{ s.projectKind }}</dd></div>
              <div><dt>Plan de referencia</dt><dd><a routerLink="/planes" class="link">{{ plan(s.plan) }}</a></dd></div>
            </dl>
            <div class="feat">
              <h3>Funcionalidades que puede incluir</h3>
              <ul class="check-list">
                @for (f of s.features; track f) {
                  <li><app-icon name="check" [size]="16" /> {{ f }}</li>
                }
              </ul>
            </div>
            @if (related(s.solutionCategory).length) {
              <div class="rel">
                <span>Soluciones relacionadas:</span>
                @for (r of related(s.solutionCategory); track r.slug) {
                  <a [routerLink]="['/soluciones', r.slug]" class="tag">{{ r.name }}</a>
                }
              </div>
            }
            <div class="svc-cta">
              <a routerLink="/contacto" [queryParams]="{ tipo: s.projectType, plan: s.plan }" class="btn btn-primary">Solicitar información <app-icon name="arrow-right" [size]="18" class="icon-shift" /></a>
            </div>
          </article>
        }
      </div>
    </div>

    <app-cta-band title="¿No sabes cuál de estos servicios necesitas?" text="Responde siete preguntas y obtén una recomendación orientativa, o cuéntanos tu caso directamente." />
  `,
  styles: `
    .layout { display: grid; gap: var(--s-6); padding-block: var(--s-8); }
    .toc { display: none; }
    .toc-title { font: 500 0.75rem var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); }
    .toc ul { list-style: none; display: grid; gap: 2px; margin-top: 12px; border-left: 1px solid var(--line); }
    .toc a { display: block; padding: 6px 14px; color: var(--text-2); text-decoration: none; font-size: 0.93rem; margin-left: -1px; border-left: 1px solid transparent; }
    .toc a:hover { color: var(--text); border-left-color: var(--accent); }
    .list { display: grid; gap: var(--s-5); min-width: 0; }
    .svc { display: grid; gap: var(--s-5); padding: clamp(20px, 4vw, 36px); border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); scroll-margin-top: calc(var(--header-h) + 20px); }
    .svc:target { border-color: var(--accent); }
    .svc-head { display: grid; grid-template-columns: auto 1fr; gap: var(--s-4); align-items: start; }
    .ico { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 14px; background: var(--accent-soft); color: var(--accent); }
    .num { font: 500 0.8rem var(--font-mono); color: var(--text-3); }
    h2 { font-size: clamp(1.5rem, 2.6vw, 1.9rem); margin: 2px 0 6px; }
    .tagline { color: var(--text-2); font-size: 1.05rem; }
    .facts { margin: 0; display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); }
    .facts > div { padding-top: 12px; border-top: 1px solid var(--line); }
    dt { font: 500 0.75rem var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-3); margin-bottom: 6px; }
    dd { margin: 0; color: var(--text-2); }
    .feat h3 { font-size: 1rem; margin-bottom: 12px; }
    .feat .check-list { grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
    .rel { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.9rem; color: var(--text-3); }
    .rel a { text-decoration: none; }
    .rel a:hover { color: var(--text); border-color: var(--text-3); }
    .svc-cta { padding-top: var(--s-4); border-top: 1px solid var(--line); }
    @media (min-width: 1080px) {
      .layout { grid-template-columns: 220px 1fr; }
      .toc { display: block; position: sticky; top: calc(var(--header-h) + 32px); align-self: start; }
    }
  `,
})
export class Services {
  protected readonly services = SERVICES;

  constructor() {
    inject(Seo).set({
      title: 'Servicios',
      description: 'Web esencial, web comercial, aplicaciones web, sistemas empresariales, automatización y software a medida: qué resuelve cada servicio y para quién es.',
      path: 'servicios',
    });
  }

  protected plan(id: Parameters<typeof findPlan>[0]): string {
    return findPlan(id).name;
  }

  protected related(category: string) {
    return SOLUTIONS.filter((s) => s.category === category).slice(0, 3);
  }

  protected go(event: Event, id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', `${location.pathname}#${id}`);
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
}
