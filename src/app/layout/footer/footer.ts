import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { SERVICES } from '../../data/services.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container grid">
        <div class="about">
          <a routerLink="/" class="brand" aria-label="SoftSpark, ir al inicio">
            <img src="brand/softspark-mark-192.webp" alt="" width="40" height="40" loading="lazy" />
            <span>SoftSpark</span>
          </a>
          <p>Desarrollo, comercialización y personalización de software: desde páginas web hasta sistemas empresariales.</p>
          <a routerLink="/contacto" class="btn btn-secondary btn-sm">Solicitar cotización <app-icon name="arrow-right" [size]="16" class="icon-shift" /></a>
        </div>

        <nav aria-label="Servicios">
          <h2>Servicios</h2>
          <ul>
            @for (s of services; track s.id) {
              <li><a routerLink="/servicios" [fragment]="s.id">{{ s.name }}</a></li>
            }
          </ul>
        </nav>

        <nav aria-label="Explorar">
          <h2>Explorar</h2>
          <ul>
            <li><a routerLink="/soluciones">Catálogo de soluciones</a></li>
            <li><a routerLink="/planes">Planes</a></li>
            <li><a routerLink="/que-necesito">¿Qué necesito?</a></li>
            <li><a routerLink="/demo">Demo interactiva</a></li>
            <li><a routerLink="/proceso">Proceso de trabajo</a></li>
            <li><a routerLink="/preguntas-frecuentes">Preguntas frecuentes</a></li>
          </ul>
        </nav>

        <div>
          <h2>Contacto</h2>
          <ul>
            <li><a routerLink="/contacto">Formulario de cotización</a></li>
            @if (site.email) {
              <li><a [href]="'mailto:' + site.email">{{ site.email }}</a></li>
            }
            @if (site.whatsapp) {
              <li><a [href]="site.whatsapp" target="_blank" rel="noopener">WhatsApp</a></li>
            }
            @for (s of site.social; track s.href) {
              <li><a [href]="s.href" target="_blank" rel="noopener">{{ s.label }}</a></li>
            }
            <li><a routerLink="/privacidad">Aviso de privacidad</a></li>
          </ul>
        </div>
      </div>

      <div class="container base">
        <p>© {{ year }} SoftSpark.</p>
        <p>Creado por <a [href]="site.blogUrl" target="_blank" rel="noopener">{{ site.founder }} <app-icon name="arrow-up-right" [size]="14" /></a></p>
      </div>
    </footer>
  `,
  styles: `
    .footer { border-top: 1px solid var(--line); background: var(--bg-2); padding-top: var(--s-8); }
    .grid { display: grid; gap: var(--s-6); grid-template-columns: 1fr; }
    .about { display: grid; gap: var(--s-4); justify-items: start; max-width: 360px; }
    .about p { color: var(--text-2); font-size: 0.95rem; }
    .brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; font: 700 1.2rem var(--font-display); }
    .brand img { border-radius: 10px; box-shadow: 0 0 0 1px var(--line-strong); }
    h2 { font: 500 0.78rem/1 var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); margin-bottom: var(--s-4); }
    ul { list-style: none; display: grid; gap: 4px; }
    li a { display: inline-block; padding: 5px 0; color: var(--text-2); text-decoration: none; font-size: 0.95rem; overflow-wrap: anywhere; }
    li a:hover { color: var(--text); text-decoration: underline; text-underline-offset: 3px; }
    .base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s-3); margin-top: var(--s-7); padding-block: var(--s-5); border-top: 1px solid var(--line); color: var(--text-3); font-size: 0.875rem; }
    .base a { color: var(--text-2); display: inline-flex; align-items: center; gap: 4px; }
    @media (min-width: 640px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (min-width: 1000px) { .grid { grid-template-columns: 1.4fr 1fr 1fr 1fr; } }
  `,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly year = new Date().getFullYear();
}
