import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { ToastOutlet } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastOutlet],
  template: `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-header />
    <main id="contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast-outlet />
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100dvh; }
    main { flex: 1; outline: none; }
    .skip {
      position: fixed; left: 16px; top: -60px; z-index: 2000; padding: 10px 16px; border-radius: var(--r-md);
      background: var(--accent); color: var(--accent-ink); font-weight: 600; text-decoration: none; transition: top var(--t-fast);
    }
    .skip:focus { top: 12px; }
  `,
})
export class App {
  constructor() {
    const theme = inject(ThemeService);
    afterNextRender(() => theme.sync());
  }
}
