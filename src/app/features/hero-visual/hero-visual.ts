import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon, IconName } from '../../shared/icon/icon';

@Component({
  selector: 'app-hero-visual',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure>
      <div class="window" aria-hidden="true">
        <div class="chrome"><i></i><i></i><i></i><span>panel.softspark</span></div>
        <div class="app">
          <aside>
            @for (m of menu; track m.icon; let first = $first) {
              <span class="item" [class.on]="first"><app-icon [name]="m.icon" [size]="16" /><b>{{ m.label }}</b></span>
            }
          </aside>
          <div class="main">
            <div class="kpis">
              @for (k of kpis; track k.label) {
                <div class="kpi">
                  <small>{{ k.label }}</small>
                  <strong>{{ k.value }}</strong>
                  <em [class.down]="k.delta.startsWith('-')">{{ k.delta }}</em>
                </div>
              }
            </div>
            <div class="chart">
              <div class="chart-head"><small>Pedidos por semana</small><span class="pill">8 semanas</span></div>
              <div class="bars">
                @for (b of bars; track $index) {
                  <span [style.height.%]="b" [style.animation-delay.ms]="$index * 60"></span>
                }
              </div>
            </div>
            <div class="rows">
              @for (r of rows; track r.name) {
                <div class="row"><span class="dot" [attr.data-s]="r.state"></span><b>{{ r.name }}</b><small>{{ r.stage }}</small></div>
              }
            </div>
          </div>
        </div>
      </div>
      <div class="modules" aria-hidden="true">
        @for (n of nodes; track n) {
          <span class="node">{{ n }}</span>
        }
        <span class="pulse"></span>
      </div>
      <figcaption>Composición ilustrativa con datos ficticios</figcaption>
    </figure>
  `,
  styleUrl: './hero-visual.scss',
})
export class HeroVisual {
  protected readonly menu: { icon: IconName; label: string }[] = [
    { icon: 'grid', label: 'Panel' },
    { icon: 'users', label: 'Clientes' },
    { icon: 'box', label: 'Inventario' },
    { icon: 'trending', label: 'Analítica' },
    { icon: 'kanban', label: 'Proyectos' },
  ];
  protected readonly kpis = [
    { label: 'Pedidos', value: '1 284', delta: '+12,4 %' },
    { label: 'Clientes activos', value: '342', delta: '+4,1 %' },
    { label: 'Stock bajo', value: '7', delta: '-3' },
  ];
  protected readonly bars = [42, 55, 48, 66, 58, 74, 69, 88];
  protected readonly rows = [
    { name: 'Alfa Distribuciones', stage: 'Propuesta', state: 'a' },
    { name: 'Beta Logística', stage: 'Negociación', state: 'b' },
    { name: 'Gamma Salud', stage: 'Ganada', state: 'c' },
  ];
  protected readonly nodes = ['Web', 'API', 'ERP', 'CRM'];
}
