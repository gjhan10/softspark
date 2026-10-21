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
});
