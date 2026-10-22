import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Seo } from '../../core/seo.service';
import { PROCESS } from '../../data/process.data';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-process',
  imports: [Icon, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Proceso de trabajo</span>
        <h1>De la primera conversación a un producto que evoluciona</h1>
        <p class="lead">Cada etapa tiene un resultado concreto que puedes revisar antes de pasar a la siguiente.</p>
      </div>
    </header>

    <section class="container section">
      <ol class="timeline on-main">
        @for (s of steps; track s.title; let i = $index) {
          <li>
            <span class="n">{{ i + 1 < 10 ? '0' + (i + 1) : i + 1 }}</span>
            <div class="body">
              <h2>{{ s.title }}</h2>
              <p>{{ s.desc }}</p>
              <p class="out"><app-icon name="check" [size]="16" /> {{ s.output }}</p>
            </div>
          </li>
        }
      </ol>
    </section>

    <section class="section-tight section-alt" aria-labelledby="need-t">
      <div class="container two">
        <div>
          <h2 id="need-t">Qué necesitamos de ti</h2>
          <ul class="check-list">
            <li><app-icon name="check" [size]="16" /> Una persona de contacto que pueda tomar decisiones.</li>
            <li><app-icon name="check" [size]="16" /> Contenidos (textos, imágenes, datos) o tiempo para definirlos juntos.</li>
            <li><app-icon name="check" [size]="16" /> Acceso a los sistemas que haya que integrar, cuando corresponda.</li>
            <li><app-icon name="check" [size]="16" /> Revisiones de cada entrega en los plazos acordados.</li>
          </ul>
        </div>
        <div>
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
    .timeline { list-style: none; display: grid; gap: 0; max-width: 820px; }
    .timeline li { display: grid; grid-template-columns: 56px 1fr; gap: var(--s-4); position: relative; padding-bottom: var(--s-6); }
    .timeline li:not(:last-child)::before { content: ''; position: absolute; left: 27px; top: 52px; bottom: 4px; width: 1px; background: var(--line-strong); }
    .n { display: grid; place-items: center; width: 56px; height: 56px; border-radius: var(--r-lg); border: 1px solid var(--line-strong); background: var(--surface); font: 600 var(--fs-base) var(--font-mono); color: var(--cyan); }
    .body { display: grid; gap: var(--s-2); padding-top: var(--s-2); }
    h2 { font-size: var(--fs-xl); }
    .body p { color: var(--text-2); }
    .body .out { display: flex; gap: var(--s-2); align-items: flex-start; color: var(--text); font-size: var(--fs-sm); }
    .out app-icon { color: var(--ok); margin-top: var(--s-1); }
    .two { display: grid; gap: var(--s-6); }
    .two h2 { margin-bottom: var(--s-4); }
    .two .check-list app-icon { color: var(--accent); }
    @media (min-width: 900px) { .two { grid-template-columns: 1fr 1fr; } }
  `,
})
export class Process {
  protected readonly steps = PROCESS;

  constructor() {
    inject(Seo).set({
      title: 'Proceso de trabajo',
      description: 'Cómo trabaja SoftSpark: conversación inicial, alcance, propuesta, diseño, desarrollo por iteraciones, pruebas, entrega y evolución.',
      path: 'proceso',
    });
  }
}
