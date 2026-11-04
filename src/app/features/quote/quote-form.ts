import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { isPlanId, PLANS } from '../../data/plans.data';
import { isProjectType, PROJECT_TYPES, ProjectType } from '../../data/project-types';
import { findSolution } from '../../data/solutions.data';
import { Icon, IconName } from '../../shared/icon/icon';
import { buildMessage, buildSubject, EXTRAS, FEATURES, mailtoHref, OTHER_FEATURES_ID, QuoteRequest, QuoteStep, summaryRows, TIMELINES } from './quote.model';
import { QuoteService } from './quote.service';

type Field = 'name' | 'email' | 'company' | 'projectType' | 'plan' | 'description' | 'budget' | 'timeline' | 'privacy' | 'otherFeatures';
type Stage = 'form' | 'review' | 'sending' | 'sent' | 'prepared' | 'failed';
type ListField = 'features' | 'extras';

const REC_LABEL: Record<string, string> = {
  'web-standard': 'Web Standard',
  'web-pro': 'Web Pro',
  'web-premium': 'Web Premium',
  'app-web': 'Aplicación web',
  'erp-crm': 'ERP / CRM',
  custom: 'Desarrollo personalizado',
};

/** Campos que se validan antes de salir de cada paso. */
const STEP_FIELDS: Record<QuoteStep, Field[]> = {
  1: ['projectType'],
  2: ['otherFeatures'],
  3: ['plan', 'timeline', 'budget'],
  4: ['name', 'company', 'email', 'description', 'privacy'],
};

export const STEPS: { n: number; label: string; title: string; intro: string }[] = [
  { n: 1, label: 'Tipo', title: '¿Qué quieres construir?', intro: 'Elige la opción que más se parezca a tu idea. Si dudas, marca «Otro / aún no lo sé».' },
  { n: 2, label: 'Funcionalidades', title: 'Funcionalidades', intro: 'Marca los módulos que imaginas. Es opcional: lo afinamos juntos después.' },
  { n: 3, label: 'Características', title: 'Características y alcance', intro: 'Cuéntanos qué esperas del resultado, el plan que te interesa y en qué plazo.' },
  { n: 4, label: 'Información', title: 'Tu información', intro: 'Para poder responderte y entender el contexto del proyecto.' },
  { n: 5, label: 'Resumen', title: 'Resumen de tu proyecto', intro: 'Revisa la configuración antes de continuar. Puedes editar cualquier paso.' },
];

const TYPE_ICON: Record<ProjectType, IconName> = {
  landing: 'window',
  'sitio-corporativo': 'globe',
  catalogo: 'grid',
  tienda: 'store',
  'aplicacion-web': 'code',
  dashboard: 'chart',
  crm: 'users',
  erp: 'building',
  'a-medida': 'layers',
  automatizacion: 'workflow',
  integracion: 'plug',
  mantenimiento: 'refresh',
  otro: 'compass',
};

const OPTION_ICON: Record<string, IconName> = {
  autenticacion: 'lock',
  roles: 'shield',
  dashboard: 'chart',
  usuarios: 'users',
  reportes: 'file',
  integraciones: 'plug',
  notificaciones: 'bell',
  pagos: 'card',
  otros: 'plus',
  diseno: 'brush',
  panel: 'grid',
  responsive: 'phone',
  'integraciones-externas': 'link',
  mantenimiento: 'refresh',
};

