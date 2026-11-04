import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { findPlan } from '../../data/plans.data';
import { SERVICES } from '../../data/services.data';
import { SOLUTIONS } from '../../data/solutions.data';
import { Art } from '../../shared/art/art';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-services',
  imports: [RouterLink, Icon, CtaBand, Art, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Servicios</span>
        <h1>Seis formas de llevar tu negocio al siguiente nivel</h1>
        <p class="lead">Desde una página que te hace visible hasta un sistema que ordena toda la operación. Elige por dónde empezar.</p>
      </div>
    </header>

    <section class="container section-tight" aria-label="Resumen de servicios">
      <div class="bento">
        @for (s of services; track s.id; let i = $index) {
          <a class="surface-card cell" [class]="'c' + i" [href]="'servicios#' + s.id" (click)="go($event, s.id)" [appReveal]="i">
            <app-art [name]="s.art" class="art" />
            <div class="copy">
              <span class="ico"><app-icon [name]="s.icon" [size]="20" /></span>
              <h2>{{ s.name }}</h2>
              <p class="tag-line">{{ s.tagline }}</p>
              <p class="benefit"><app-icon name="check" [size]="15" /> {{ s.benefit }}</p>
              <span class="more">Explorar <app-icon name="arrow-right" [size]="16" class="icon-shift" /></span>
            </div>
          </a>
        }
      </div>
    </section>

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
              <span class="ico big"><app-icon [name]="s.icon" [size]="24" /></span>
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

    <app-cta-band title="¿No sabes cuál de estos servicios necesitas?" text="Cuéntale tu caso a Spark Assistant y obtén una orientación, o escríbenos directamente." />
  `,
  styles: `
    .bento { display: grid; gap: var(--s-4); grid-template-columns: 1fr; }
    .cell { display: grid; overflow: hidden; color: inherit; text-decoration: none; border-radius: var(--r-xl); }
    .art { height: 170px; padding: var(--s-4) var(--s-5) 0; background: var(--brand-gradient-soft); border-bottom: 1px solid var(--line); }
    .c1 .art, .c4 .art { background: linear-gradient(140deg, var(--violet-soft), transparent 70%), var(--surface-2); }
    .c2 .art, .c5 .art { background: linear-gradient(140deg, var(--sky-soft), transparent 70%), var(--surface-2); }
    .copy { display: grid; gap: var(--s-2); align-content: start; padding: var(--s-5); }
    .ico { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--accent-soft); color: var(--accent); margin-bottom: var(--s-2); }
    .ico.big { width: 52px; height: 52px; border-radius: var(--r-lg); }
    .copy h2 { font-size: var(--fs-xl); letter-spacing: -0.03em; }
    .tag-line { color: var(--text-2); font-size: var(--fs-sm); }
    .benefit { display: flex; gap: var(--s-2); align-items: flex-start; font-size: var(--fs-sm); font-weight: 550; }
    .benefit app-icon { color: var(--ok); margin-top: 3px; }
    .more { display: inline-flex; align-items: center; gap: var(--s-1); margin-top: var(--s-2); color: var(--accent); font-weight: 600; font-size: var(--fs-sm); }
    .cell:hover .icon-shift { transform: translateX(3px); }
    .icon-shift { transition: transform var(--t-fast) var(--ease); }
    @media (min-width: 760px) { .bento { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1000px) {
      .bento { grid-template-columns: repeat(6, 1fr); }
      .c0, .c3 { grid-column: span 4; grid-template-columns: 1.1fr 1fr; }
      .c0 .art, .c3 .art { height: 100%; min-height: 260px; padding: var(--s-6); border-bottom: 0; border-right: 1px solid var(--line); }
      .c0 .copy, .c3 .copy { align-content: center; padding: var(--s-6); }
      .c0 h2, .c3 h2 { font-size: 1.8rem; }
      .c1, .c2 { grid-column: span 2; }
      .c4, .c5 { grid-column: span 3; }
      .c3 .art { order: 2; border-right: 0; border-left: 1px solid var(--line); }
    }

    .layout { display: grid; gap: var(--s-6); padding-block: var(--s-6) var(--s-8); }
    .toc { display: none; }
    .toc-title { font: 500 var(--fs-2xs) var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); }
    .toc ul { list-style: none; display: grid; gap: 2px; margin-top: var(--s-3); border-left: 1px solid var(--line); }
    .toc a { display: block; padding: var(--s-2) var(--s-4); color: var(--text-2); text-decoration: none; font-size: var(--fs-sm); margin-left: -1px; border-left: 1px solid transparent; }
    .toc a:hover { color: var(--text); border-left-color: var(--accent); }
    .list { display: grid; gap: var(--s-5); min-width: 0; }
    .svc { display: grid; gap: var(--s-5); padding: clamp(20px, 4vw, 36px); border: 1px solid var(--line); border-radius: var(--r-xl); background: var(--surface); scroll-margin-top: calc(var(--header-h) + 20px); }
    .svc:target, .svc:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 4px var(--accent-soft); }
    .svc-head { display: grid; grid-template-columns: auto 1fr; gap: var(--s-4); align-items: start; }
    .num { font: 500 var(--fs-xs) var(--font-mono); color: var(--text-3); }
    .svc h2 { font-size: clamp(1.5rem, 2.6vw, 1.9rem); margin: 2px 0 var(--s-2); }
    .tagline { color: var(--text-2); font-size: var(--fs-md); }
    .facts { margin: 0; display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); }
    .facts > div { padding-top: var(--s-3); border-top: 1px solid var(--line); }
    dt { font: 500 var(--fs-2xs) var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-3); margin-bottom: var(--s-2); }
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
