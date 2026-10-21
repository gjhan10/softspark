import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="theme.toggle()" [attr.aria-label]="theme.theme() === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'" [attr.title]="theme.theme() === 'dark' ? 'Tema claro' : 'Tema oscuro'">
      <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" />
    </button>
  `,
  styles: `
    button {
      display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid var(--line); border-radius: var(--r-md);
      background: transparent; color: var(--text-2); cursor: pointer; transition: color var(--t-fast), background-color var(--t-fast);
    }
    button:hover { color: var(--text); background: var(--surface-2); }
    app-icon { transition: transform var(--t-base) var(--ease); }
    button:active app-icon { transform: rotate(40deg); }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
}
