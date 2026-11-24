import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { SERVICES } from '../../data/services.data';
import { SOLUTIONS } from '../../data/solutions.data';
import { Icon } from '../../shared/icon/icon';

/** Footer: cierre tipo carta (una despedida firmada con fecha) sobre los enlaces del sitio. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="letter">
          <p class="sign-off">Si tienes un proyecto en mente, escríbenos. Te respondemos con una propuesta pensada para tu negocio.</p>
          <p class="signature">
            <img src="brand/softspark-mark-192.webp" alt="" width="40" height="40" loading="lazy" />
            <span>{{ site.founder }}, fundador de SoftSpark<br /><time [attr.datetime]="isoMonth">{{ month }}</time></span>
          </p>
          <p class="where">Desde Perú, para negocios de aquí y de otros países.@if (site.email) { Escríbenos a <a class="link" [href]="'mailto:' + site.email">{{ site.email }}</a>.}</p>
          <a routerLink="/contacto" class="btn btn-primary">Empezar un proyecto</a>
        </div>

        <div class="links">
          <nav aria-label="Servicios">
            <h2>Servicios</h2>
            <ul>
              @for (s of services; track s.id) {
                <li><a routerLink="/servicios" [fragment]="s.id">{{ s.name }}</a></li>
              }
            </ul>
          </nav>

          <nav aria-label="Soluciones">
            <h2>Soluciones</h2>
            <ul>
              @for (s of solutions; track s.slug) {
                <li><a [routerLink]="['/soluciones', s.slug]">{{ s.name }}</a></li>
              }
              <li><a routerLink="/soluciones">Ver catálogo completo</a></li>
            </ul>
          </nav>

          <nav aria-label="Explorar">
            <h2>Explorar</h2>
            <ul>
              <li><a routerLink="/proyectos">Proyectos</a></li>
              <li><a routerLink="/lab">SoftSpark Lab</a></li>
              <li><a routerLink="/planes">Planes</a></li>
              <li><a routerLink="/proceso">Proceso de trabajo</a></li>
              <li><a routerLink="/que-necesito">Spark Assistant</a></li>
              <li><a routerLink="/preguntas-frecuentes">Preguntas frecuentes</a></li>
            </ul>
          </nav>

          <div>
            <h2>Contacto</h2>
            <ul>
              <li><a routerLink="/contacto">Solicitar cotización</a></li>
              @if (site.email) {
                <li><a [href]="'mailto:' + site.email"><app-icon name="mail" [size]="15" /> {{ site.email }}</a></li>
              }
              @if (site.whatsapp) {
                <li><a [href]="site.whatsapp" target="_blank" rel="noopener">WhatsApp</a></li>
              }
              @for (s of site.social; track s.href) {
                <li><a [href]="s.href" target="_blank" rel="noopener">{{ s.label }}</a></li>
              }
            </ul>
          </div>
        </div>

        <div class="base">
          <p>© {{ year }} SoftSpark. <a routerLink="/privacidad">Aviso de privacidad</a></p>
          <p>Creado por <a [href]="site.blogUrl" target="_blank" rel="noopener">{{ site.founder }} <app-icon name="arrow-up-right" [size]="14" /></a></p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer { border-top: 3px solid var(--color-ink); background: var(--color-paper); padding-top: var(--section-gap-s); }
    .letter { display: grid; gap: var(--space-lg); justify-items: start; max-width: 860px; padding-bottom: var(--space-3xl); }
    .sign-off { font: 500 var(--text-display-s) / 1.08 var(--font-heading); letter-spacing: var(--tracking-display); color: var(--color-ink); text-wrap: balance; }
    .signature { display: flex; align-items: center; gap: var(--space-sm); color: var(--color-ink-2); font-size: var(--text-sm); }
    .where { color: var(--color-ink-2); }
    .signature img { border-radius: var(--radius-input); }
    .links { display: grid; gap: var(--space-xl) var(--gap-columns); grid-template-columns: repeat(2, minmax(0, 1fr)); padding-block: var(--space-2xl); border-top: var(--rule-hair) solid var(--color-rule); }
    h2 { font: 500 var(--text-sm) / 1.3 var(--font-display); letter-spacing: 0; color: var(--color-muted); margin-bottom: var(--space-md); max-width: none; }
    ul { list-style: none; display: grid; gap: var(--space-2xs); }
    li a { display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-2xs) 0; color: var(--color-ink-2); text-decoration: none; font-size: var(--text-sm); overflow-wrap: anywhere; transition: color var(--dur-micro) var(--ease-out); }
    li a:hover { color: var(--color-accent); text-decoration: underline; text-underline-offset: 0.2em; }
    a:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
    .base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-sm); padding-block: var(--space-lg); border-top: var(--rule-hair) solid var(--color-rule); color: var(--color-muted); font-size: var(--text-sm); }
    .base a { color: var(--color-ink-2); display: inline-flex; align-items: center; gap: var(--space-2xs); }
    .base p a { margin-left: var(--space-xs); }
    @media (max-width: 420px) { .links { grid-template-columns: minmax(0, 1fr); } }
    @media (min-width: 1000px) { .links { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  `,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly solutions = SOLUTIONS.slice(0, 5);
  protected readonly year = new Date().getFullYear();
  protected readonly isoMonth = new Date().toISOString().slice(0, 7);
  protected readonly month = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(new Date());
}
