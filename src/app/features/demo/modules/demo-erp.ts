import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../shared/toast/toast';
import { BarChart } from '../charts';
import { INVOICE_STATUSES, InvoiceStatus, money, PO_STATUSES, PoStatus, PurchaseOrder } from '../demo-data';
import { DemoStore } from '../demo-store';

@Component({
  selector: 'app-demo-erp',
  imports: [Icon, BarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>ERP: compras y facturación</h2>
        <p>Órdenes de compra y facturas de una empresa ficticia. Aprueba, recibe y registra pagos.</p>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><small>Órdenes de compra abiertas</small><strong>{{ store.openPurchases().length }}</strong><em>{{ money(openValue()) }} comprometido</em></div>
      <div class="kpi"><small>Por cobrar</small><strong>{{ money(store.receivable()) }}</strong><em>{{ invCount('pendiente') + invCount('vencida') }} facturas sin pagar</em></div>
      <div class="kpi"><small>Facturas vencidas</small><strong>{{ store.overdue().length }}</strong><em>{{ money(overdueValue()) }} en riesgo</em></div>
      <div class="kpi"><small>Cobrado</small><strong>{{ money(invTotal('pagada')) }}</strong><em>{{ invCount('pagada') }} facturas pagadas</em></div>
    </div>

    <div class="cols">
      <div class="panel">
        <h3>Facturación por estado <span class="tag">Datos sintéticos</span></h3>
        <app-bar-chart [values]="chartValues()" [labels]="chartLabels" label="Importe de facturas por estado" [format]="money" />
      </div>
      <div class="panel">
        <h3>Facturas vencidas</h3>
        @if (store.overdue().length) {
          <ul class="alerts">
            @for (i of store.overdue(); track i.code) {
              <li>
                <span class="tag" data-tone="danger">Vencida</span>
                <span class="name">{{ i.customer }}<br /><span class="muted">{{ i.code }} · {{ i.due }}</span></span>
                <span class="num">{{ money(i.total) }}</span>
              </li>
            }
          </ul>
        } @else {
          <div class="empty"><app-icon name="check" [size]="24" /><strong>Sin facturas vencidas</strong><p>Todos los cobros vencidos están registrados.</p></div>
        }
      </div>
    </div>

    <div class="panel">
      <h3>Órdenes de compra <span class="tag">Proveedores ficticios</span></h3>
      <div class="grid-gap">
        <div class="toolbar">
          <label class="search">
            <span class="sr-only">Buscar órdenes de compra</span>
            <app-icon name="search" [size]="18" />
            <input class="input" type="search" placeholder="Buscar por proveedor o código" [value]="poQuery()" (input)="poQuery.set($any($event.target).value)" />
          </label>
          <label class="sr-only" for="erp-po-status">Estado de la orden</label>
          <select id="erp-po-status" class="input" [value]="poStatus()" (change)="poStatus.set($any($event.target).value)">
            <option value="">Todos los estados</option>
            @for (s of poStatuses; track s.id) { <option [value]="s.id">{{ s.label }}</option> }
          </select>
        </div>
        <p class="result-count" aria-live="polite">{{ poRows().length }} {{ poRows().length === 1 ? 'orden' : 'órdenes' }}</p>
        @if (poRows().length) {
          <div class="table-wrap">
            <table class="responsive">
              <thead><tr><th scope="col">Orden</th><th scope="col">Proveedor</th><th scope="col">Estado</th><th scope="col" class="num">Total</th><th scope="col">Acción</th></tr></thead>
              <tbody>
                @for (o of poRows(); track o.code) {
                  <tr>
                    <td data-label="Orden"><code>{{ o.code }}</code><br /><span class="muted">{{ o.updated }}</span></td>
                    <td data-label="Proveedor" class="wide"><strong>{{ o.supplier }}</strong><br /><span class="muted">{{ o.item }}</span></td>
                    <td data-label="Estado"><span class="tag" [attr.data-tone]="poTone[o.status]">{{ poLabel(o.status) }}</span></td>
                    <td data-label="Total" class="num">{{ money(o.total) }}</td>
                    <td data-label="Acción" class="wide">
                      @if (o.status === 'recibida') {
                        <span class="muted done"><app-icon name="check" [size]="14" /> Completada</span>
                      } @else {
                        <button type="button" class="btn btn-secondary btn-sm" (click)="advance(o)" [attr.aria-label]="poAction(o) + ' ' + o.code">{{ poAction(o) }}</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty">
            <app-icon name="file" [size]="28" />
            <strong>No hay órdenes con esos filtros</strong>
            <button type="button" class="btn btn-secondary btn-sm" (click)="clearPo()">Limpiar filtros</button>
          </div>
        }
      </div>
    </div>

    <div class="panel">
      <h3>Facturas emitidas</h3>
      <div class="grid-gap">
        <div class="chips" role="group" aria-label="Filtrar facturas por estado">
          <button type="button" class="chip" [attr.aria-pressed]="invStatus() === 'todas'" (click)="invStatus.set('todas')">Todas <span class="count">{{ store.invoices().length }}</span></button>
          @for (s of invStatuses; track s.id) {
            <button type="button" class="chip" [attr.aria-pressed]="invStatus() === s.id" (click)="invStatus.set(s.id)">{{ s.label }} <span class="count">{{ invCount(s.id) }}</span></button>
          }
        </div>
        <div class="toolbar">
          <label class="search">
            <span class="sr-only">Buscar facturas</span>
            <app-icon name="search" [size]="18" />
            <input class="input" type="search" placeholder="Buscar por cliente o número" [value]="invQuery()" (input)="invQuery.set($any($event.target).value)" />
          </label>
        </div>
        <p class="result-count" aria-live="polite">{{ invRows().length }} {{ invRows().length === 1 ? 'factura' : 'facturas' }}</p>
        @if (invRows().length) {
          <div class="table-wrap">
            <table class="responsive">
              <thead><tr><th scope="col">Factura</th><th scope="col">Cliente</th><th scope="col">Estado</th><th scope="col">Vencimiento</th><th scope="col" class="num">Total</th><th scope="col">Acción</th></tr></thead>
              <tbody>
                @for (i of invRows(); track i.code) {
                  <tr>
                    <td data-label="Factura"><code>{{ i.code }}</code></td>
                    <td data-label="Cliente">{{ i.customer }}</td>
                    <td data-label="Estado"><span class="tag" [attr.data-tone]="invTone[i.status]">{{ invLabel(i.status) }}</span></td>
                    <td data-label="Vencimiento" class="muted">{{ i.due }}</td>
                    <td data-label="Total" class="num">{{ money(i.total) }}</td>
                    <td data-label="Acción" class="wide">
                      @if (i.status === 'pagada') {
                        <span class="muted done"><app-icon name="check" [size]="14" /> Pagada</span>
                      } @else {
                        <button type="button" class="btn btn-secondary btn-sm" (click)="pay(i.code)" [attr.aria-label]="'Registrar pago de ' + i.code">Registrar pago</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty">
            <app-icon name="search" [size]="28" />
            <strong>No hay facturas con esos filtros</strong>
            <button type="button" class="btn btn-secondary btn-sm" (click)="clearInv()">Limpiar filtros</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .muted { color: var(--text-3); font-size: var(--fs-xs); }
    .done { display: inline-flex; align-items: center; gap: var(--s-1); min-height: var(--btn-h-sm); }
    .grid-gap { display: grid; gap: var(--s-3); }
    .alerts { list-style: none; display: grid; gap: var(--s-2); }
    .alerts li { display: grid; grid-template-columns: auto 1fr auto; gap: var(--s-3); align-items: center; padding: var(--s-2) 0; border-bottom: 1px solid var(--line); font-size: var(--fs-sm); }
    .alerts .name { min-width: 0; overflow-wrap: anywhere; }
    .alerts .num { font-variant-numeric: tabular-nums; }
  `,
})
export class DemoErp {
  protected readonly store = inject(DemoStore);
  private readonly toast = inject(ToastService);
  protected readonly money = money;
  protected readonly poStatuses = PO_STATUSES;
  protected readonly invStatuses = INVOICE_STATUSES;
  protected readonly poTone: Record<PoStatus, string> = { borrador: 'accent', aprobada: 'cyan', recibida: 'ok' };
  protected readonly invTone: Record<InvoiceStatus, string> = { pendiente: 'warn', vencida: 'danger', pagada: 'ok' };
  protected readonly chartLabels = INVOICE_STATUSES.map((s) => s.label);

  protected readonly poQuery = signal('');
  protected readonly poStatus = signal<PoStatus | ''>('');
  protected readonly invQuery = signal('');
  protected readonly invStatus = signal<InvoiceStatus | 'todas'>('todas');

  protected readonly openValue = computed(() => this.store.openPurchases().reduce((t, o) => t + o.total, 0));
  protected readonly overdueValue = computed(() => this.store.overdue().reduce((t, i) => t + i.total, 0));
  protected readonly chartValues = computed(() => INVOICE_STATUSES.map((s) => this.invTotal(s.id)));

  protected readonly poRows = computed(() => {
    const q = this.poQuery().trim().toLowerCase();
    return this.store
      .purchaseOrders()
      .filter((o) => !this.poStatus() || o.status === this.poStatus())
      .filter((o) => !q || o.supplier.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) || o.item.toLowerCase().includes(q));
  });

  protected readonly invRows = computed(() => {
    const q = this.invQuery().trim().toLowerCase();
    return this.store
      .invoices()
      .filter((i) => this.invStatus() === 'todas' || i.status === this.invStatus())
      .filter((i) => !q || i.customer.toLowerCase().includes(q) || i.code.toLowerCase().includes(q));
  });

  protected invCount(s: InvoiceStatus): number {
    return this.store.invoices().filter((i) => i.status === s).length;
  }

  protected invTotal(s: InvoiceStatus): number {
    return this.store.invoices().filter((i) => i.status === s).reduce((t, i) => t + i.total, 0);
  }

  protected poLabel(s: PoStatus): string {
    return PO_STATUSES.find((x) => x.id === s)!.label;
  }

  protected invLabel(s: InvoiceStatus): string {
    return INVOICE_STATUSES.find((x) => x.id === s)!.label;
  }

  protected poAction(o: PurchaseOrder): string {
    return o.status === 'borrador' ? 'Aprobar' : 'Marcar recibida';
  }

  protected advance(o: PurchaseOrder): void {
    const next = this.store.advancePurchase(o.code);
    if (next) this.toast.show(`${o.code} pasó a «${this.poLabel(next)}» (solo en esta demo).`);
  }

  protected pay(code: string): void {
    if (this.store.markPaid(code)) this.toast.show(`Pago de ${code} registrado (solo en esta demo).`);
  }

  protected clearPo(): void {
    this.poQuery.set('');
    this.poStatus.set('');
  }

  protected clearInv(): void {
    this.invQuery.set('');
    this.invStatus.set('todas');
  }
}
