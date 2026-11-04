import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

const THEME_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#0b1020' };

/**
 * Tema claro por defecto. La preferencia se guarda en localStorage y un script
 * en index.html la aplica antes del primer pintado para evitar el parpadeo.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('light');
  private animTimer: ReturnType<typeof setTimeout> | undefined;

  sync(): void {
    if (this.browser) this.theme.set(this.initial());
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(next: Theme): void {
    const root = this.doc.documentElement;
    const reduce = !!this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (this.browser && !reduce) {
      // La clase activa transiciones de color solo durante el cambio, no en cada hover.
      root.classList.add('theme-anim');
      clearTimeout(this.animTimer);
      this.animTimer = setTimeout(() => root.classList.remove('theme-anim'), 600);
    }
    this.theme.set(next);
    if (next === 'dark') root.dataset['theme'] = 'dark';
    else delete root.dataset['theme'];
    this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next]);
    try {
      localStorage.setItem('ss-theme', next);
    } catch {
      /* almacenamiento no disponible: el tema solo dura esta visita */
    }
  }

  private initial(): Theme {
    if (!this.browser) return 'light';
    return this.doc.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
  }
}
