import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { FEATURE_GROUPS, FEATURE_STATES, FeatureState, PlanId, PLAN_CONDITIONS, PLANS, planPrice } from '../../data/plans.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-plans',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class Plans {
  protected readonly plans = PLANS;
  protected readonly groups = FEATURE_GROUPS;
  protected readonly states = FEATURE_STATES;
  protected readonly stateOrder: FeatureState[] = ['incluido', 'opcional', 'evaluacion', 'no'];
  protected readonly conditions = PLAN_CONDITIONS;
  protected readonly price = planPrice;
  protected readonly selected = signal<PlanId>('pro');
  protected readonly scope = signal<'todos' | 'web' | 'sistemas'>('todos');
  protected readonly group = signal<string>('todos');
  protected readonly selectedPlan = computed(() => PLANS.find((p) => p.id === this.selected())!);
  protected readonly visiblePlans = computed(() => PLANS.filter((p) => this.scope() === 'todos' || p.scope === this.scope()));
  protected readonly visibleGroups = computed(() => FEATURE_GROUPS.filter((g) => this.group() === 'todos' || g.id === this.group()));
  private readonly radios = viewChildren<ElementRef<HTMLElement>>('radio');

  constructor() {
    inject(Seo).set({
      title: 'Planes',
      description: 'Planes Standard, Pro, Premium y Enterprise: compara qué incluye cada nivel, qué es opcional y qué se evalúa según el proyecto. Precios bajo cotización.',
      path: 'planes',
    });
  }

  protected select(id: PlanId): void {
    this.selected.set(id);
  }

  protected setScope(scope: 'todos' | 'web' | 'sistemas'): void {
    this.scope.set(scope);
    const visible = this.visiblePlans();
    if (!visible.some((p) => p.id === this.selected())) this.selected.set(visible[0].id);
  }

  protected onKey(event: KeyboardEvent, index: number): void {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const list = this.visiblePlans();
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % list.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + list.length) % list.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = list.length - 1;
    this.selected.set(list[next].id);
    this.radios()[next]?.nativeElement.focus();
  }

  protected icon(state: FeatureState) {
    return state === 'incluido' ? 'check' : state === 'opcional' ? 'plus' : state === 'evaluacion' ? 'info' : 'minus';
  }
}
