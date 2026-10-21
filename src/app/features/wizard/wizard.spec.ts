import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Wizard } from './wizard';

function root(f: ComponentFixture<Wizard>): HTMLElement {
  return f.nativeElement as HTMLElement;
}

function choose(f: ComponentFixture<Wizard>, value: string) {
  const input = root(f).querySelector<HTMLInputElement>(`input[value="${value}"]`)!;
  input.checked = true;
  input.dispatchEvent(new Event('change'));
  f.detectChanges();
}

function next(f: ComponentFixture<Wizard>) {
  root(f).querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
  f.detectChanges();
}

describe('Wizard', () => {
  let f: ComponentFixture<Wizard>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Wizard], providers: [provideRouter([])] });
    f = TestBed.createComponent(Wizard);
    f.detectChanges();
  });

  it('no avanza sin respuesta y muestra un error', () => {
    next(f);
    expect(root(f).querySelector('[role="alert"]')?.textContent).toContain('Elige una opción');
    expect(root(f).textContent).toContain('Paso 1 de 7');
  });

  it('recorre los siete pasos, permite volver, omitir el presupuesto y reiniciar', () => {
    choose(f, 'empresa');
    next(f);
    expect(root(f).textContent).toContain('Paso 2 de 7');
    root(f).querySelector<HTMLButtonElement>('button.btn-ghost')!.click();
    f.detectChanges();
    expect(root(f).textContent).toContain('Paso 1 de 7');
    next(f);
    choose(f, 'interactivo');
    next(f);
    choose(f, 'si');
    next(f);
    choose(f, 'clientes');
    next(f);
    choose(f, 'no');
    next(f);
    const skip = Array.from(root(f).querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Omitir')!;
    skip.click();
    f.detectChanges();
    choose(f, 'normal');
    next(f);
    const text = root(f).textContent ?? '';
    expect(text).toContain('Recomendación orientativa');
    expect(text).toContain('ERP / CRM');
    expect(text).toContain('Prefiero no indicarlo');
    expect(text).toContain('no es una cotización');
    const cta = root(f).querySelector<HTMLAnchorElement>('a.btn-primary')!;
    expect(cta.getAttribute('href')).toContain('plan=enterprise');
    expect(cta.getAttribute('href')).toContain('tipo=crm');
    const restart = Array.from(root(f).querySelectorAll('button')).find((b) => b.textContent?.includes('Reiniciar'))!;
    restart.click();
    f.detectChanges();
    expect(root(f).textContent).toContain('Paso 1 de 7');
  });
});
