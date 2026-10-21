import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';
import { BarChart } from '../charts';
import { money, num } from '../demo-data';
import { DemoStore } from '../demo-store';

@Component({
  selector: 'app-demo-panel',
  imports: [RouterLink, Icon, BarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>Dashboard empresarial</h2>
        <p>Resumen de la operación de una empresa ficticia.</p>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><small>Ventas del mes</small><strong>{{ money(128450) }}</strong><em>+8,2 % vs. mes anterior</em></div>
      <div class="kpi"><small>Oportunidades abiertas</small><strong>{{ money(store.pipelineValue()) }}</strong><em>{{ openCount() }} en curso</em></div>
      <div class="kpi"><small>Productos con stock bajo</small><strong>{{ store.lowStock().length }}</strong><em>de {{ store.products().length }} productos</em></div>
      <div class="kpi"><small>Tareas abiertas</small><strong>{{ store.openTasks() }}</strong><em>de {{ store.tasks().length }} tareas</em></div>
    </div>

    <div class="cols">
      <div class="panel">
        <h3>Pedidos por semana <span class="tag">Datos sintéticos</span></h3>
        <app-bar-chart [values]="weekly" [labels]="weeks" label="Pedidos por semana" [format]="num" />
      </div>
      <div class="panel">
        <h3>Alertas</h3>
        @if (store.lowStock().length) {
          <ul class="alerts">
            @for (p of store.lowStock().slice(0, 5); track p.sku) {
              <li>
                <span class="tag" [attr.data-tone]="p.stock === 0 ? 'danger' : 'warn'">{{ p.stock === 0 ? 'Sin stock' : 'Stock bajo' }}</span>
                <span class="name">{{ p.name }}</span>
                <span class="muted">{{ p.stock }} / mín. {{ p.min }}</span>
              </li>
            }
          </ul>
          <a routerLink="/demo/inventario" class="link">Ir a inventario <app-icon name="arrow-right" [size]="16" /></a>
        } @else {
          <div class="empty"><app-icon name="check" [size]="24" /><strong>Sin alertas</strong><p>Todo el stock está por encima del mínimo.</p></div>
        }
      </div>
    </div>

    <div class="panel">
      <h3>Pedidos recientes</h3>
      <div class="table-wrap">
        <table class="responsive">
          <thead><tr><th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Estado</th><th scope="col" class="num">Total</th></tr></thead>
          <tbody>
            @for (o of store.orders(); track o.code) {
              <tr>
                <td data-label="Pedido"><code>{{ o.code }}</code></td>
                <td data-label="Cliente">{{ o.customer }}</td>
                <td data-label="Estado"><span class="tag" [attr.data-tone]="o.status === 'pagado' ? 'ok' : o.status === 'enviado' ? 'cyan' : 'warn'">{{ statusLabel[o.status] }}</span></td>
                <td data-label="Total" class="num">{{ money(o.total) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .alerts { list-style: none; display: grid; gap: 8px; margin-bottom: 14px; }
    .alerts li { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--line); font-size: 0.9rem; }
    .alerts .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .muted { color: var(--text-3); font-size: 0.82rem; }
  `,
})
export class DemoPanel {
  protected readonly store = inject(DemoStore);
  protected readonly money = money;
  protected readonly num = num;
  protected readonly weekly = [212, 248, 231, 276, 259, 301, 288, 334];
  protected readonly weeks = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
  protected readonly statusLabel = { pagado: 'Pagado', pendiente: 'Pendiente', enviado: 'Enviado' };
  protected readonly openCount = computed(() => this.store.opportunities().filter((o) => o.stage !== 'ganada' && o.stage !== 'perdida').length);
}
