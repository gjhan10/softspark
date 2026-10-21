import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        <li><a routerLink="/">Inicio</a></li>
        @for (c of items(); track c.label; let last = $last) {
          <li>
            @if (c.path && !last) {
              <a [routerLink]="c.path">{{ c.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null">{{ c.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class Breadcrumbs {
  readonly items = input.required<Crumb[]>();
}
