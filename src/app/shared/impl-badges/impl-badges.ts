import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BACKEND_LABEL, Solution } from '../../data/solutions.data';
import { Icon, IconName } from '../icon/icon';

const BACKEND_META: Record<Solution['backend'], { icon: IconName; tone: string; hint: string }> = {
  no: { icon: 'globe', tone: 'ok', hint: 'Puede publicarse sin servidor propio' },
  opcional: { icon: 'layers', tone: 'cyan', hint: 'Funciona como sitio estático y admite backend para funciones extra' },
  si: { icon: 'server', tone: 'accent', hint: 'Necesita API, base de datos e infraestructura' },
};

@Component({
  selector: 'app-impl-badges',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [attr.data-tone]="meta().tone" [attr.title]="meta().hint">
      <app-icon [name]="meta().icon" [size]="13" /> {{ label() }}
    </span>
    @if (solution().external) {
      <span class="badge" data-tone="neutral" title="Depende de servicios o APIs de terceros">
        <app-icon name="link" [size]="13" /> Servicios externos
      </span>
    }
  `,
  styles: `
    :host { display: flex; flex-wrap: wrap; gap: var(--s-2); }
    .badge {
      display: inline-flex; align-items: center; gap: var(--s-1); padding: 3px var(--s-2) 3px var(--s-2); border-radius: var(--r-pill);
      font: 500 var(--fs-2xs)/1.4 var(--font-body); white-space: nowrap; border: 1px solid transparent;
    }
    [data-tone='ok'] { background: var(--ok-soft); color: var(--ok); }
    [data-tone='cyan'] { background: var(--cyan-soft); color: var(--cyan); }
    [data-tone='accent'] { background: var(--accent-soft); color: var(--accent); }
    [data-tone='neutral'] { border-color: var(--line-strong); color: var(--text-2); }
  `,
})
export class ImplBadges {
  readonly solution = input.required<Solution>();
  protected readonly meta = computed(() => BACKEND_META[this.solution().backend]);
  protected readonly label = computed(() => BACKEND_LABEL[this.solution().backend]);
}
