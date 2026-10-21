import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogState } from '../../core/catalog-state';
import { Seo } from '../../core/seo.service';
import { findPlan } from '../../data/plans.data';
import { categoryLabel, familyOf, findSolution, SOLUTIONS } from '../../data/solutions.data';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Icon, IconName } from '../../shared/icon/icon';
import { ImplBadges } from '../../shared/impl-badges/impl-badges';
import { SolutionCard } from '../../shared/solution-card/solution-card';
import { SolutionPreview } from '../../shared/solution-preview/solution-preview';

@Component({
  selector: 'app-solution-detail',
  imports: [RouterLink, Icon, Breadcrumbs, SolutionCard, SolutionPreview, ImplBadges],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solution-detail.html',
  styleUrl: './solution-detail.scss',
})
export class SolutionDetail {
  readonly slug = input.required<string>();
  protected readonly catalog = inject(CatalogState);
  protected readonly s = computed(() => findSolution(this.slug()));
  protected readonly category = computed(() => (this.s() ? categoryLabel(this.s()!.category) : ''));
  protected readonly family = computed(() => (this.s() ? familyOf(this.s()!.family).label : ''));
  protected readonly plan = computed(() => (this.s() ? findPlan(this.s()!.plan) : null));
  protected readonly demo = computed(() => DEMO_MODULES.find((d) => d.id === this.s()?.demo) ?? null);
  protected readonly quoteParams = computed(() => {
    const s = this.s();
    return s ? { solucion: s.slug, tipo: s.projectType, plan: s.plan } : {};
  });
  protected readonly techCols = computed(() => {
    const s = this.s();
    if (!s) return [];
    const cols: { title: string; icon: IconName; items: string[]; empty: string }[] = [
      { title: 'En el navegador', icon: 'window', items: s.tech.frontend, empty: '' },
      { title: 'Requiere API o backend', icon: 'server', items: s.tech.backend, empty: 'No necesita backend para funcionar.' },
      { title: 'Depende de servicios externos', icon: 'link', items: s.tech.external, empty: 'No depende de servicios de terceros.' },
      { title: 'Se define en el análisis', icon: 'compass', items: s.tech.analysis, empty: '' },
    ];
    return cols;
  });
  protected readonly related = computed(() => {
    const s = this.s();
    if (!s) return [];
    const same = SOLUTIONS.filter((x) => x.slug !== s.slug && x.family === s.family);
    const rest = SOLUTIONS.filter((x) => x.slug !== s.slug && x.family !== s.family && x.plan === s.plan);
    return [...same, ...rest].slice(0, 3);
  });

  constructor() {
    const seo = inject(Seo);
    effect(() => {
      const s = this.s();
      seo.set(
        s
          ? { title: s.name, description: `${s.summary} ${s.backendNote}`, path: `soluciones/${s.slug}` }
          : { title: 'Solución no encontrada', description: 'La solución que buscas no existe.', path: `soluciones/${this.slug()}`, noindex: true },
      );
    });
  }
}
