import { DemoStore } from './demo-store';

describe('DemoStore', () => {
  it('avanza oportunidades por etapas y no pasa de «ganada»', () => {
    const s = new DemoStore();
    const id = s.opportunities().find((o) => o.stage === 'negociacion')!.id;
    expect(s.advance(id)).toBe('ganada');
    expect(s.advance(id)).toBeNull();
  });

  it('ajusta el stock sin bajar de cero y recalcula las alertas', () => {
    const s = new DemoStore();
    const before = s.lowStock().length;
    s.adjustStock('SKU-1006', -5);
    expect(s.products().find((p) => p.sku === 'SKU-1006')!.stock).toBe(0);
    s.adjustStock('SKU-1002', 20);
    expect(s.lowStock().length).toBe(before - 1);
  });

  it('agrega productos y tareas en memoria y se restablece', () => {
    const s = new DemoStore();
    const sku = s.addProduct({ name: 'Producto de prueba', category: 'Accesorios', stock: 1, min: 2, price: 10 });
    expect(s.products()[0].sku).toBe(sku);
    s.addTask({ title: 'Tarea nueva', project: 'ERP fase 1', owner: 'Ana R.', priority: 'baja' });
    expect(s.tasks().at(-1)!.status).toBe('pendiente');
    expect(s.changes()).toBe(2);
    s.reset();
    expect(s.changes()).toBe(0);
    expect(s.products().some((p) => p.sku === sku)).toBe(false);
  });

  describe('ERP', () => {
    it('avanza órdenes de compra de borrador a aprobada y a recibida, y no pasa de ahí', () => {
      const s = new DemoStore();
      const code = s.purchaseOrders().find((o) => o.status === 'borrador')!.code;
      const open = s.openPurchases().length;
      expect(s.advancePurchase(code)).toBe('aprobada');
      expect(s.openPurchases().length).toBe(open);
      expect(s.advancePurchase(code)).toBe('recibida');
      expect(s.openPurchases().length).toBe(open - 1);
      expect(s.advancePurchase(code)).toBeNull();
      expect(s.advancePurchase('OC-0000')).toBeNull();
      expect(s.changes()).toBe(2);
    });

    it('registra el pago de una factura vencida y actualiza los totales', () => {
      const s = new DemoStore();
      const inv = s.overdue()[0];
      const receivable = s.receivable();
      const overdue = s.overdue().length;
      expect(s.markPaid(inv.code)).toBe(true);
      expect(s.invoices().find((i) => i.code === inv.code)!.status).toBe('pagada');
      expect(s.receivable()).toBe(receivable - inv.total);
      expect(s.overdue().length).toBe(overdue - 1);
      expect(s.markPaid(inv.code)).toBe(false);
      expect(s.changes()).toBe(1);
    });
  });

  describe('Automatización', () => {
    it('activa y pausa flujos', () => {
      const s = new DemoStore();
      const wf = s.workflows().find((w) => !w.active)!;
      expect(s.toggleWorkflow(wf.id)).toBe(true);
      expect(s.workflows().find((w) => w.id === wf.id)!.active).toBe(true);
      expect(s.toggleWorkflow(wf.id)).toBe(false);
      expect(s.toggleWorkflow(999)).toBeNull();
      expect(s.changes()).toBe(2);
    });

    it('ejecutar un flujo agrega una entrada al registro según lo previsto', () => {
      const s = new DemoStore();
      const before = s.runs().length;
      const plan = s.planRun(1)!;
      const entry = s.runWorkflow(1, '11:30')!;
      expect(s.runs().length).toBe(before + 1);
      expect(s.runs()[0]).toEqual(entry);
      expect(entry).toMatchObject({ workflowId: 1, time: '11:30', status: plan.ok ? 'ok' : 'error', durationMs: plan.durationMs });
      expect(entry.id).toBeGreaterThan(Math.max(...s.runs().slice(1).map((r) => r.id)));
      expect(s.runWorkflow(999)).toBeNull();
      expect(s.changes()).toBe(1);
    });

    it('el flujo inestable falla de forma determinista en su paso configurado', () => {
      const s = new DemoStore();
      const wf = s.workflows().find((w) => w.failEvery)!;
      const results = Array.from({ length: wf.failEvery! }, () => s.runWorkflow(wf.id, '12:00')!.status);
      expect(results.filter((r) => r === 'error').length).toBe(1);
      const failed = s.runs().find((r) => r.workflowId === wf.id && r.status === 'error' && r.time === '12:00')!;
      expect(failed.detail).toContain(wf.steps[wf.failStep!]);
    });

    it('restablecer devuelve los datos semilla de ERP y automatización', () => {
      const s = new DemoStore();
      const seed = { po: s.purchaseOrders(), inv: s.invoices(), wf: s.workflows(), runs: s.runs() };
      const version = s.version();
      s.advancePurchase(seed.po[0].code);
      s.markPaid(s.overdue()[0].code);
      s.toggleWorkflow(1);
      s.runWorkflow(2, '13:00');
      expect(s.changes()).toBe(4);
      s.reset();
      expect(s.changes()).toBe(0);
      expect(s.version()).toBe(version + 1);
      expect(s.purchaseOrders()).toEqual(seed.po);
      expect(s.invoices()).toEqual(seed.inv);
      expect(s.workflows()).toEqual(seed.wf);
      expect(s.runs()).toEqual(seed.runs);
    });
  });
});
