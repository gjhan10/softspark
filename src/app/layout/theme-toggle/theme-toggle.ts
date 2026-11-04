import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      class="switch"
      [class.dark]="dark()"
      [attr.aria-checked]="dark()"
      aria-label="Tema oscuro"
      [attr.title]="dark() ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
      (click)="theme.toggle()"
    >
      <span class="track" aria-hidden="true">
        <app-icon name="sun" [size]="14" class="i sun" />
        <app-icon name="moon" [size]="14" class="i moon" />
        <span class="thumb"></span>
      </span>
    </button>
  `,
  styles: `
    .switch { display: grid; place-items: center; min-width: var(--tap); height: var(--tap); padding: 0; border: 0; background: none; cursor: pointer; border-radius: var(--r-pill); }
    .track {
      position: relative; display: flex; align-items: center; justify-content: space-between; width: 58px; height: 32px; padding: 0 9px;
      border: 1px solid var(--line); border-radius: var(--r-pill); background: var(--surface-2); color: var(--text-3);
      transition: background-color var(--t-base) var(--ease), border-color var(--t-base) var(--ease);
    }
    .thumb {
      position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: var(--surface); box-shadow: var(--shadow-1), 0 0 0 1px var(--line);
      transition: transform var(--t-base) var(--ease-out), background-color var(--t-base) var(--ease);
    }
    .i { position: relative; z-index: 1; transition: color var(--t-base) var(--ease), transform var(--t-base) var(--ease-out); }
    .switch:not(.dark) .sun { color: #b45309; }
    .switch.dark .thumb { transform: translateX(26px); background: var(--surface-3); }
    .switch.dark .moon { color: var(--accent); transform: rotate(-20deg); }
    .switch:hover .track { border-color: var(--line-strong); }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly dark = computed(() => this.theme.theme() === 'dark');
}
