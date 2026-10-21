import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { categoryLabel, Solution } from '../../data/solutions.data';
import { Icon } from '../icon/icon';
import { ImplBadges } from '../impl-badges/impl-badges';
import { SolutionPreview } from '../solution-preview/solution-preview';

@Component({
  selector: 'app-solution-card',
  imports: [RouterLink, Icon, ImplBadges, SolutionPreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.featured]': 'featured()' },
  template: `
    <article class="card sc" [attr.data-family]="solution().family">
      <app-solution-preview class="media" [slug]="solution().slug" [wide]="featured()" />
      <div class="body">
        <span class="cat">{{ category() }}</span>
        <h3>
          <a class="stretched" [routerLink]="['/soluciones', solution().slug]">{{ solution().name }}</a>
        </h3>
        <p class="sum">{{ solution().summary }}</p>
        <ul class="caps" [attr.aria-label]="'Capacidades de ' + solution().name">
          @for (c of caps(); track c) {
            <li><app-icon name="check" [size]="14" /> {{ c }}</li>
          }
        </ul>
        <div class="foot">
          <app-impl-badges [solution]="solution()" />
          <span class="go" aria-hidden="true">Ver solución <app-icon name="arrow-right" [size]="15" /></span>
        </div>
      </div>
    </article>
  `,
  styleUrl: './solution-card.scss',
})
export class SolutionCard {
  readonly solution = input.required<Solution>();
  readonly featured = input(false);
  protected readonly category = computed(() => categoryLabel(this.solution().category));
  protected readonly caps = computed(() => this.solution().capabilities.slice(0, this.featured() ? 3 : 2));
}
