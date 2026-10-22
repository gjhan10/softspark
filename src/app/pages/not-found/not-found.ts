import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head nf">
      <div class="container">
        <span class="code">404</span>
        <h1>Esta página no existe</h1>
        <p class="lead">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <div class="btns">
          <a routerLink="/" class="btn btn-primary"><app-icon name="arrow-left" [size]="18" /> Ir al inicio</a>
          <a routerLink="/soluciones" class="btn btn-secondary">Ver soluciones</a>
          <a routerLink="/contacto" class="btn btn-ghost">Contacto</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .nf { min-height: 70vh; border-bottom: 0; }
    .code { font: 700 clamp(4rem, 12vw, 7rem)/1 var(--font-display); color: var(--accent); }
    .btns { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-3); }
  `,
})
export class NotFound {
  constructor() {
    inject(Seo).set({ title: 'Página no encontrada', description: 'La página que buscas no existe.', path: '404', noindex: true });
  }
}
