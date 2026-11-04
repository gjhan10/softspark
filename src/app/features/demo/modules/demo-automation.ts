import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../shared/toast/toast';
import { BarChart } from '../charts';
import { num, RUN_HISTORY, RunStatus, seconds, Workflow } from '../demo-data';
import { DemoStore } from '../demo-store';

type StepState = 'idle' | 'pending' | 'current' | 'done' | 'error' | 'skipped';

/** Pausa entre pasos de la simulación (ms). Con «reducir movimiento» se completa al instante. */
const STEP_MS = 450;

@Component({
  selector: 'app-demo-automation',
  imports: [Icon, BarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>Automatización de procesos</h2>
        <p>Flujos de trabajo ficticios. Actívalos, páusalos o ejecútalos para ver una simulación paso a paso.</p>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><small>Ejecuciones hoy</small><strong>{{ store.runs().length }}</strong><em>{{ count('ok') }} correctas · {{ count('error') }} con error</em></div>
      <div class="kpi"><small>Tasa de éxito</small><strong>{{ successRate() }} %</strong><em>ejecuciones de hoy</em></div>
      <div class="kpi"><small>Tiempo ahorrado hoy</small><strong>{{ savedLabel() }}</strong><em>estimación ficticia</em></div>
      <div class="kpi"><small>Flujos activos</small><strong>{{ activeCount() }}</strong><em>de {{ store.workflows().length }} flujos</em></div>
    </div>

    <p class="run-status" role="status" aria-live="polite" [attr.data-tone]="statusTone()">
      <app-icon [name]="statusTone() === 'danger' ? 'alert' : statusTone() === 'ok' ? 'check' : 'info'" [size]="16" />
      <span>{{ status() }}</span>
    </p>

    <ul class="flows" aria-label="Flujos de trabajo">
      @for (w of store.workflows(); track w.id) {
        <li class="panel flow" [class.paused]="!w.active">
          <div class="flow-head">
            <h3>{{ w.name }}</h3>
            <span class="tag" [attr.data-tone]="w.active ? 'ok' : undefined">{{ w.active ? 'Activo' : 'Pausado' }}</span>
          </div>
          <p class="trigger"><app-icon name="clock" [size]="16" /> <span><span class="sr-only">Disparador: </span>{{ w.trigger }}</span></p>
          <ol class="steps" [attr.aria-label]="'Pasos de ' + w.name">
            @for (s of w.steps; track $index) {
              @let st = stepState(w, $index);
              <li [attr.data-state]="st">
                <span class="mark" aria-hidden="true">
                  @switch (st) {
                    @case ('done') { <app-icon name="check" [size]="12" /> }
                    @case ('error') { <app-icon name="x" [size]="12" /> }
                    @default { {{ $index + 1 }} }
                  }
                </span>
                <span>{{ s }}@if (stateLabel[st]) {<span class="sr-only"> ({{ stateLabel[st] }})</span>}</span>
              </li>
            }
          </ol>
          <div class="flow-foot">
            <label class="checkbox switch">
              <input type="checkbox" role="switch" [checked]="w.active" (change)="toggle(w)" [attr.aria-label]="'Flujo activo: ' + w.name" />
              <span aria-hidden="true">Activo</span>
            </label>
            <button type="button" class="btn btn-secondary btn-sm run-btn" (click)="run(w)" [disabled]="running() !== null" [attr.aria-label]="'Ejecutar ahora: ' + w.name">
              <app-icon name="play" [size]="14" /> {{ running()?.id === w.id ? 'Ejecutando…' : 'Ejecutar ahora' }}
            </button>
          </div>
        </li>
      }
    </ul>

    <div class="panel">
      <h3>Ejecuciones por día <span class="tag">Datos sintéticos</span></h3>
      <app-bar-chart [values]="chartValues()" [labels]="chartLabels" label="Ejecuciones por día, últimos 7 días" [format]="num" />
    </div>

    <div class="panel">
      <h3>Registro de ejecuciones de hoy</h3>
      <div class="grid-gap">
        <div class="chips" role="group" aria-label="Filtrar el registro por resultado">
          <button type="button" class="chip" [attr.aria-pressed]="logStatus() === 'todas'" (click)="logStatus.set('todas')">Todas <span class="count">{{ store.runs().length }}</span></button>
          <button type="button" class="chip" [attr.aria-pressed]="logStatus() === 'ok'" (click)="logStatus.set('ok')">Correctas <span class="count">{{ count('ok') }}</span></button>
          <button type="button" class="chip" [attr.aria-pressed]="logStatus() === 'error'" (click)="logStatus.set('error')">Con error <span class="count">{{ count('error') }}</span></button>
        </div>
        <div class="toolbar">
          <label class="sr-only" for="auto-log-flow">Flujo</label>
          <select id="auto-log-flow" class="input" [value]="logFlow()" (change)="logFlow.set($any($event.target).value)">
            <option value="">Todos los flujos</option>
            @for (w of store.workflows(); track w.id) { <option [value]="'' + w.id">{{ w.name }}</option> }
          </select>
        </div>
        <p class="result-count" aria-live="polite">{{ logRows().length }} {{ logRows().length === 1 ? 'ejecución' : 'ejecuciones' }}</p>
        @if (logRows().length) {
          <div class="table-wrap">
            <table class="responsive">
              <thead><tr><th scope="col">Hora</th><th scope="col">Flujo</th><th scope="col">Resultado</th><th scope="col" class="num">Duración</th><th scope="col">Detalle</th></tr></thead>
              <tbody>
                @for (r of logRows(); track r.id) {
                  <tr>
                    <td data-label="Hora"><code>{{ r.time }}</code></td>
                    <td data-label="Flujo" class="wide"><strong>{{ names()[r.workflowId] }}</strong></td>
                    <td data-label="Resultado"><span class="tag" [attr.data-tone]="r.status === 'ok' ? 'ok' : 'danger'">{{ r.status === 'ok' ? 'Correcta' : 'Error' }}</span></td>
                    <td data-label="Duración" class="num">{{ seconds(r.durationMs) }}</td>
                    <td data-label="Detalle" class="wide detail">{{ r.detail }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty">
            <app-icon name="search" [size]="28" />
            <strong>No hay ejecuciones con esos filtros</strong>
            <button type="button" class="btn btn-secondary btn-sm" (click)="clear()">Limpiar filtros</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .grid-gap { display: grid; gap: var(--s-3); }
    .run-status { display: flex; align-items: center; gap: var(--s-2); min-height: 44px; padding: var(--s-2) var(--s-3); border: 1px solid var(--line); border-radius: var(--r-md); background: var(--surface-2); font-size: var(--fs-sm); color: var(--text-2); }
    .run-status[data-tone='ok'] app-icon { color: var(--ok); }
    .run-status[data-tone='danger'] app-icon { color: var(--danger); }
    .run-status[data-tone='accent'] app-icon { color: var(--accent); }
    .flows { list-style: none; display: grid; gap: var(--s-3); grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
    .flow { display: grid; gap: var(--s-3); align-content: start; background: var(--surface); }
    .flow.paused { background: var(--surface-2); }
    .flow-head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--s-2); }
    .flow .flow-head h3 { margin: 0; font-size: var(--fs-base); }
    .trigger { display: flex; align-items: center; gap: var(--s-2); font-size: var(--fs-sm); color: var(--text-2); }
    .trigger app-icon { color: var(--text-3); }
    .steps { list-style: none; display: grid; gap: var(--s-2); }
    .steps li { display: grid; grid-template-columns: 22px 1fr; gap: var(--s-2); align-items: center; font-size: var(--fs-sm); color: var(--text-2); }
    .mark { display: grid; place-items: center; width: 22px; height: 22px; border: 1px solid var(--line-strong); border-radius: 50%; font: 500 11px/1 var(--font-mono); color: var(--text-3); transition: background-color var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease), color var(--t-fast) var(--ease); }
    .steps li[data-state='current'] { color: var(--text); font-weight: 500; }
    .steps li[data-state='current'] .mark { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); animation: pulse 0.9s var(--ease) infinite alternate; }
    .steps li[data-state='done'] .mark { border-color: transparent; color: var(--ok); background: var(--ok-soft); }
    .steps li[data-state='error'] { color: var(--danger); }
    .steps li[data-state='error'] .mark { border-color: transparent; color: var(--danger); background: var(--danger-soft); }
    .steps li[data-state='skipped'] { color: var(--text-3); text-decoration: line-through; }
    .flow-foot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--s-2); padding-top: var(--s-3); border-top: 1px solid var(--line); }
    .switch { align-items: center; font-size: var(--fs-sm); }
    .run-btn { min-width: 10.5em; }
    td.detail { white-space: normal; min-width: 220px; color: var(--text-2); }
    @keyframes pulse { from { box-shadow: 0 0 0 0 var(--accent-soft); } to { box-shadow: 0 0 0 5px var(--accent-soft); } }
    @media (prefers-reduced-motion: reduce) { .steps li[data-state='current'] .mark { animation: none; } .mark { transition: none; } }
    @media (max-width: 720px) { td.detail { min-width: 0; } }
  `,
})
export class DemoAutomation {
  protected readonly store = inject(DemoStore);
  private readonly toast = inject(ToastService);
  protected readonly num = num;
  protected readonly seconds = seconds;
  protected readonly chartLabels = ['−6 d', '−5 d', '−4 d', '−3 d', '−2 d', 'Ayer', 'Hoy'];
  protected readonly stateLabel: Record<StepState, string> = { idle: '', pending: 'pendiente', current: 'en curso', done: 'completado', error: 'falló', skipped: 'no ejecutado' };

  protected readonly logStatus = signal<RunStatus | 'todas'>('todas');
  protected readonly logFlow = signal('');
  protected readonly running = signal<{ id: number; step: number } | null>(null);
  /** Resultado de la última simulación, para pintar sus pasos. Se descarta si se restablece la demo. */
  private readonly last = signal<{ id: number; failStep: number | null; version: number } | null>(null);
  private readonly message = signal<{ text: string; tone: string; version: number } | null>(null);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly status = computed(() => this.currentMessage()?.text ?? 'Ningún flujo en ejecución. Pulsa «Ejecutar ahora» para simular una ejecución.');
  protected readonly statusTone = computed(() => this.currentMessage()?.tone ?? 'idle');
  protected readonly names = computed(() => Object.fromEntries(this.store.workflows().map((w) => [w.id, w.name])) as Record<number, string>);
  protected readonly activeCount = computed(() => this.store.workflows().filter((w) => w.active).length);
  protected readonly chartValues = computed(() => [...RUN_HISTORY, this.store.runs().length]);
  protected readonly successRate = computed(() => {
    const total = this.store.runs().length;
    return total ? Math.round((this.count('ok') / total) * 100) : 0;
  });
  protected readonly savedLabel = computed(() => {
    const byId = new Map(this.store.workflows().map((w) => [w.id, w.minutesSaved]));
    const mins = this.store.runs().filter((r) => r.status === 'ok').reduce((t, r) => t + (byId.get(r.workflowId) ?? 0), 0);
    const h = Math.floor(mins / 60);
    return h ? `${h} h ${mins % 60} min` : `${mins} min`;
  });

  protected readonly logRows = computed(() =>
    this.store
      .runs()
      .filter((r) => this.logStatus() === 'todas' || r.status === this.logStatus())
      .filter((r) => !this.logFlow() || r.workflowId === Number(this.logFlow())),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected count(s: RunStatus): number {
    return this.store.runs().filter((r) => r.status === s).length;
  }

  protected stepState(w: Workflow, i: number): StepState {
    const run = this.running();
    if (run?.id === w.id) return i < run.step ? 'done' : i === run.step ? 'current' : 'pending';
    const last = this.last();
    if (last && last.id === w.id && last.version === this.store.version()) {
      if (last.failStep === null || i < last.failStep) return 'done';
      return i === last.failStep ? 'error' : 'skipped';
    }
    return 'idle';
  }

  protected toggle(w: Workflow): void {
    const active = this.store.toggleWorkflow(w.id);
    if (active !== null) this.toast.show(`«${w.name}» ${active ? 'activado' : 'pausado'} (solo en esta demo).`, 'info');
  }

  protected run(w: Workflow): void {
    if (this.running()) return;
    const plan = this.store.planRun(w.id);
    if (!plan) return;
    const version = this.store.version();
    const lastStep = plan.failStep ?? w.steps.length - 1;

    const finish = () => {
      this.running.set(null);
      if (this.store.version() !== version) {
        this.say('Simulación cancelada: los datos de la demo se restablecieron.', 'idle');
        return;
      }
      const entry = this.store.runWorkflow(w.id);
      if (!entry) return;
      this.last.set({ id: w.id, failStep: plan.failStep, version: this.store.version() });
      if (entry.status === 'ok') {
        this.say(`«${w.name}» terminó correctamente en ${seconds(entry.durationMs)} (simulado).`, 'ok');
      } else {
        this.say(`«${w.name}» falló en el paso ${lastStep + 1} de ${w.steps.length}: ${w.steps[lastStep]} (simulado). Quedó registrado en el historial.`, 'danger');
      }
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const step = (i: number) => {
      this.running.set({ id: w.id, step: i });
      this.say(`Ejecutando «${w.name}»: paso ${i + 1} de ${w.steps.length}, ${w.steps[i]}…`, 'accent');
      this.timer = setTimeout(() => (i >= lastStep ? finish() : step(i + 1)), STEP_MS);
    };
    step(0);
  }

  protected clear(): void {
    this.logStatus.set('todas');
    this.logFlow.set('');
  }

  private say(text: string, tone: string): void {
    this.message.set({ text, tone, version: this.store.version() });
  }

  private currentMessage() {
    const m = this.message();
    return m && m.version === this.store.version() ? m : null;
  }
}

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
