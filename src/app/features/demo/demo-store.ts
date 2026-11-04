import { computed, Injectable, signal } from '@angular/core';
import {
  Invoice,
  Opportunity,
  PO_STATUSES,
  PoStatus,
  Product,
  PurchaseOrder,
  RunLog,
  seedInvoices,
  seedOpportunities,
  seedOrders,
  seedProducts,
  seedPurchaseOrders,
  seedRuns,
  seedTasks,
  seedWorkflows,
  Stage,
  STAGES,
  Task,
  TaskStatus,
  TASK_STATUSES,
  Workflow,
} from './demo-data';

/** Resultado previsto de una ejecución simulada de un flujo. */
export interface RunPlan {
  ok: boolean;
  /** Índice del paso que falla, o null si todo sale bien. */
  failStep: number | null;
  durationMs: number;
}

@Injectable()
export class DemoStore {
  readonly opportunities = signal<Opportunity[]>(seedOpportunities());
  readonly products = signal<Product[]>(seedProducts());
  readonly tasks = signal<Task[]>(seedTasks());
  readonly orders = signal(seedOrders());
  readonly purchaseOrders = signal<PurchaseOrder[]>(seedPurchaseOrders());
  readonly invoices = signal<Invoice[]>(seedInvoices());
  readonly workflows = signal<Workflow[]>(seedWorkflows());
  readonly runs = signal<RunLog[]>(seedRuns());
  readonly changes = signal(0);
  /** Aumenta en cada restablecimiento; sirve para descartar simulaciones en curso. */
  readonly version = signal(0);

  readonly pipelineValue = computed(() => this.opportunities().filter((o) => o.stage !== 'ganada' && o.stage !== 'perdida').reduce((t, o) => t + o.value, 0));
  readonly wonValue = computed(() => this.opportunities().filter((o) => o.stage === 'ganada').reduce((t, o) => t + o.value, 0));
  readonly lowStock = computed(() => this.products().filter((p) => p.stock <= p.min));
  readonly openTasks = computed(() => this.tasks().filter((t) => t.status !== 'hecho').length);

  readonly openPurchases = computed(() => this.purchaseOrders().filter((o) => o.status !== 'recibida'));
  readonly receivable = computed(() => this.invoices().filter((i) => i.status !== 'pagada').reduce((t, i) => t + i.total, 0));
  readonly overdue = computed(() => this.invoices().filter((i) => i.status === 'vencida'));

  advance(id: number): Stage | null {
    const current = this.opportunities().find((o) => o.id === id);
    const order: Stage[] = STAGES.map((s) => s.id).filter((s) => s !== 'perdida');
    const i = current ? order.indexOf(current.stage) : -1;
    if (i < 0 || i >= order.length - 1) return null;
    const next = order[i + 1];
    this.opportunities.update((list) => list.map((o) => (o.id === id ? { ...o, stage: next, updated: 'ahora' } : o)));
    this.changes.update((n) => n + 1);
    return next;
  }

  markLost(id: number): void {
    this.opportunities.update((list) => list.map((o) => (o.id === id ? { ...o, stage: 'perdida' as Stage, updated: 'ahora' } : o)));
    this.changes.update((n) => n + 1);
  }

