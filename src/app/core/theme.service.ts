import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('light');

  sync(): void {
    if (this.browser) this.theme.set(this.initial());
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.doc.documentElement.dataset['theme'] = next;
    try {
      localStorage.setItem('ss-theme', next);
    } catch {}
  }

  private initial(): Theme {
    if (!this.browser) return 'light';
    return this.doc.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
  }
}
