import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { Seo } from '../../core/seo.service';
import { PROCESS } from '../../data/process.data';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon, IconName } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

const STEP_ICONS: IconName[] = ['users', 'search', 'file', 'layers', 'code', 'shield', 'trending'];

@Component({
  selector: 'app-process',
  imports: [Icon, CtaBand, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Proceso de trabajo</span>
        <h1>De la primera conversación a un producto que evoluciona</h1>
        <p class="lead">Siete etapas, cada una con un entregable concreto que revisas antes de pasar a la siguiente.</p>
      </div>
    </header>

    <section class="container section">
      <ol class="timeline on-main" #timeline>
        <li class="rail" aria-hidden="true"><span class="fill"></span></li>
        @for (s of steps; track s.title; let i = $index) {
          <li class="step" appReveal>
            <span class="node" aria-hidden="true"><app-icon [name]="icon(i)" [size]="20" /></span>
            <div class="body">
              <span class="n">Etapa {{ i + 1 < 10 ? '0' + (i + 1) : i + 1 }}</span>
              <h2>{{ s.title }}</h2>
              <p>{{ s.desc }}</p>
              <p class="out"><span class="out-label">Qué recibes</span> {{ s.output }}</p>
            </div>
          </li>
        }
      </ol>
    </section>

    <section class="section-tight section-alt" aria-labelledby="need-t">
      <div class="container two">
        <div appReveal>
          <h2 id="need-t">Qué necesitamos de ti</h2>
          <ul class="check-list">
            <li><app-icon name="check" [size]="16" /> Una persona de contacto que pueda tomar decisiones.</li>
            <li><app-icon name="check" [size]="16" /> Contenidos (textos, imágenes, datos) o tiempo para definirlos juntos.</li>
            <li><app-icon name="check" [size]="16" /> Acceso a los sistemas que haya que integrar, cuando corresponda.</li>
            <li><app-icon name="check" [size]="16" /> Revisiones de cada entrega en los plazos acordados.</li>
          </ul>
        </div>
        <div appReveal="1">
          <h2>Lo que conviene saber</h2>
          <ul class="check-list">
            <li><app-icon name="info" [size]="16" /> El hosting, el dominio y los servicios de terceros pueden tener costes aparte.</li>
            <li><app-icon name="info" [size]="16" /> Los sistemas con usuarios y datos necesitan backend e infraestructura.</li>
            <li><app-icon name="info" [size]="16" /> Los cambios de alcance se revisan y se cotizan antes de implementarse.</li>
            <li><app-icon name="info" [size]="16" /> El mantenimiento posterior se acuerda por separado.</li>
          </ul>
        </div>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: `
    .timeline { --p: 1; position: relative; list-style: none; display: grid; gap: var(--s-5); max-width: 860px; }
    .rail { position: absolute; left: 27px; top: 28px; bottom: 28px; width: 2px; border-radius: 2px; background: var(--line); }
    .fill { position: absolute; inset: 0; border-radius: 2px; background: var(--brand-gradient); transform-origin: top; transform: scaleY(var(--p)); }
    .step { position: relative; display: grid; grid-template-columns: 56px 1fr; gap: var(--s-5); }
    .node {
      position: relative; z-index: 1; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 18px;
      border: 1px solid var(--line-strong); background: var(--surface); color: var(--text-3); box-shadow: var(--shadow-1);
      transition: color var(--t-slow) var(--ease), border-color var(--t-slow) var(--ease), box-shadow var(--t-slow) var(--ease), transform var(--t-slow) var(--ease-out);
    }
    .step.in .node, :host-context(html:not(.motion-ok)) .node { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); box-shadow: 0 0 0 6px var(--accent-soft), var(--shadow-2); }
    .body { display: grid; gap: var(--s-2); padding: var(--s-5); border: 1px solid var(--line); border-radius: var(--r-xl); background: var(--surface); box-shadow: var(--shadow-1); }
    .n { font: 500 var(--fs-label) var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-3); }
    h2 { font-size: var(--fs-xl); letter-spacing: -0.025em; }
    .body p { color: var(--text-2); }
    .body .out { display: flex; flex-wrap: wrap; gap: var(--s-2); align-items: baseline; margin-top: var(--s-2); padding-top: var(--s-3); border-top: 1px dashed var(--line-strong); color: var(--text); font-size: var(--fs-sm); font-weight: 500; }
    .out-label { padding: 2px 8px; border-radius: var(--r-pill); background: var(--ok-soft); color: var(--ok); font: 600 var(--fs-label) var(--font-mono); text-transform: uppercase; letter-spacing: .06em; }
    .two { display: grid; gap: var(--s-6); }
    .two h2 { margin-bottom: var(--s-4); }
    .two .check-list app-icon { color: var(--accent); }
    @media (min-width: 900px) { .two { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 559px) {
      .step { grid-template-columns: 44px 1fr; gap: var(--s-3); }
      .node { width: 44px; height: 44px; border-radius: 14px; }
      .rail { left: 21px; }
    }
  `,
})
export class Process {
  protected readonly steps = PROCESS;
  private readonly timeline = viewChild<ElementRef<HTMLElement>>('timeline');

  constructor() {
    inject(Seo).set({
      title: 'Proceso de trabajo',
      description: 'Cómo trabaja SoftSpark: conversación inicial, alcance, propuesta, diseño, desarrollo por iteraciones, pruebas, entrega y evolución, con un entregable en cada etapa.',
      path: 'proceso',
    });

    // La línea del timeline se rellena según el avance del scroll.
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.timeline()?.nativeElement;
      const win = el?.ownerDocument.defaultView;
      if (!el || !win || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let frame = 0;
      const update = () => {
        const r = el.getBoundingClientRect();
        const progress = (win.innerHeight * 0.6 - r.top) / r.height;
        el.style.setProperty('--p', String(Math.min(1, Math.max(0, progress))));
      };
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
      };
      update();
      win.addEventListener('scroll', onScroll, { passive: true });
      win.addEventListener('resize', onScroll, { passive: true });
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        win.removeEventListener('scroll', onScroll);
        win.removeEventListener('resize', onScroll);
      });
    });
  }

  protected icon(i: number): IconName {
    return STEP_ICONS[i % STEP_ICONS.length];
  }
}
