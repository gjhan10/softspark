import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { isSolutionCategory, SolutionCategory, SOLUTION_CATEGORIES, SOLUTIONS } from '../../data/solutions.data';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { SolutionCard } from '../../shared/solution-card/solution-card';

@Component({
  selector: 'app-solutions',
  imports: [Icon, SolutionCard, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Catálogo de soluciones</span>
        <h1>Explora el tipo de software que podemos construir</h1>
        <p class="lead">Cada ficha describe un tipo de desarrollo a medida: qué problema resuelve, qué módulos puede tener y qué necesita para funcionar. No son productos empaquetados listos para comprar.</p>
      </div>
    </header>

    <section class="container section-tight">
      <div class="filters">
        <div class="chips" role="group" aria-label="Filtrar por categoría">
          <button type="button" class="chip" [attr.aria-pressed]="category() === null" (click)="setCategory(null)">Todas <span class="count">{{ total }}</span></button>
          @for (c of categories; track c.id) {
            <button type="button" class="chip" [attr.aria-pressed]="category() === c.id" (click)="setCategory(c.id)">{{ c.label }} <span class="count">{{ countFor(c.id) }}</span></button>
          }
        </div>
        <label class="search">
          <span class="sr-only">Buscar soluciones</span>
          <app-icon name="search" [size]="18" />
          <input class="input" type="search" placeholder="Buscar: inventario, ventas, catálogo…" [value]="query()" (input)="query.set($any($event.target).value)" />
        </label>
      </div>

      <p class="count-line" aria-live="polite">{{ results().length }} {{ results().length === 1 ? 'solución' : 'soluciones' }}{{ category() ? ' en ' + categoryName() : '' }}</p>

      <h2 class="sr-only">Resultados</h2>
      @if (results().length) {
        <div class="grid">
          @for (s of results(); track s.slug) {
            <app-solution-card [solution]="s" />
          }
        </div>
      } @else {
        <div class="empty">
          <app-icon name="search" [size]="28" />
          <strong>No encontramos soluciones con esa búsqueda</strong>
          <p>Prueba con otras palabras o cuéntanos lo que necesitas en el formulario de contacto.</p>
          <button type="button" class="btn btn-secondary btn-sm" (click)="clear()">Ver todas las soluciones</button>
        </div>
      }
    </section>

    <app-cta-band title="¿No ves exactamente lo que buscas?" text="Muchos proyectos combinan varias de estas soluciones. Cuéntanos tu caso y lo definimos juntos." />
  `,
  styles: `
    .filters { display: grid; gap: var(--s-4); }
    .search { position: relative; max-width: 420px; }
    .search app-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
    .search .input { padding-left: 38px; }
    .count-line { margin: var(--s-5) 0 var(--s-4); color: var(--text-3); font-size: 0.9rem; }
    .grid { display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); }
  `,
})
export class Solutions {
  readonly categoria = input<string | undefined>();
  private readonly router = inject(Router);
  protected readonly categories = SOLUTION_CATEGORIES;
  protected readonly total = SOLUTIONS.length;
  protected readonly category = signal<SolutionCategory | null>(null);
  protected readonly query = signal('');
  protected readonly categoryName = computed(() => SOLUTION_CATEGORIES.find((c) => c.id === this.category())?.label ?? '');
  protected readonly results = computed(() => {
    const q = normalize(this.query().trim());
    return SOLUTIONS.filter((s) => !this.category() || s.category === this.category()).filter(
      (s) => !q || normalize([s.name, s.summary, s.problem, ...s.modules.map((m) => m.name)].join(' ')).includes(q),
    );
  });

  constructor() {
    inject(Seo).set({
      title: 'Soluciones',
      description: 'Catálogo de tipos de software: sitios web, catálogos, tiendas en línea, inventario, ERP, CRM, dashboards, automatización y aplicaciones a medida.',
      path: 'soluciones',
    });
    effect(() => {
      const c = this.categoria();
      untracked(() => this.category.set(isSolutionCategory(c) ? c : null));
    });
  }

  protected countFor(id: SolutionCategory): number {
    return SOLUTIONS.filter((s) => s.category === id).length;
  }

  protected setCategory(id: SolutionCategory | null): void {
    this.category.set(id);
    this.router.navigate([], { queryParams: { categoria: id }, replaceUrl: true, preserveFragment: false });
  }

  protected clear(): void {
    this.query.set('');
    this.setCategory(null);
  }
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
