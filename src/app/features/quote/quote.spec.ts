import { TestBed } from '@angular/core/testing';
import { buildMessage, buildSubject, mailtoHref, QuoteRequest, summaryRows } from './quote.model';
import { QUOTE_ENDPOINT, QuoteService } from './quote.service';

const req: QuoteRequest = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  company: 'Comercial Ejemplo',
  projectType: 'crm',
  plan: 'enterprise',
  description: 'Necesitamos ordenar las oportunidades de venta & el seguimiento.',
  budget: '',
  timeline: 'normal',
  features: ['autenticacion', 'reportes', 'otros'],
  otherFeatures: 'Agenda de visitas',
  extras: ['responsive', 'mantenimiento'],
};

describe('mensaje de cotización', () => {
  it('incluye todos los datos y marca lo no indicado', () => {
    const msg = buildMessage(req);
    expect(msg).toContain('Nombre: Ana Pérez');
    expect(msg).toContain('Plan: Enterprise / Custom');
    expect(msg).toContain('Tipo de proyecto: CRM (clientes y ventas)');
    expect(msg).toContain('Presupuesto aproximado: No indicado');
    expect(msg).toContain(req.description);
    expect(buildSubject(req)).toBe('Solicitud de cotización: CRM (clientes y ventas) · Comercial Ejemplo');
  });

  it('incluye funcionalidades, otros módulos y características', () => {
    const msg = buildMessage(req);
    expect(msg).toContain('Funcionalidades: Autenticación, Reportes, Otros módulos');
    expect(msg).toContain('Otros módulos: Agenda de visitas');
    expect(msg).toContain('Características: Responsive, Mantenimiento');
    const empty = buildMessage({ ...req, features: [], otherFeatures: '', extras: [] });
    expect(empty).toContain('Funcionalidades: Ninguna seleccionada');
    expect(empty).not.toContain('Otros módulos:');
  });

  it('asigna cada fila del resumen a su paso para poder editarla', () => {
    const rows = summaryRows(req);
    expect(rows.find((r) => r.label === 'Tipo de proyecto')?.step).toBe(1);
    expect(rows.find((r) => r.label === 'Funcionalidades')?.step).toBe(2);
    expect(rows.find((r) => r.label === 'Plazo')?.step).toBe(3);
    expect(rows.find((r) => r.label === 'Correo')?.step).toBe(4);
  });

  it('codifica el enlace mailto sin romper caracteres especiales', () => {
    const href = mailtoHref('ventas@example.com', req);
    expect(href.startsWith('mailto:ventas@example.com?subject=')).toBe(true);
    expect(href).not.toContain(' ');
    expect(decodeURIComponent(href.split('&body=')[1])).toContain('venta & el seguimiento');
  });
});

describe('QuoteService', () => {
  afterEach(() => vi.restoreAllMocks());

  it('sin receptor configurado funciona en modo local y se niega a enviar', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: QUOTE_ENDPOINT, useValue: null }] });
    const service = TestBed.inject(QuoteService);
    expect(service.mode).toBe('local');
    await expect(service.send(req)).rejects.toThrow();
  });

  it('con receptor solo confirma éxito si el servidor responde 2xx', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: QUOTE_ENDPOINT, useValue: 'https://api.example.com/quotes' }] });
    const service = TestBed.inject(QuoteService);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    fetchSpy.mockResolvedValueOnce(new Response('{}', { status: 201 }));
    expect(await service.send(req)).toEqual({ ok: true });
    fetchSpy.mockResolvedValueOnce(new Response('error', { status: 500 }));
    const failed = await service.send(req);
    expect(failed.ok).toBe(false);
    fetchSpy.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect((await service.send(req)).ok).toBe(false);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]!.body as string);
    expect(body.email).toBe('ana@example.com');
    expect(body.features).toEqual(['autenticacion', 'reportes', 'otros']);
    expect(body.otherFeatures).toBe('Agenda de visitas');
    expect(body.extras).toEqual(['responsive', 'mantenimiento']);
  });
});
