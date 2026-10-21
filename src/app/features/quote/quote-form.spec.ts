import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QuoteForm } from './quote-form';
import { QUOTE_ENDPOINT } from './quote.service';

async function setup(inputs: Record<string, string> = {}) {
  TestBed.configureTestingModule({
    imports: [QuoteForm],
    providers: [provideRouter([]), { provide: QUOTE_ENDPOINT, useValue: null }],
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

function fill(f: ComponentFixture<QuoteForm>, id: string, value: string) {
  const input = el(f).querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`#${id}`)!;
  input.value = value;
  input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
}

describe('QuoteForm', () => {
  it('conserva el plan y el tipo recibidos por la URL', async () => {
    const f = await setup({ plan: 'premium', tipo: 'aplicacion-web' });
    expect(el(f).querySelector<HTMLSelectElement>('#q-plan')!.value).toBe('premium');
    expect(el(f).querySelector<HTMLSelectElement>('#q-projectType')!.value).toBe('aplicacion-web');
  });

  it('ignora valores de plan no válidos', async () => {
    const f = await setup({ plan: 'gratis' });
    expect(el(f).querySelector<HTMLSelectElement>('#q-plan')!.value).toBe('sin-definir');
  });

  it('muestra errores y no avanza si faltan campos obligatorios', async () => {
    const f = await setup();
    el(f).querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    f.detectChanges();
    expect(el(f).querySelector('.error-summary')).not.toBeNull();
    expect(el(f).textContent).toContain('Este campo es obligatorio');
    expect(el(f).textContent).not.toContain('Revisa tu solicitud');
  });

  it('en modo local prepara el mensaje y deja claro que no se ha enviado', async () => {
    const f = await setup({ plan: 'pro' });
    fill(f, 'q-name', 'Ana Pérez');
    fill(f, 'q-email', 'ana@example.com');
    fill(f, 'q-projectType', 'sitio-corporativo');
    fill(f, 'q-timeline', 'normal');
    fill(f, 'q-description', 'Queremos un sitio con varias páginas para presentar nuestros servicios.');
    const privacy = el(f).querySelector<HTMLInputElement>('#q-privacy')!;
    privacy.click();
    f.detectChanges();
    el(f).querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    f.detectChanges();
    expect(el(f).textContent).toContain('Revisa tu solicitud');
    expect(el(f).textContent).toContain('Pro');
    const confirm = Array.from(el(f).querySelectorAll('button')).find((b) => b.textContent?.includes('Preparar mensaje'))!;
    confirm.click();
    await f.whenStable();
    f.detectChanges();
    const text = el(f).textContent ?? '';
    expect(text).toContain('todavía no se ha enviado');
    expect(text).not.toContain('Solicitud recibida');
    expect(el(f).querySelector<HTMLTextAreaElement>('#q-message')!.value).toContain('Ana Pérez');
  });
});
