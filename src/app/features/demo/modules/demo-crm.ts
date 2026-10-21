import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../shared/toast/toast';
import { money, OWNERS, Stage, STAGES } from '../demo-data';
import { DemoStore } from '../demo-store';

@Component({
  selector: 'app-demo-crm',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>CRM comercial</h2>
        <p>Oportunidades de venta de empresas ficticias.</p>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><small>En curso</small><strong>{{ money(store.pipelineValue()) }}</strong><em>valor estimado</em></div>
      <div class="kpi"><small>Ganadas</small><strong>{{ money(store.wonValue()) }}</strong><em>{{ count('ganada') }} oportunidades</em></div>
      <div class="kpi"><small>Tasa de cierre</small><strong>{{ closeRate() }} %</strong><em>ganadas / cerradas</em></div>
    </div>

    <div class="chips" role="group" aria-label="Filtrar por etapa">
      <button type="button" class="chip" [attr.aria-pressed]="stage() === 'todas'" (click)="stage.set('todas')">Todas <span class="count">{{ store.opportunities().length }}</span></button>
      @for (s of stages; track s.id) {
        <button type="button" class="chip" [attr.aria-pressed]="stage() === s.id" (click)="stage.set(s.id)">{{ s.label }} <span class="count">{{ count(s.id) }}</span></button>
      }
    </div>

    <div class="toolbar">
      <label class="search">
        <span class="sr-only">Buscar oportunidades</span>
        <app-icon name="search" [size]="18" />
        <input class="input" type="search" placeholder="Buscar por empresa o contacto" [value]="query()" (input)="query.set($any($event.target).value)" />
      </label>
      <label class="sr-only" for="crm-owner">Responsable</label>
      <select id="crm-owner" class="input" [value]="owner()" (change)="owner.set($any($event.target).value)">
        <option value="">Todos los responsables</option>
        @for (o of owners; track o) { <option [value]="o">{{ o }}</option> }
      </select>
    </div>

    <p class="result-count" aria-live="polite">{{ rows().length }} {{ rows().length === 1 ? 'oportunidad' : 'oportunidades' }}</p>

    @if (rows().length) {
      <div class="table-wrap">
        <table class="responsive">
          <thead><tr><th scope="col">Empresa</th><th scope="col">Etapa</th><th scope="col" class="num">Valor</th><th scope="col">Responsable</th><th scope="col">Actualizado</th><th scope="col">Acciones</th></tr></thead>
          <tbody>
            @for (o of rows(); track o.id) {
              <tr>
                <td data-label="Empresa" class="wide"><strong>{{ o.company }}</strong><br /><span class="muted">{{ o.contact }}</span></td>
                <td data-label="Etapa"><span class="tag" [attr.data-tone]="tone(o.stage)">{{ label(o.stage) }}</span></td>
                <td data-label="Valor" class="num">{{ money(o.value) }}</td>
                <td data-label="Responsable">{{ o.owner }}</td>
                <td data-label="Actualizado" class="muted">{{ o.updated }}</td>
                <td data-label="Acciones" class="wide">
                  <div class="row-actions">
                    <button type="button" class="btn btn-secondary btn-sm" (click)="advance(o.id, o.company)" [disabled]="o.stage === 'ganada' || o.stage === 'perdida'">Avanzar etapa</button>
                    <button type="button" class="btn btn-ghost btn-sm" (click)="lose(o.id, o.company)" [disabled]="o.stage === 'ganada' || o.stage === 'perdida'">Marcar perdida</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <div class="empty">
        <app-icon name="search" [size]="28" />
        <strong>No hay oportunidades con esos filtros</strong>
        <button type="button" class="btn btn-secondary btn-sm" (click)="clear()">Limpiar filtros</button>
      </div>
    }
  `,
  styles: `.muted { color: var(--text-3); font-size: 0.85rem; }`,
})
export class DemoCrm {
  protected readonly store = inject(DemoStore);
  private readonly toast = inject(ToastService);
  protected readonly stages = STAGES;
  protected readonly owners = OWNERS;
  protected readonly money = money;
  protected readonly stage = signal<Stage | 'todas'>('todas');
  protected readonly query = signal('');
  protected readonly owner = signal('');

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.store
      .opportunities()
      .filter((o) => this.stage() === 'todas' || o.stage === this.stage())
      .filter((o) => !this.owner() || o.owner === this.owner())
      .filter((o) => !q || o.company.toLowerCase().includes(q) || o.contact.toLowerCase().includes(q));
  });

  protected readonly closeRate = computed(() => {
    const won = this.count('ganada');
    const closed = won + this.count('perdida');
    return closed ? Math.round((won / closed) * 100) : 0;
  });

  protected count(s: Stage): number {
    return this.store.opportunities().filter((o) => o.stage === s).length;
  }

  protected label(s: Stage): string {
    return STAGES.find((x) => x.id === s)!.label;
  }

  protected tone(s: Stage): string {
    return s === 'ganada' ? 'ok' : s === 'perdida' ? 'danger' : s === 'negociacion' ? 'warn' : s === 'propuesta' ? 'cyan' : 'accent';
  }

  protected advance(id: number, company: string): void {
    const next = this.store.advance(id);
    if (next) this.toast.show(`${company} pasó a «${this.label(next)}» (solo en esta demo).`);
  }

  protected lose(id: number, company: string): void {
    this.store.markLost(id);
    this.toast.show(`${company} se marcó como perdida (solo en esta demo).`, 'info');
  }

  protected clear(): void {
    this.stage.set('todas');
    this.query.set('');
    this.owner.set('');
  }
}