  adjustStock(sku: string, delta: number): void {
    this.products.update((list) => list.map((p) => (p.sku === sku ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
    this.changes.update((n) => n + 1);
  }

  addProduct(p: Omit<Product, 'sku'>): string {
    const max = Math.max(1000, ...this.products().map((x) => Number(x.sku.slice(4)) || 0));
    const sku = `SKU-${max + 1}`;
    this.products.update((list) => [{ ...p, sku }, ...list]);
    this.changes.update((n) => n + 1);
    return sku;
  }

  moveTask(id: number, dir: -1 | 1): void {
    const ids = TASK_STATUSES.map((s) => s.id);
    this.tasks.update((list) =>
      list.map((t) => {
        if (t.id !== id) return t;
        const i = Math.min(ids.length - 1, Math.max(0, ids.indexOf(t.status) + dir));
        return { ...t, status: ids[i] as TaskStatus };
      }),
    );
    this.changes.update((n) => n + 1);
  }

  addTask(t: Omit<Task, 'id' | 'status'>): void {
    const id = Math.max(0, ...this.tasks().map((x) => x.id)) + 1;
    this.tasks.update((list) => [...list, { ...t, id, status: 'pendiente' }]);
    this.changes.update((n) => n + 1);
  }

  /** Avanza una orden de compra: borrador → aprobada → recibida. Devuelve el nuevo estado o null si ya no puede avanzar. */
  advancePurchase(code: string): PoStatus | null {
    const order = PO_STATUSES.map((s) => s.id);
    const current = this.purchaseOrders().find((o) => o.code === code);
    const i = current ? order.indexOf(current.status) : -1;
    if (i < 0 || i >= order.length - 1) return null;
    const next = order[i + 1];
    this.purchaseOrders.update((list) => list.map((o) => (o.code === code ? { ...o, status: next, updated: 'ahora' } : o)));
    this.changes.update((n) => n + 1);
    return next;
  }

  /** Registra el pago de una factura pendiente o vencida. Devuelve false si no existe o ya estaba pagada. */
  markPaid(code: string): boolean {
    const inv = this.invoices().find((i) => i.code === code);
    if (!inv || inv.status === 'pagada') return false;
    this.invoices.update((list) => list.map((i) => (i.code === code ? { ...i, status: 'pagada', due: 'pagada ahora' } : i)));
    this.changes.update((n) => n + 1);
    return true;
  }

  /** Activa o pausa un flujo. Devuelve el nuevo estado (true = activo) o null si no existe. */
  toggleWorkflow(id: number): boolean | null {
    const wf = this.workflows().find((w) => w.id === id);
    if (!wf) return null;
    const active = !wf.active;
    this.workflows.update((list) => list.map((w) => (w.id === id ? { ...w, active } : w)));
    this.changes.update((n) => n + 1);
    return active;
  }

  /** Calcula, de forma determinista, cómo saldrá la próxima ejecución de un flujo. */
  planRun(id: number): RunPlan | null {
    const wf = this.workflows().find((w) => w.id === id);
    if (!wf) return null;
    const runNo = this.runs().filter((r) => r.workflowId === id).length + 1;
    const fails = !!wf.failEvery && runNo % wf.failEvery === 0;
    const failStep = fails ? Math.min(wf.failStep ?? 0, wf.steps.length - 1) : null;
    const stepsDone = failStep === null ? wf.steps.length : failStep + 1;
    const durationMs = stepsDone * 520 + ((id * 131 + runNo * 97) % 400);
    return { ok: !fails, failStep, durationMs };
  }

  /** Ejecuta un flujo (simulado) y agrega la entrada al registro. */
  runWorkflow(id: number, time = currentTime()): RunLog | null {
    const wf = this.workflows().find((w) => w.id === id);
    const plan = this.planRun(id);
    if (!wf || !plan) return null;
    const entry: RunLog = {
      id: Math.max(0, ...this.runs().map((r) => r.id)) + 1,
      workflowId: id,
      time,
      status: plan.ok ? 'ok' : 'error',
      durationMs: plan.durationMs,
      detail: plan.ok ? `Ejecución manual: ${wf.steps.length} pasos completados` : `Falló «${wf.steps[plan.failStep!]}»: el servicio no respondió (simulado)`,
    };
    this.runs.update((list) => [entry, ...list]);
    this.changes.update((n) => n + 1);
    return entry;
  }

  reset(): void {
    this.opportunities.set(seedOpportunities());
    this.products.set(seedProducts());
    this.tasks.set(seedTasks());
    this.orders.set(seedOrders());
    this.purchaseOrders.set(seedPurchaseOrders());
    this.invoices.set(seedInvoices());
    this.workflows.set(seedWorkflows());
    this.runs.set(seedRuns());
    this.changes.set(0);
    this.version.update((n) => n + 1);
  }
}

function currentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
