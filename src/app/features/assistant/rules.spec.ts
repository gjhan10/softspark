import { describe, expect, it } from 'vitest';
import { normalize, ruleReply } from './rules';

describe('Spark Assistant (reglas)', () => {
  it('normaliza tildes y signos', () => {
    expect(normalize('¡Facturación  y ALMACÉN!')).toBe('facturacion y almacen');
  });

  it('sugiere inventario para una distribuidora', () => {
    const r = ruleReply('Tengo una distribuidora y necesito controlar mis inventarios.');
    expect(r.understood).toBe(true);
    expect(r.solution?.slug).toBe('sistema-de-inventario');
    expect(r.matched).toContain('distribuidora');
    expect(r.modules.length).toBeGreaterThan(0);
    expect(r.toQuote).toContain('Plazo deseado y presupuesto aproximado');
  });

  it('sugiere CRM cuando habla de vendedores y clientes', () => {
    const r = ruleReply('Mis vendedores llevan los clientes en Excel y perdemos el seguimiento.');
    expect(r.solution?.slug).toBe('crm-comercial');
    expect(r.projectType).toBe('crm');
  });

  it('suma temas secundarios como módulos', () => {
    const r = ruleReply('Quiero vender en linea con carrito y controlar el stock de mis productos');
    expect(r.solution?.slug).toBe('tienda-en-linea');
    expect(r.intro).toContain('También detecté');
  });

  it('pide más contexto si no entiende el mensaje', () => {
    const r = ruleReply('hola');
    expect(r.understood).toBe(false);
    expect(r.solution).toBeUndefined();
    expect(r.modules).toEqual([]);
  });
});
