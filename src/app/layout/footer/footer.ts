import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { SERVICES } from '../../data/services.data';
import { SOLUTIONS } from '../../data/solutions.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <svg class="constellation" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="ft-line" x1="0" x2="1">
            <stop offset="0" stop-color="var(--accent)" stop-opacity="0" />
            <stop offset=".5" stop-color="var(--violet)" stop-opacity=".55" />
            <stop offset="1" stop-color="var(--sky)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 160 C 180 60, 320 200, 480 120 S 760 30, 920 110 S 1120 170, 1200 80" fill="none" stroke="url(#ft-line)" stroke-width="1.5" />
        <path d="M0 190 C 220 120, 380 210, 560 160 S 860 90, 1200 150" fill="none" stroke="url(#ft-line)" stroke-width="1" opacity=".6" />
        @for (p of dots; track $index) {
          <circle [attr.cx]="p[0]" [attr.cy]="p[1]" r="3" class="dot" [style.--d]="$index * 0.4 + 's'" />
        }
      </svg>

      <div class="container grid">
        <div class="about">
          <a routerLink="/" class="brand" aria-label="SoftSpark, ir al inicio">
            <img src="brand/softspark-mark-192.webp" alt="" width="44" height="44" loading="lazy" />
            <span>Soft<span class="text-gradient">Spark</span></span>
          </a>
          <p>Diseñamos y desarrollamos sitios web, aplicaciones y sistemas empresariales a medida, desde Perú, para negocios de aquí y de otros países.</p>
          <a routerLink="/contacto" class="btn btn-brand btn-sm">Empezar un proyecto <app-icon name="arrow-right" [size]="16" class="icon-shift" /></a>
        </div>

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
            <li><a routerLink="/soluciones" class="more">Ver catálogo completo</a></li>
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

      <div class="container base">
        <p>© {{ year }} SoftSpark. <a routerLink="/privacidad">Aviso de privacidad</a></p>
        <p>Creado por <a [href]="site.blogUrl" target="_blank" rel="noopener">{{ site.founder }} <app-icon name="arrow-up-right" [size]="14" /></a></p>
      </div>
    </footer>
  `,
  styles: `
    .footer { position: relative; isolation: isolate; overflow: hidden; border-top: 1px solid var(--line); background: var(--bg-2); padding-top: clamp(64px, 9vw, 112px); }
    .constellation { position: absolute; inset: 0 0 auto; z-index: -1; width: 100%; height: 220px; }
    .dot { fill: var(--accent); opacity: .5; animation: pulse 4s var(--ease-in-out) infinite; animation-delay: var(--d); }
    @keyframes pulse { 50% { opacity: .15; } }
    .grid { display: grid; gap: var(--s-6) var(--s-5); grid-template-columns: 1fr 1fr; }
    .about { display: grid; gap: var(--s-4); justify-items: start; max-width: 380px; grid-column: 1 / -1; }
    .about p { color: var(--text-2); font-size: var(--fs-sm); }
    .brand { display: inline-flex; align-items: center; gap: var(--s-3); text-decoration: none; font: 700 1.5rem/1 var(--font-display); letter-spacing: -0.03em; }
    .brand img { border-radius: 12px; box-shadow: 0 0 0 1px var(--line-strong); }
    h2 { font: 500 var(--fs-label)/1 var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-3); margin-bottom: var(--s-4); }
    ul { list-style: none; display: grid; gap: 2px; }
    li a { display: inline-flex; align-items: center; gap: 6px; padding: 5px 0; color: var(--text-2); text-decoration: none; font-size: var(--fs-sm); overflow-wrap: anywhere; transition: color var(--t-fast); }
    li a:hover { color: var(--accent); }
    .more { font-weight: 600; color: var(--text); }
    .base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s-3); margin-top: var(--s-8); padding-block: var(--s-5); border-top: 1px solid var(--line); color: var(--text-3); font-size: var(--fs-sm); }
    .base a { color: var(--text-2); display: inline-flex; align-items: center; gap: var(--s-1); }
    .base p a { margin-left: var(--s-2); }
    @media (min-width: 1000px) {
      .grid { grid-template-columns: 1.5fr 1fr 1.1fr 1fr 1fr; }
      .about { grid-column: auto; }
    }
  `,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly solutions = SOLUTIONS.slice(0, 5);
  protected readonly year = new Date().getFullYear();
  protected readonly dots = [
    [140, 112],
    [330, 168],
    [480, 120],
    [690, 70],
    [920, 110],
    [1080, 140],
  ];
}