const TYPE_GROUPS:{ label: string; ids: ProjectType[] }[] = [
  { label: 'Web', ids: ['landing', 'sitio-corporativo', 'catalogo', 'tienda'] },
  { label: 'Sistemas', ids: ['aplicacion-web', 'dashboard', 'crm', 'erp', 'a-medida'] },
  { label: 'Automatización y otros', ids: ['automatizacion', 'integracion', 'mantenimiento', 'otro'] },
];

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
  protected readonly timelines = TIMELINES;
  protected readonly features = FEATURES;
  protected readonly extras = EXTRAS;
  protected readonly otherId = OTHER_FEATURES_ID;
  protected readonly steps = STEPS;
  protected readonly optionIcon = OPTION_ICON;
  protected readonly typeGroups = TYPE_GROUPS.map((g) => ({
    label: g.label,
    types: g.ids.map((id) => ({ id, label: PROJECT_TYPES.find((t) => t.id === id)!.label, icon: TYPE_ICON[id] })),
  }));
  protected readonly mode = this.service.mode;
  protected readonly stage = signal<Stage>('form');
  /** Paso visible mientras se completa el formulario (1 a 4); el 5 es la etapa de revisión. */
  protected readonly step = signal<QuoteStep>(1);
  protected readonly attempted = signal(false);
  protected readonly failure = signal('');
  protected readonly copied = signal(false);
  protected readonly snapshot = signal<QuoteRequest | null>(null);
  protected readonly origin = signal('');
  protected readonly current = computed(() => (this.stage() === 'form' ? this.step() : 5));
  protected readonly rows = computed(() => (this.snapshot() ? summaryRows(this.snapshot()!) : []));
  protected readonly sections = computed(() =>
    STEPS.slice(0, 4).map((s) => ({ ...s, rows: this.rows().filter((r) => r.step === s.n) })),
  );
  protected readonly message = computed(() => (this.snapshot() ? buildMessage(this.snapshot()!) : ''));
  protected readonly subject = computed(() => (this.snapshot() ? buildSubject(this.snapshot()!) : ''));
  protected readonly mailto = computed(() => (this.snapshot() && SITE.email ? mailtoHref(SITE.email, this.snapshot()!) : ''));
  private readonly stageHeading = viewChild<ElementRef<HTMLElement>>('stageHeading');
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    projectType: ['', [Validators.required]],
    features: [[] as string[]],
    otherFeatures: ['', [Validators.maxLength(200)]],
    extras: [[] as string[]],
    plan: ['sin-definir'],
    timeline: ['', [Validators.required]],
    budget: ['', [Validators.maxLength(60)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    company: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    privacy: [false, [Validators.requiredTrue]],
  });

  protected readonly fieldLabels: Record<Field, string> = {
    projectType: 'Tipo de proyecto',
    otherFeatures: 'Otros módulos',
    plan: 'Plan',
    timeline: 'Plazo estimado',
    budget: 'Presupuesto aproximado',
    name: 'Nombre',
    company: 'Empresa',
    email: 'Correo electrónico',
    description: 'Descripción del proyecto',
    privacy: 'Aviso de privacidad',
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

  protected fieldId(name: Field): string {
    if (name === 'projectType') return `q-type-${this.form.controls.projectType.value || PROJECT_TYPES[0].id}`;
    return `q-${name}`;
  }

  protected invalid(name: Field): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.attempted());
  }

  protected errorFor(name: Field): string {
    const e = this.form.controls[name].errors;
    if (!e) return '';
    if (e['required']) {
      if (name === 'projectType') return 'Elige el tipo de proyecto.';
      if (name === 'otherFeatures') return 'Describe brevemente los otros módulos o desmarca «Otros módulos».';
      return 'Este campo es obligatorio.';
    }
    if (e['requiredTrue']) return 'Debes aceptar el aviso de privacidad para continuar.';
    if (e['email']) return 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
    if (e['minlength']) return `Escribe al menos ${e['minlength'].requiredLength} caracteres (llevas ${e['minlength'].actualLength}).`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    return 'Revisa este campo.';
  }

  protected errorList(): { id: string; label: string; msg: string }[] {
    return STEP_FIELDS[this.step()]
      .filter((k) => this.form.controls[k].invalid)
      .map((k) => ({ id: this.fieldId(k), label: this.fieldLabels[k], msg: this.errorFor(k) }));
  }

  protected focusField(id: string): void {
    this.root.nativeElement.querySelector<HTMLElement>(`#${id}`)?.focus();
  }

  protected has(list: ListField, id: string): boolean {
    return this.form.controls[list].value.includes(id);
  }

  protected toggle(list: ListField, id: string, checked: boolean): void {
    const c = this.form.controls[list];
    const next = checked ? [...c.value.filter((v) => v !== id), id] : c.value.filter((v) => v !== id);
    c.setValue(next);
    if (list === 'features' && id === OTHER_FEATURES_ID) {
      const other = this.form.controls.otherFeatures;
      other.setValidators(checked ? [Validators.required, Validators.maxLength(200)] : [Validators.maxLength(200)]);
      if (!checked) other.setValue('');
      other.updateValueAndValidity();
    }
  }

  /** Valida el paso actual y avanza; desde el paso 4 pasa al resumen. */
  protected next(): void {
    if (!this.validateStep()) return;
    if (this.step() < 4) {
      this.goTo((this.step() + 1) as QuoteStep);
      return;
    }
    this.review();
  }

  /** Atajo tras editar un paso desde el resumen: valida y vuelve a él. */
  protected toSummary(): void {
    if (this.validateStep()) this.review();
  }

  private validateStep(): boolean {
    const fields = STEP_FIELDS[this.step()];
    fields.forEach((f) => this.form.controls[f].markAsTouched());
    if (fields.some((f) => this.form.controls[f].invalid)) {
      this.attempted.set(true);
      setTimeout(() => this.root.nativeElement.querySelector<HTMLElement>('.error-summary')?.focus());
      return false;
    }
    this.attempted.set(false);
    return true;
  }

  protected prev(): void {
    if (this.step() > 1) this.goTo((this.step() - 1) as QuoteStep);
  }

  /** Vuelve a un paso ya completado (desde la barra de progreso o el resumen). */
  protected goTo(step: QuoteStep): void {
    this.attempted.set(false);
    this.step.set(step);
    this.setStage('form');
  }

  protected backToSummary(): void {
    this.setStage('review');
  }

  private review(): void {
    if (this.form.invalid) {
      const first = ([1, 2, 3, 4] as QuoteStep[]).find((s) => STEP_FIELDS[s].some((f) => this.form.controls[f].invalid));
      if (first) {
        this.goTo(first);
        this.attempted.set(true);
      }
      return;
    }
    const v = this.form.getRawValue();
    const features = FEATURES.map((f) => f.id).filter((id) => v.features.includes(id));
    this.snapshot.set({
      name: v.name.trim(),
      email: v.email.trim(),
      company: v.company.trim(),
      projectType: v.projectType as QuoteRequest['projectType'],
      plan: v.plan as QuoteRequest['plan'],
      description: v.description.trim(),
      budget: v.budget.trim(),
      timeline: v.timeline as QuoteRequest['timeline'],
      features,
      otherFeatures: features.includes(OTHER_FEATURES_ID) ? v.otherFeatures.trim() : '',
      extras: EXTRAS.map((x) => x.id).filter((id) => v.extras.includes(id)),
    });
    this.setStage('review');
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
    this.form.controls.otherFeatures.setValidators([Validators.maxLength(200)]);
    this.form.controls.otherFeatures.updateValueAndValidity();
    this.attempted.set(false);
    this.snapshot.set(null);
    this.copied.set(false);
    this.origin.set('');
    this.step.set(1);
    this.setStage('form');
  }

  private setStage(stage: Stage): void {
    this.stage.set(stage);
    setTimeout(() => {
      const h = this.stageHeading()?.nativeElement;
      if (!h) return;
      h.focus({ preventScroll: true });
      const top = this.root.nativeElement.getBoundingClientRect?.().top ?? 0;
      if (top < 0) this.root.nativeElement.scrollIntoView?.({ block: 'start' });
    });
  }
}
