import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BACKEND_LABEL, categoryLabel, Solution } from '../../data/solutions.data';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-solution-card',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="card tile" [routerLink]="['/soluciones', solution().slug]">
      <div class="top">
        <span class="ico"><app-icon [name]="solution().icon" [size]="22" /></span>
        <span class="tag">{{ category() }}</span>
      </div>
      <h3>{{ solution().name }}</h3>
      <p>{{ solution().summary }}</p>
      <div class="meta">
        <span class="tag" [attr.data-tone]="solution().backend === 'no' ? 'ok' : solution().backend === 'si' ? 'warn' : 'cyan'">{{ backend() }}</span>
        <span class="go">Ver ficha <app-icon name="arrow-right" [size]="16" /></span>
      </div>
    </a>
  `,
  styles: `
    :host { display: block; }
    .tile { height: 100%; display: grid; grid-template-rows: auto auto 1fr auto; gap: 12px; padding: 22px; text-decoration: none; transition: border-color var(--t-fast), transform var(--t-base) var(--ease), background-color var(--t-fast); }
    .tile:hover { border-color: var(--line-strong); background: var(--surface-2); }
    @media (hover: hover) { .tile:hover { transform: translateY(-3px); } }
    .top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .ico { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: var(--accent-soft); color: var(--accent); }
    h3 { font-size: 1.2rem; }
    p { color: var(--text-2); font-size: 0.95rem; }
    .meta { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid var(--line); }
    .go { display: inline-flex; align-items: center; gap: 6px; color: var(--accent); font-weight: 500; font-size: 0.9rem; }
    .go app-icon { transition: transform var(--t-fast); }
    .tile:hover .go app-icon { transform: translateX(3px); }
  `,
})
export class SolutionCard {
  readonly solution = input.required<Solution>();
  protected readonly category = computed(() => categoryLabel(this.solution().category));
  protected readonly backend = computed(() => BACKEND_LABEL[this.solution().backend]);
}
