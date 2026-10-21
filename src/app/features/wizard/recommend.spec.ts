import { recommend } from './recommend';
import { Answers, EMPTY_ANSWERS } from './wizard.data';

const base = (over: Partial<Answers>): Answers => ({ ...EMPTY_ANSWERS, areas: ['ninguno'], users: 'no', integrations: 'no', timeline: 'normal', ...over });

describe('recommend', () => {
  it('recomienda Web Standard a un profesional que solo quiere mostrar información', () => {
    const r = recommend(base({ business: 'profesional', need: 'informativa' }));
    expect(r.id).toBe('web-standard');
    expect(r.plan).toBe('standard');
    expect(r.projectType).toBe('landing');
  });

  it('recomienda Web Pro a un negocio que quiere captar clientes', () => {
    const r = recommend(base({ business: 'pequeno', need: 'captar' }));
    expect(r.id).toBe('web-pro');
    expect(r.projectType).toBe('catalogo');
  });

  it('sube a Web Premium con presupuesto amplio o varias integraciones', () => {
    expect(recommend(base({ business: 'pequeno', need: 'captar', budget: 'amplio' })).id).toBe('web-premium');
    expect(recommend(base({ business: 'pequeno', need: 'captar', integrations: 'varias' })).id).toBe('web-premium');
  });

  it('recomienda un CRM cuando la prioridad son los clientes', () => {
    const r = recommend(base({ business: 'empresa', need: 'interactivo', users: 'si', areas: ['clientes'] }));
    expect(r.id).toBe('erp-crm');
    expect(r.projectType).toBe('crm');
    expect(r.subtitle).toContain('CRM');
  });

  it('recomienda un ERP cuando hay inventario o procesos internos', () => {
    const r = recommend(base({ business: 'empresa', need: 'interactivo', areas: ['inventario', 'ventas'] }));
    expect(r.id).toBe('erp-crm');
    expect(r.projectType).toBe('erp');
    expect(r.plan).toBe('enterprise');
  });

  it('recomienda desarrollo personalizado con varias áreas y varias integraciones', () => {
    const r = recommend(base({ business: 'organizacion', need: 'interactivo', areas: ['clientes', 'inventario', 'procesos'], integrations: 'varias' }));
    expect(r.id).toBe('custom');
  });

  it('recomienda una aplicación web cuando se necesitan usuarios sin áreas de gestión', () => {
    const r = recommend(base({ business: 'proyecto', need: 'interactivo', users: 'si' }));
    expect(r.id).toBe('app-web');
    expect(r.considerations.join(' ')).toContain('backend');
  });

  it('acepta el presupuesto omitido y añade avisos por plazo urgente', () => {
    const r = recommend(base({ business: 'pequeno', need: 'interactivo', areas: ['inventario'], budget: 'omitido', timeline: 'urgente' }));
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.considerations.some((c) => c.includes('plazo corto'))).toBe(true);
  });
});
