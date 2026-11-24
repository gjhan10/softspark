import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { findPlan } from '../../data/plans.data';
import { SERVICES } from '../../data/services.data';
import { SOLUTIONS } from '../../data/solutions.data';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-services',
  imports: [RouterLink, Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <h1>Servicios</h1>
        <p class="lead">Desde una página que te hace visible hasta un sistema que ordena toda la operación. Elige por dónde empezar.</p>
      </div>
    </header>

    <div class="container layout">
      <nav class="toc" aria-label="Servicios en esta página">
        <span class="toc-title">Detalle por servicio</span>
        <ul>
          @for (s of services; track s.id) {
            <li><a [href]="'servicios#' + s.id" (click)="go($event, s.id)">{{ s.name }}</a></li>
          }
        </ul>
      </nav>

      <div class="list">
        @for (s of services; track s.id; let i = $index) {
          <article class="svc" [id]="s.id" [attr.aria-labelledby]="s.id + '-t'" appReveal>
            <div class="svc-head">
              <div>
                <h2 [id]="s.id + '-t'">{{ s.name }}</h2>
                <p class="tagline">{{ s.tagline }}</p>
              </div>
            </div>
            <div class="ba">
              <p class="was"><span class="side">Hoy</span>{{ s.before }}</p>
              <p class="now"><span class="side">Con SoftSpark</span>{{ s.benefit }}</p>
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

    <div class="container assist">
      <p>¿No sabes cuál necesitas? <a routerLink="/que-necesito" class="link">Cuéntaselo a Spark Assistant</a></p>
    </div>
  `,
  styles: `
    .ba { display: grid; border-radius: var(--radius-input); overflow: hidden; border: var(--rule-hair) solid var(--color-rule); }
    .ba p { display: grid; gap: var(--space-2xs); margin: 0; padding: var(--space-md) var(--space-lg); }
    .ba .side { font-size: var(--text-sm); color: var(--color-muted); }
    .was { background: var(--color-paper-2); color: var(--color-ink-2); }
    .now { background: var(--color-field); color: var(--color-field-ink); font-weight: 500; }
    .now .side { color: var(--color-field-muted); font-weight: 400; }
    @media (min-width: 700px) { .ba { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
    .assist { padding-bottom: var(--s-8); color: var(--color-ink-2); }

    .layout { display: grid; gap: var(--s-6); padding-block: var(--s-6); }
    .toc { display: none; }
    .toc-title { font: 500 var(--fs-2xs) var(--font-display); color: var(--text-3); }
    .toc ul { list-style: none; display: grid; gap: 2px; margin-top: var(--s-3); border-left: 1px solid var(--line); }
    .toc a { display: block; padding: var(--s-2) var(--s-4); color: var(--text-2); text-decoration: none; font-size: var(--fs-sm); margin-left: -1px; border-left: 1px solid transparent; }
    .toc a:hover { color: var(--text); border-left-color: var(--accent); }
    .list { display: grid; gap: var(--s-5); min-width: 0; }
    .svc { display: grid; gap: var(--s-5); padding: clamp(20px, 4vw, 36px); border: 1px solid var(--line); border-radius: var(--r-xl); background: var(--surface); scroll-margin-top: calc(var(--header-h) + 20px); }
    .svc:target, .svc:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 4px var(--accent-soft); }
    .svc-head { display: grid; gap: var(--s-4); }
    .num { font: 500 var(--fs-xs) var(--font-display); color: var(--text-3); }
    .svc h2 { font-size: var(--text-section); margin: 2px 0 var(--s-2); }
    .tagline { color: var(--text-2); font-size: var(--fs-md); }
    .facts { margin: 0; display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); }
    .facts > div { padding-top: var(--s-3); border-top: 1px solid var(--line); }
    dt { font: 500 var(--fs-2xs) var(--font-display); color: var(--text-3); margin-bottom: var(--s-2); }
    dd { margin: 0; color: var(--text-2); }
    .feat h3 { font-size: var(--fs-base); margin-bottom: var(--s-3); }
    .feat .check-list { grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
    .rel { display: flex; flex-wrap: wrap; gap: var(--s-2); align-items: center; font-size: var(--fs-sm); color: var(--text-3); }
    .rel a { text-decoration: none; }
    .rel a:hover { color: var(--text); border-color: var(--text-3); }
    .svc-cta { padding-top: var(--s-4); border-top: 1px solid var(--line); }
    @media (min-width: 1080px) {
      .layout { grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); }
      .toc { display: block; position: sticky; top: calc(var(--header-h) + 32px); align-self: start; }
    }
  `,
})
export class Services {
  protected readonly services = SERVICES;

  constructor() {
    inject(Seo).set({
      title: 'Servicios',
      description: 'Web esencial, web comercial, aplicaciones web, sistemas empresariales, automatización y software a medida: qué resuelve cada servicio, para quién es y qué incluye.',
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
