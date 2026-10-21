import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { recommend } from './recommend';
import { Answers, answerLabel, Area, EMPTY_ANSWERS, isStepComplete, Step, STEPS } from './wizard.data';

@Component({
  selector: 'app-wizard',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wizard.html',
  styleUrl: './wizard.scss',
})
export class Wizard {
  protected readonly steps = STEPS;
  protected readonly index = signal(0);
  protected readonly answers = signal<Answers>({ ...EMPTY_ANSWERS, areas: [] });
  protected readonly error = signal('');
  protected readonly done = computed(() => this.index() >= STEPS.length);
  protected readonly step = computed<Step | null>(() => STEPS[this.index()] ?? null);
  protected readonly progress = computed(() => Math.round((Math.min(this.index(), STEPS.length) / STEPS.length) * 100));
  protected readonly result = computed(() => (this.done() ? recommend(this.answers()) : null));
  protected readonly contactParams = computed(() => {
    const r = this.result();
    return r ? { plan: r.plan, tipo: r.projectType, recomendacion: r.id } : {};
  });
  protected readonly label = answerLabel;
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  protected isChecked(step: Step, value: string): boolean {
    const current = this.answers()[step.key];
    return Array.isArray(current) ? current.includes(value as Area) : current === value;
  }

  protected select(step: Step, value: string, checked = true): void {
    this.error.set('');
    this.answers.update((a) => {
      if (!step.multiple) return { ...a, [step.key]: value };
      const v = value as Area;
      let areas = a.areas.filter((x) => x !== v);
      if (checked) areas = v === 'ninguno' ? ['ninguno'] : [...areas.filter((x) => x !== 'ninguno'), v];
      return { ...a, areas };
    });
  }

  protected next(): void {
    const step = this.step();
    if (!step) return;
    if (!isStepComplete(step, this.answers())) {
      this.error.set(step.multiple ? 'Elige al menos una opción para continuar.' : step.optional ? 'Elige una opción o pulsa «Omitir».' : 'Elige una opción para continuar.');
      return;
    }
    this.go(this.index() + 1);
  }

  protected skip(): void {
    const step = this.step();
    if (!step?.optional) return;
    this.answers.update((a) => ({ ...a, [step.key]: 'omitido' }));
    this.go(this.index() + 1);
  }

  protected back(): void {
    if (this.index() > 0) this.go(this.index() - 1);
  }

  protected edit(i: number): void {
    this.go(i);
  }

  protected restart(): void {
    this.answers.set({ ...EMPTY_ANSWERS, areas: [] });
    this.go(0);
  }

  private go(i: number): void {
    this.error.set('');
    this.index.set(i);
    setTimeout(() => this.heading()?.nativeElement.focus());
  }
}
