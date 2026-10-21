import { computed, Injectable, signal } from '@angular/core';
import { Opportunity, Product, seedOpportunities, seedOrders, seedProducts, seedTasks, Stage, STAGES, Task, TaskStatus, TASK_STATUSES } from './demo-data';

@Injectable()
export class DemoStore {
  readonly opportunities = signal<Opportunity[]>(seedOpportunities());
  readonly products = signal<Product[]>(seedProducts());
  readonly tasks = signal<Task[]>(seedTasks());
  readonly orders = signal(seedOrders());
  readonly changes = signal(0);

  readonly pipelineValue = computed(() => this.opportunities().filter((o) => o.stage !== 'ganada' && o.stage !== 'perdida').reduce((t, o) => t + o.value, 0));
  readonly wonValue = computed(() => this.opportunities().filter((o) => o.stage === 'ganada').reduce((t, o) => t + o.value, 0));
  readonly lowStock = computed(() => this.products().filter((p) => p.stock <= p.min));
  readonly openTasks = computed(() => this.tasks().filter((t) => t.status !== 'hecho').length);

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

  reset(): void {
    this.opportunities.set(seedOpportunities());
    this.products.set(seedProducts());
    this.tasks.set(seedTasks());
    this.orders.set(seedOrders());
    this.changes.set(0);
  }
}
