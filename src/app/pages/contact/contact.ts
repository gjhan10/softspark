import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { QuoteForm } from '../../features/quote/quote-form';
import { QuoteService } from '../../features/quote/quote.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, Icon, QuoteForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Contacto</span>
        <h1>Cuéntanos qué quieres construir</h1>
        <p class="lead">Completa la solicitud con lo que sepas hoy. Si algo no lo tienes claro, lo definimos juntos en la primera conversación.</p>
      </div>
    </header>

    <section class="container layout">
      <app-quote-form [plan]="plan()" [tipo]="tipo()" [solucion]="solucion()" [recomendacion]="recomendacion()" />

      <aside class="side">
        <div class="card box">
          <h2>Cómo funciona este formulario</h2>
          @if (mode === 'local') {
            <ol class="steps">
              <li><span>1</span> Completas y revisas tu solicitud.</li>
              <li><span>2</span> Preparamos el mensaje con tus datos.</li>
              <li><span>3</span> Lo envías desde tu correo o lo copias. Solo entonces nos llega.</li>
            </ol>
            <p class="small">Este sitio es estático y todavía no tiene un receptor de formularios conectado. Tus datos no se guardan en ningún servidor.</p>
          } @else {
            <p class="small">Al enviar, tu solicitud se transmite de forma segura al sistema de SoftSpark y verás una confirmación solo si fue recibida.</p>
          }
        </div>
        @if (site.email) {
          <div class="card box">
            <h2>Contacto directo</h2>
            <a class="link" [href]="'mailto:' + site.email"><app-icon name="mail" [size]="18" /> {{ site.email }}</a>
          </div>
        }
        <div class="card box">
          <h2>¿Aún no sabes qué necesitas?</h2>
          <p class="small">Responde siete preguntas y obtén una recomendación orientativa.</p>
          <a routerLink="/que-necesito" fragment="asistente" class="btn btn-secondary btn-sm">Usar el asistente</a>
        </div>
      </aside>
    </section>
  `,
  styles: `
    .layout { display: grid; gap: var(--s-6); padding-block: var(--s-7) var(--s-9); align-items: start; }
    .side { display: grid; gap: var(--s-4); }
    .box { display: grid; gap: var(--s-3); padding: 22px; justify-items: start; }
    .box h2 { font-size: 1.05rem; }
    .small { color: var(--text-2); font-size: 0.9rem; }
    .steps { list-style: none; display: grid; gap: 10px; font-size: 0.92rem; color: var(--text-2); }
    .steps li { display: grid; grid-template-columns: 24px 1fr; gap: 10px; align-items: start; }
    .steps span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: var(--surface-3); font: 600 0.75rem var(--font-mono); color: var(--cyan); }
    .link { overflow-wrap: anywhere; }
    @media (min-width: 1000px) { .layout { grid-template-columns: 1fr 340px; } .side { position: sticky; top: calc(var(--header-h) + 24px); } }
  `,
})
export class Contact {
  readonly plan = input<string>();
  readonly tipo = input<string>();
  readonly solucion = input<string>();
  readonly recomendacion = input<string>();
  protected readonly site = SITE;
  protected readonly mode = inject(QuoteService).mode;

  constructor() {
    inject(Seo).set({
      title: 'Solicitar cotización',
      description: 'Solicita una cotización a SoftSpark: cuéntanos tu proyecto, el plan que te interesa y el plazo estimado.',
      path: 'contacto',
    });
  }
}
