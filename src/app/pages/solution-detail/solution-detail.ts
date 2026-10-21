import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { findPlan } from '../../data/plans.data';
import { BACKEND_LABEL, categoryLabel, findSolution, SOLUTIONS } from '../../data/solutions.data';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Icon } from '../../shared/icon/icon';
import { SolutionCard } from '../../shared/solution-card/solution-card';

@Component({
  selector: 'app-solution-detail',
  imports: [RouterLink, Icon, Breadcrumbs, SolutionCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solution-detail.html',
  styleUrl: './solution-detail.scss',
})
export class SolutionDetail {
  readonly slug = input.required<string>();
  protected readonly s = computed(() => findSolution(this.slug()));
  protected readonly category = computed(() => (this.s() ? categoryLabel(this.s()!.category) : ''));
  protected readonly backend = computed(() => (this.s() ? BACKEND_LABEL[this.s()!.backend] : ''));
  protected readonly plan = computed(() => (this.s() ? findPlan(this.s()!.plan) : null));
  protected readonly demo = computed(() => DEMO_MODULES.find((d) => d.id === this.s()?.demo) ?? null);
  protected readonly related = computed(() => {
    const s = this.s();
    if (!s) return [];
    const same = SOLUTIONS.filter((x) => x.slug !== s.slug && x.category === s.category);
    const rest = SOLUTIONS.filter((x) => x.slug !== s.slug && x.category !== s.category && x.plan === s.plan);
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
