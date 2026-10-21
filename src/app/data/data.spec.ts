import { FAQS } from './faq.data';
import { FEATURE_GROUPS, PLANS, planPrice } from './plans.data';
import { isProjectType } from './project-types';
import { SERVICES } from './services.data';
import { matches, SOLUTION_CATEGORIES, SOLUTION_FAMILIES, SOLUTIONS } from './solutions.data';

describe('datos comerciales', () => {
  it('cada fila de la tabla de planes define un estado para todos los planes', () => {
    for (const g of FEATURE_GROUPS) {
      for (const row of g.rows) {
        expect(Object.keys(row.values).sort()).toEqual(PLANS.map((p) => p.id).sort());
      }
    }
  });

  it('no muestra importes mientras no haya precios aprobados', () => {
    for (const p of PLANS) {
      expect(planPrice(p)).not.toMatch(/\d/);
    }
  });

  it('las soluciones tienen slug único, categoría válida, plan y tipo de proyecto existentes', () => {
    const slugs = SOLUTIONS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of SOLUTIONS) {
      expect(SOLUTION_CATEGORIES.some((c) => c.id === s.category)).toBe(true);
      expect(PLANS.some((p) => p.id === s.plan)).toBe(true);
      expect(isProjectType(s.projectType)).toBe(true);
      expect(s.modules.length).toBeGreaterThan(0);
      expect(s.capabilities.length).toBeGreaterThanOrEqual(2);
      expect(s.capabilities.length).toBeLessThanOrEqual(3);
      expect(SOLUTION_FAMILIES.some((f) => f.id === s.family)).toBe(true);
      expect(s.tech.frontend.length + s.tech.analysis.length).toBeGreaterThan(0);
      expect(s.summary.length).toBeLessThan(170);
      expect(s.overview).not.toBe(s.summary);
      if (s.backend === 'si') expect(s.tech.backend.length).toBeGreaterThan(0);
      if (s.backend === 'no') expect(s.tech.backend.length).toBe(0);
    }
  });

  it('la búsqueda cubre nombre, categoría, capacidades e integraciones, sin distinguir acentos', () => {
    const find = (q: string) => SOLUTIONS.filter((s) => matches(s, q)).map((s) => s.slug);
    expect(find('Sistemas de gestión')).toEqual(expect.arrayContaining(['sistema-de-inventario', 'gestion-de-proyectos']));
    expect(find('facturacion')).toEqual(expect.arrayContaining(['erp-modular', 'integracion-de-sistemas', 'tienda-en-linea']));
    expect(find('pasarela')).toContain('tienda-en-linea');
    expect(find('embudo ventas')).toEqual(['crm-comercial']);
    expect(find('')).toHaveLength(SOLUTIONS.length);
    expect(find('xyzzy')).toHaveLength(0);
  });

  it('cada familia del catálogo tiene soluciones', () => {
    for (const f of SOLUTION_FAMILIES) expect(SOLUTIONS.some((s) => s.family === f.id)).toBe(true);
  });

  it('cada categoría del catálogo tiene al menos una solución', () => {
    for (const c of SOLUTION_CATEGORIES) {
      expect(SOLUTIONS.some((s) => s.category === c.id)).toBe(true);
    }
  });

  it('los servicios apuntan a planes y tipos de proyecto válidos', () => {
    expect(SERVICES.length).toBe(6);
    for (const s of SERVICES) {
      expect(PLANS.some((p) => p.id === s.plan)).toBe(true);
      expect(isProjectType(s.projectType)).toBe(true);
    }
  });

  it('las preguntas frecuentes no se repiten', () => {
    expect(new Set(FAQS.map((f) => f.q)).size).toBe(FAQS.length);
  });
});
