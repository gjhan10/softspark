import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Seo } from '../../core/seo.service';
import { FAQ_TOPICS, FAQS } from '../../data/faq.data';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-faq',
  imports: [Icon, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Preguntas frecuentes</span>
        <h1>Respuestas claras antes de empezar</h1>
        <p class="lead">Sobre planes, costes, forma de trabajo y aspectos técnicos.</p>
      </div>
    </header>

    <section class="container section-tight">
      <div class="on-main">
      <nav class="chips topics" aria-label="Temas">
        @for (t of topics; track t.id) {
          <a class="chip" [href]="'preguntas-frecuentes#' + t.id" (click)="go($event, t.id)">{{ t.label }}</a>
        }
      </nav>
      @for (t of topics; track t.id) {
        <section class="topic" [id]="t.id" [attr.aria-labelledby]="t.id + '-t'">
          <h2 [id]="t.id + '-t'">{{ t.label }}</h2>
          @for (f of byTopic(t.id); track f.q) {
            <details class="faq-item">
              <summary>{{ f.q }} <app-icon name="plus" [size]="20" /></summary>
              <p>{{ f.a }}</p>
            </details>
          }
        </section>
      }
      </div>
    </section>

    <app-cta-band title="¿Tienes otra pregunta?" text="Escríbenos desde el formulario de cotización y te responderemos." />
  `,
  styles: `
    .topics { margin-bottom: var(--s-6); }
    .chip { text-decoration: none; }
    .topic { max-width: 860px; margin-bottom: var(--s-7); scroll-margin-top: calc(var(--header-h) + 20px); }
    .topic h2 { font-size: var(--fs-xl); margin-bottom: var(--s-2); padding-bottom: var(--s-3); border-bottom: 1px solid var(--line-strong); }
  `,
})
export class FaqPage {
  protected readonly topics = FAQ_TOPICS;

  constructor() {
    inject(Seo).set({
      title: 'Preguntas frecuentes',
      description: 'Preguntas frecuentes sobre los planes, costes, hosting, mantenimiento, formularios en sitios estáticos y la diferencia entre ERP y CRM.',
      path: 'preguntas-frecuentes',
    });
  }

  protected byTopic(id: string) {
    return FAQS.filter((f) => f.topic === id);
  }

  protected go(event: Event, id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `${location.pathname}#${id}`);
  }
}
