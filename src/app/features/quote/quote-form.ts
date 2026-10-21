import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { isPlanId, PLANS } from '../../data/plans.data';
import { isProjectType, PROJECT_TYPES } from '../../data/project-types';
import { findSolution } from '../../data/solutions.data';
import { Icon } from '../../shared/icon/icon';
import { buildMessage, buildSubject, mailtoHref, QuoteRequest, summaryRows, TIMELINES } from './quote.model';
import { QuoteService } from './quote.service';

type Field = 'name' | 'email' | 'company' | 'projectType' | 'plan' | 'description' | 'budget' | 'timeline' | 'privacy';
type Stage = 'form' | 'review' | 'sending' | 'sent' | 'prepared' | 'failed';

const REC_LABEL: Record<string, string> = {
  'web-standard': 'Web Standard',
  'web-pro': 'Web Pro',
  'web-premium': 'Web Premium',
  'app-web': 'Aplicación web',
  'erp-crm': 'ERP / CRM',
  custom: 'Desarrollo personalizado',
};

@Component({
  selector: 'app-quote-form',
  imports: [ReactiveFormsModule, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
  host: { ngSkipHydration: 'true' },
})
export class QuoteForm implements OnInit {
  readonly plan = input<string | undefined>();
  readonly tipo = input<string | undefined>();
  readonly solucion = input<string | undefined>();
  readonly recomendacion = input<string | undefined>();

  private readonly service = inject(QuoteService);
  protected readonly site = SITE;
  protected readonly plans = PLANS;
  protected readonly types = PROJECT_TYPES;
  protected readonly timelines = TIMELINES;
  protected readonly mode = this.service.mode;
  protected readonly stage = signal<Stage>('form');
  protected readonly attempted = signal(false);
  protected readonly failure = signal('');
  protected readonly copied = signal(false);
  protected readonly snapshot = signal<QuoteRequest | null>(null);
  protected readonly origin = signal('');
  protected readonly rows = computed(() => (this.snapshot() ? summaryRows(this.snapshot()!) : []));
  protected readonly message = computed(() => (this.snapshot() ? buildMessage(this.snapshot()!) : ''));
  protected readonly subject = computed(() => (this.snapshot() ? buildSubject(this.snapshot()!) : ''));
  protected readonly mailto = computed(() => (this.snapshot() && SITE.email ? mailtoHref(SITE.email, this.snapshot()!) : ''));
  private readonly stageHeading = viewChild<ElementRef<HTMLElement>>('stageHeading');
  private readonly formEl = viewChild<ElementRef<HTMLFormElement>>('formEl');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    company: ['', [Validators.maxLength(100)]],
    projectType: ['', [Validators.required]],
    plan: ['sin-definir'],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    budget: ['', [Validators.maxLength(60)]],
    timeline: ['', [Validators.required]],
    privacy: [false, [Validators.requiredTrue]],
  });

  protected readonly fieldLabels: Record<string, string> = {
    name: 'Nombre',
    email: 'Correo electrónico',
    projectType: 'Tipo de proyecto',
    description: 'Descripción de la necesidad',
    timeline: 'Plazo estimado',
    privacy: 'Aviso de privacidad',
    company: 'Empresa',
    budget: 'Presupuesto aproximado',
  };

  ngOnInit(): void {
    const plan = this.plan();
    const tipo = this.tipo();
    const sol = this.solucion() ? findSolution(this.solucion()!) : undefined;
    if (isPlanId(plan)) this.form.controls.plan.setValue(plan);
    if (isProjectType(tipo)) this.form.controls.projectType.setValue(tipo);
    else if (sol) this.form.controls.projectType.setValue(sol.projectType);
    if (sol && !isPlanId(plan)) this.form.controls.plan.setValue(sol.plan);
    const rec = this.recomendacion();
    if (rec && REC_LABEL[rec]) {
      this.origin.set(`Recomendación del asistente: ${REC_LABEL[rec]}`);
      this.form.controls.description.setValue(`Recomendación del asistente: ${REC_LABEL[rec]}.\n\n`);
    } else if (sol) {
      this.origin.set(`Solución consultada: ${sol.name}`);
      this.form.controls.description.setValue(`Me interesa: ${sol.name}.\n\n`);
    }
  }

  protected invalid(name: Field): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.attempted());
  }

  protected errorFor(name: Field): string {
    const c = this.form.controls[name];
    const e = c.errors;
    if (!e) return '';
    if (e['required']) return name === 'privacy' ? 'Debes aceptar el aviso de privacidad para continuar.' : 'Este campo es obligatorio.';
    if (e['requiredTrue']) return 'Debes aceptar el aviso de privacidad para continuar.';
    if (e['email']) return 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
    if (e['minlength']) return `Escribe al menos ${e['minlength'].requiredLength} caracteres (llevas ${e['minlength'].actualLength}).`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    return 'Revisa este campo.';
  }

  protected errorList(): { id: string; label: string; msg: string }[] {
    return (Object.keys(this.form.controls) as Field[])
      .filter((k) => this.form.controls[k].invalid)
      .map((k) => ({ id: `q-${k}`, label: this.fieldLabels[k], msg: this.errorFor(k) }));
  }

  protected review(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      setTimeout(() => this.formEl()?.nativeElement.querySelector<HTMLElement>('.error-summary')?.focus());
      return;
    }
    const v = this.form.getRawValue();
    this.snapshot.set({
      name: v.name.trim(),
      email: v.email.trim(),
      company: v.company.trim(),
      projectType: v.projectType as QuoteRequest['projectType'],
      plan: v.plan as QuoteRequest['plan'],
      description: v.description.trim(),
      budget: v.budget.trim(),
      timeline: v.timeline as QuoteRequest['timeline'],
    });
    this.setStage('review');
  }

  protected edit(): void {
    this.setStage('form');
  }

  protected async confirm(): Promise<void> {
    const req = this.snapshot();
    if (!req || this.stage() === 'sending') return;
    if (this.mode === 'local') {
      this.setStage('prepared');
      return;
    }
    this.stage.set('sending');
    const result = await this.service.send(req);
    if (result.ok) {
      this.setStage('sent');
    } else {
      this.failure.set(result.message);
      this.setStage('failed');
    }
  }

  protected async copy(textarea: HTMLTextAreaElement): Promise<void> {
    const text = `${this.subject()}\n\n${this.message()}`;
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
    } catch {
      textarea.focus();
      textarea.select();
      this.copied.set(false);
    }
  }

  protected restart(): void {
    this.form.reset();
    this.attempted.set(false);
    this.snapshot.set(null);
    this.copied.set(false);
    this.origin.set('');
    this.setStage('form');
  }

  private setStage(stage: Stage): void {
    this.stage.set(stage);
    setTimeout(() => {
      const h = this.stageHeading()?.nativeElement;
      if (!h) return;
      h.focus();
      h.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    });
  }
}
