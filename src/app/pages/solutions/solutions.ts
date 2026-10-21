import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogState } from '../../core/catalog-state';
import { Seo } from '../../core/seo.service';
import { categoryLabel, isSolutionCategory, matches, SolutionCategory, SOLUTION_CATEGORIES, SOLUTION_FAMILIES, SOLUTIONS } from '../../data/solutions.data';
import { Icon } from '../../shared/icon/icon';
import { SolutionCard } from '../../shared/solution-card/solution-card';

const FEATURED = 'erp-modular';

@Component({
  selector: 'app-solutions',
  imports: [RouterLink, Icon, SolutionCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
  templateUrl: './solutions.html',
  styleUrl: './solutions.scss',
})
export class Solutions {
  readonly categoria = input<string | undefined>();
  readonly q = input<string | undefined>();
  private readonly router = inject(Router);
  protected readonly state = inject(CatalogState);
  protected readonly categories = SOLUTION_CATEGORIES;
  protected readonly total = SOLUTIONS.length;
  protected readonly category = computed(() => this.state.category() as SolutionCategory | null);
  protected readonly query = this.state.query;
  protected readonly categoryName = computed(() => (this.category() ? categoryLabel(this.category()!) : ''));
  protected readonly searchMatches = computed(() => SOLUTIONS.filter((s) => matches(s, this.query())));
  protected readonly results = computed(() => this.searchMatches().filter((s) => !this.category() || s.category === this.category()));
  protected readonly showFeatured = computed(() => !this.state.active());
  protected readonly groups = computed(() =>
    SOLUTION_FAMILIES.map((f) => {
      const items = this.results().filter((s) => s.family === f.id);
      const first = this.showFeatured() ? items.filter((s) => s.slug === FEATURED) : [];
      return { ...f, items: [...first, ...items.filter((s) => !first.includes(s))] };
    }).filter((g) => g.items.length),
  );
  protected readonly featured = FEATURED;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pushed: string | null = null;

  constructor() {
    inject(Seo).set({
      title: 'Soluciones',
      description: 'Catálogo de soluciones de software: landing pages, sitios corporativos, catálogos, tiendas en línea, inventario, ERP, CRM, dashboards, automatización e integraciones.',
      path: 'soluciones',
    });
    effect(() => {
      const c = this.categoria();
      const q = this.q() ?? '';
      untracked(() => {
        if (this.pushed === (c ?? '') + '|' + q) return;
        this.state.category.set(isSolutionCategory(c) ? c : null);
        this.state.query.set(q);
      });
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected countFor(id: SolutionCategory): number {
    return this.searchMatches().filter((s) => s.category === id).length;
  }

  protected setCategory(id: SolutionCategory | null): void {
    this.state.category.set(this.category() === id ? null : id);
    this.syncUrl();
  }

  protected onSearch(value: string): void {
    this.state.query.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.syncUrl(), 300);
  }

  protected clearSearch(input: HTMLInputElement): void {
    this.state.query.set('');
    this.syncUrl();
    input.focus();
  }

  protected searchEverywhere(): void {
    this.state.category.set(null);
    this.syncUrl();
  }

  protected clearAll(): void {
    this.state.category.set(null);
    this.state.query.set('');
    this.syncUrl();
  }

  private syncUrl(): void {
    clearTimeout(this.timer);
    const q = this.query().trim();
    this.pushed = (this.category() ?? '') + '|' + q;
    this.router.navigate([], { queryParams: { categoria: this.category(), q: q || null }, replaceUrl: true });
  }
}
