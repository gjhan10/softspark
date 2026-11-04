import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QuoteForm } from './quote-form';
import { QUOTE_ENDPOINT } from './quote.service';

async function setup(inputs: Record<string, string> = {}, endpoint: string | null = null) {
  TestBed.configureTestingModule({
    imports: [QuoteForm],
    providers: [provideRouter([]), { provide: QUOTE_ENDPOINT, useValue: endpoint }],
  });
  const fixture = TestBed.createComponent(QuoteForm);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

function el(f: ComponentFixture<QuoteForm>): HTMLElement {
  return f.nativeElement as HTMLElement;
}

function q<T extends HTMLElement>(f: ComponentFixture<QuoteForm>, id: string): T {
  return el(f).querySelector<T>(`#${id}`)!;
}

function fill(f: ComponentFixture<QuoteForm>, id: string, value: string) {
  const input = q<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(f, id);
  input.value = value;
  input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
  f.detectChanges();
}

function click(f: ComponentFixture<QuoteForm>, target: HTMLElement) {
  target.click();
  f.detectChanges();
}

function button(f: ComponentFixture<QuoteForm>, text: string): HTMLButtonElement {
  return Array.from(el(f).querySelectorAll('button')).find((b) => b.textContent?.includes(text))!;
}

function next(f: ComponentFixture<QuoteForm>) {
  click(f, el(f).querySelector<HTMLButtonElement>('button[type="submit"]')!);
}

function heading(f: ComponentFixture<QuoteForm>): string {
  return el(f).querySelector('h3')?.textContent?.trim() ?? '';
}

async function settle(f: ComponentFixture<QuoteForm>) {
  await new Promise((r) => setTimeout(r));
  await f.whenStable();
  f.detectChanges();
}

/** Completa los cuatro pasos y llega al resumen. */
function completeAll(f: ComponentFixture<QuoteForm>) {
  click(f, q(f, 'q-type-sitio-corporativo'));
  next(f);
  click(f, q(f, 'q-feat-autenticacion'));
  click(f, q(f, 'q-feat-pagos'));
  click(f, q(f, 'q-feat-otros'));
  fill(f, 'q-otherFeatures', 'Inventario');
  next(f);
  click(f, q(f, 'q-extra-responsive'));
  fill(f, 'q-timeline', 'normal');
  next(f);
  fill(f, 'q-name', 'Ana Pérez');
  fill(f, 'q-email', 'ana@example.com');
  fill(f, 'q-description', 'Queremos un sitio con varias páginas para presentar nuestros servicios.');
  click(f, q(f, 'q-privacy'));
  next(f);
}

describe('QuoteForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra el progreso con el paso actual marcado', async () => {
    const f = await setup();
    expect(el(f).textContent).toContain('Construyamos tu próximo proyecto.');
    const current = el(f).querySelectorAll('[aria-current="step"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent).toContain('Tipo');
  });

  it('conserva el plan y el tipo recibidos por la URL', async () => {
    const f = await setup({ plan: 'premium', tipo: 'aplicacion-web' });
    expect(q<HTMLInputElement>(f, 'q-type-aplicacion-web').checked).toBe(true);
    next(f);
    next(f);
    expect(q<HTMLSelectElement>(f, 'q-plan').value).toBe('premium');
  });

  it('ignora valores de plan no válidos', async () => {
    const f = await setup({ plan: 'gratis' });
    click(f, q(f, 'q-type-landing'));
    next(f);
    next(f);
    expect(q<HTMLSelectElement>(f, 'q-plan').value).toBe('sin-definir');
  });

  it('precarga la descripción con la recomendación del asistente', async () => {
    const f = await setup({ recomendacion: 'web-pro' });
    expect(el(f).textContent).toContain('Recomendación del asistente: Web Pro');
  });

  it('no avanza si el paso actual no es válido y muestra el resumen de errores', async () => {
    const f = await setup();
    next(f);
    expect(heading(f)).toBe('¿Qué quieres construir?');
    expect(el(f).querySelector('.error-summary')).not.toBeNull();
    expect(el(f).textContent).toContain('Elige el tipo de proyecto');
    click(f, q(f, 'q-type-crm'));
    next(f);
    expect(heading(f)).toBe('Funcionalidades');
    expect(el(f).querySelector('.error-summary')).toBeNull();
  });

  it('exige describir los otros módulos solo si se marca «Otros módulos»', async () => {
    const f = await setup({ tipo: 'crm' });
    next(f);
    expect(q(f, 'q-otherFeatures')).toBeNull();
    click(f, q(f, 'q-feat-otros'));
    next(f);
    expect(heading(f)).toBe('Funcionalidades');
    expect(el(f).textContent).toContain('Describe brevemente los otros módulos');
    click(f, q(f, 'q-feat-otros'));
    next(f);
    expect(heading(f)).toBe('Características y alcance');
  });

  it('el plazo es obligatorio en el paso 3 y «Anterior» vuelve sin validar', async () => {
    const f = await setup({ tipo: 'crm' });
    next(f);
    next(f);
    next(f);
    expect(heading(f)).toBe('Características y alcance');
    expect(q<HTMLSelectElement>(f, 'q-timeline').getAttribute('aria-invalid')).toBe('true');
    click(f, button(f, 'Anterior'));
    expect(heading(f)).toBe('Funcionalidades');
  });

  it('el resumen incluye las funcionalidades y «Editar» vuelve al paso correcto', async () => {
    const f = await setup();
    completeAll(f);
    expect(heading(f)).toBe('Resumen de tu proyecto');
    const text = el(f).textContent ?? '';
    expect(text).toContain('Autenticación, Pagos, Otros módulos');
    expect(text).toContain('Inventario');
    expect(text).toContain('Responsive');
    expect(text).toContain('No es un presupuesto');
    click(f, el(f).querySelector<HTMLButtonElement>('button[aria-label="Editar Características"]')!);
    expect(heading(f)).toBe('Características y alcance');
    expect(q<HTMLInputElement>(f, 'q-extra-responsive').checked).toBe(true);
    click(f, button(f, 'Volver al resumen'));
    expect(heading(f)).toBe('Resumen de tu proyecto');
    click(f, el(f).querySelector<HTMLButtonElement>('button[aria-label="Editar Tipo"]')!);
    expect(heading(f)).toBe('¿Qué quieres construir?');
  });

  it('en modo local prepara el mensaje y nunca lo da por enviado', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const f = await setup({ plan: 'pro' });
    completeAll(f);
    expect(el(f).textContent).toContain('Pro');
    click(f, button(f, 'Preparar mensaje'));
    await f.whenStable();
    f.detectChanges();
    const text = el(f).textContent ?? '';
    expect(text).toContain('todavía no se ha enviado');
    expect(text).not.toContain('Solicitud recibida');
    const message = q<HTMLTextAreaElement>(f, 'q-message').value;
    expect(message).toContain('Ana Pérez');
    expect(message).toContain('Funcionalidades: Autenticación, Pagos, Otros módulos');
    expect(message).toContain('Otros módulos: Inventario');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('en modo remoto confirma solo si el servidor responde bien', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('{}', { status: 201 }));
    const f = await setup({}, 'https://api.example.com/quotes');
    completeAll(f);
    click(f, button(f, 'Enviar solicitud'));
    await settle(f);
    expect(el(f).textContent).toContain('Solicitud recibida');
    const body = JSON.parse(fetchSpy.mock.calls[0][1]!.body as string);
    expect(body.features).toEqual(['autenticacion', 'pagos', 'otros']);
    expect(body.otherFeatures).toBe('Inventario');
    expect(body.extras).toEqual(['responsive']);
  });

  it('en modo remoto muestra el fallo y permite volver al resumen', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('error', { status: 500 }));
    const f = await setup({}, 'https://api.example.com/quotes');
    completeAll(f);
    click(f, button(f, 'Enviar solicitud'));
    await settle(f);
    const text = el(f).textContent ?? '';
    expect(text).toContain('No se pudo enviar la solicitud');
    expect(text).not.toContain('Solicitud recibida');
    click(f, button(f, 'Volver al resumen'));
    expect(heading(f)).toBe('Resumen de tu proyecto');
  });
});
