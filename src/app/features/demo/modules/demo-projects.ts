import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../shared/toast/toast';
import { OWNERS, Task, TaskStatus, TASK_STATUSES } from '../demo-data';
import { DemoStore } from '../demo-store';

@Component({
  selector: 'app-demo-projects',
  imports: [Icon, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>Gestión de proyectos</h2>
        <p>Tareas de proyectos ficticios. Muévelas entre estados o crea nuevas.</p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" (click)="adding.set(!adding())" [attr.aria-expanded]="adding()" aria-controls="task-add">
        <app-icon [name]="adding() ? 'x' : 'plus'" [size]="16" /> {{ adding() ? 'Cancelar' : 'Nueva tarea' }}
      </button>
    </div>

    @if (adding()) {
      <form id="task-add" class="add-form" [formGroup]="form" (ngSubmit)="add()" novalidate>
        <div class="fields">
          <div class="field">
            <label for="t-title">Tarea</label>
            <input id="t-title" class="input" formControlName="title" [attr.aria-invalid]="invalid()" />
            @if (invalid()) { <span class="error"><app-icon name="alert" [size]="14" /> Escribe al menos 4 caracteres.</span> }
          </div>
          <div class="field">
            <label for="t-project">Proyecto</label>
            <select id="t-project" class="input" formControlName="project">
              @for (p of projects(); track p) { <option [value]="p">{{ p }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="t-owner">Responsable</label>
            <select id="t-owner" class="input" formControlName="owner">
              @for (o of owners; track o) { <option [value]="o">{{ o }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="t-priority">Prioridad</label>
            <select id="t-priority" class="input" formControlName="priority">
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
        <div class="btns"><button type="submit" class="btn btn-primary btn-sm">Crear en la demo</button></div>
      </form>
    }

    <div class="toolbar">
      <label class="sr-only" for="p-filter">Proyecto</label>
      <select id="p-filter" class="input" [value]="project()" (change)="project.set($any($event.target).value)">
        <option value="">Todos los proyectos</option>
        @for (p of projects(); track p) { <option [value]="p">{{ p }}</option> }
      </select>
      <label class="sr-only" for="o-filter">Responsable</label>
      <select id="o-filter" class="input" [value]="owner()" (change)="owner.set($any($event.target).value)">
        <option value="">Todos los responsables</option>
        @for (o of owners; track o) { <option [value]="o">{{ o }}</option> }
      </select>
    </div>

    <div class="board">
      @for (col of statuses; track col.id; let ci = $index) {
        <section class="column" [attr.aria-labelledby]="'col-' + col.id">
          <h3 [id]="'col-' + col.id">{{ col.label }} <span class="count">{{ byStatus(col.id).length }}</span></h3>
          @for (t of byStatus(col.id); track t.id) {
            <article class="task">
              <div class="t-top">
                <span class="tag" [attr.data-tone]="t.priority === 'alta' ? 'danger' : t.priority === 'media' ? 'warn' : 'cyan'">{{ t.priority }}</span>
                <span class="who">{{ t.owner }}</span>
              </div>
              <p class="t-title">{{ t.title }}</p>
              <p class="t-proj">{{ t.project }}</p>
              <div class="t-move">
                <button type="button" class="icon-btn" (click)="move(t, -1)" [disabled]="ci === 0" [attr.aria-label]="'Mover «' + t.title + '» a ' + (statuses[ci - 1]?.label ?? '')"><app-icon name="arrow-left" [size]="14" /></button>
                <button type="button" class="icon-btn" (click)="move(t, 1)" [disabled]="ci === statuses.length - 1" [attr.aria-label]="'Mover «' + t.title + '» a ' + (statuses[ci + 1]?.label ?? '')"><app-icon name="arrow-right" [size]="14" /></button>
              </div>
            </article>
          } @empty {
            <p class="col-empty">Sin tareas</p>
          }
        </section>
      }
    </div>
  `,
  styles: `
    .board { display: grid; gap: var(--s-3); }
    @media (min-width: 900px) { .board { grid-template-columns: repeat(3, 1fr); } }
    .column { display: grid; align-content: start; gap: 10px; padding: 12px; border-radius: var(--r-md); background: var(--bg-2); border: 1px solid var(--line); min-height: 160px; }
    .column h3 { display: flex; justify-content: space-between; font: 500 0.8rem var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-2); padding: 2px 4px 6px; }
    .count { color: var(--text-3); }
    .task { display: grid; gap: 6px; padding: 12px; border-radius: var(--r-md); background: var(--surface); border: 1px solid var(--line); }
    .t-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .who { font-size: 0.8rem; color: var(--text-3); }
    .t-title { font-weight: 500; font-size: 0.95rem; }
    .t-proj { font-size: 0.82rem; color: var(--text-3); }
    .t-move { display: flex; justify-content: flex-end; gap: 6px; }
    .col-empty { padding: 20px 8px; text-align: center; color: var(--text-3); font-size: 0.88rem; border: 1px dashed var(--line-strong); border-radius: var(--r-md); }
  `,
})
export class DemoProjects {
  protected readonly store = inject(DemoStore);
  private readonly toast = inject(ToastService);
  protected readonly statuses = TASK_STATUSES;
  protected readonly owners = OWNERS;
  protected readonly project = signal('');
  protected readonly owner = signal('');
  protected readonly adding = signal(false);
  protected readonly submitted = signal(false);
  protected readonly projects = computed(() => [...new Set(this.store.tasks().map((t) => t.project))]);
  private readonly filtered = computed(() =>
    this.store
      .tasks()
      .filter((t) => !this.project() || t.project === this.project())
      .filter((t) => !this.owner() || t.owner === this.owner()),
  );

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
    project: ['Portal de clientes'],
    owner: [OWNERS[0]],
    priority: ['media' as Task['priority']],
  });

  protected byStatus(s: TaskStatus): Task[] {
    return this.filtered().filter((t) => t.status === s);
  }

  protected invalid(): boolean {
    const c = this.form.controls.title;
    return c.invalid && (c.touched || this.submitted());
  }

  protected move(t: Task, dir: -1 | 1): void {
    this.store.moveTask(t.id, dir);
  }

  protected add(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.store.addTask({ title: v.title.trim(), project: v.project, owner: v.owner, priority: v.priority });
    this.toast.show('Tarea creada en «Pendiente» (solo en esta demo).');
    this.form.reset();
    this.submitted.set(false);
    this.adding.set(false);
  }
}
