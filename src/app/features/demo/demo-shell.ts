import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { Icon } from '../../shared/icon/icon';
import { ToastService } from '../../shared/toast/toast';
import { DEMO_MODULES, isDemoModule } from './demo-modules';
import { DemoStore } from './demo-store';
import { DemoAnalytics } from './modules/demo-analytics';
import { DemoCrm } from './modules/demo-crm';
import { DemoInventory } from './modules/demo-inventory';
import { DemoPanel } from './modules/demo-panel';
import { DemoProjects } from './modules/demo-projects';

@Component({
  selector: 'app-demo-shell',
  imports: [RouterLink, RouterLinkActive, Icon, DemoPanel, DemoCrm, DemoInventory, DemoAnalytics, DemoProjects],
  providers: [DemoStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-shell.html',
  styleUrl: './demo-shell.scss',
  host: { ngSkipHydration: 'true' },
})
export class DemoShell {
  readonly modulo = input<string>('panel');
  protected readonly store = inject(DemoStore);
  private readonly toast = inject(ToastService);
  protected readonly modules = DEMO_MODULES;
  protected readonly current = computed(() => (isDemoModule(this.modulo()) ? DEMO_MODULES.find((m) => m.id === this.modulo())! : null));

  constructor() {
    const seo = inject(Seo);
    effect(() => {
      const m = this.current();
      seo.set({
        title: m ? `Demo: ${m.label}` : 'Demo',
        description: 'Demostración interactiva de un panel administrativo con datos ficticios: dashboard, CRM, inventario, analítica y proyectos. Funciona en el navegador, sin backend.',
        path: m ? `demo/${m.id}` : 'demo',
        noindex: !m,
      });
    });
  }

  protected reset(): void {
    this.store.reset();
    this.toast.show('Datos de la demo restablecidos.', 'info');
  }
}
