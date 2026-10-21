import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CatalogState {
  readonly category = signal<string | null>(null);
  readonly query = signal('');
  readonly params = computed(() => {
    const p: Record<string, string> = {};
    if (this.category()) p['categoria'] = this.category()!;
    if (this.query().trim()) p['q'] = this.query().trim();
    return p;
  });
  readonly active = computed(() => Object.keys(this.params()).length > 0);
}
