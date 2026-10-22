import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LineChart } from '../charts';
import { num, seededSeries } from '../demo-data';

type Range = 7 | 30 | 90;

@Component({
  selector: 'app-demo-analytics',
  imports: [LineChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>Panel de análisis</h2>
        <p>Tráfico y conversiones de un sitio ficticio, generados con datos sintéticos.</p>
      </div>
      <div class="segmented" role="radiogroup" aria-label="Periodo">
        @for (r of ranges; track r) {
          <button type="button" role="radio" [attr.aria-checked]="range() === r" [attr.tabindex]="range() === r ? 0 : -1" (click)="range.set(r)" (keydown)="arrow($event)">{{ r }} días</button>
        }
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><small>Visitas</small><strong>{{ num(totalVisits()) }}</strong><em>últimos {{ range() }} días</em></div>
      <div class="kpi"><small>Conversiones</small><strong>{{ num(totalConv()) }}</strong><em>formularios completados</em></div>
      <div class="kpi"><small>Tasa de conversión</small><strong>{{ rate() }}</strong><em>conversiones / visitas</em></div>
    </div>

    <div class="cols">
      <div class="panel">
        <h3>Visitas diarias <span class="tag">Datos sintéticos</span></h3>
        <app-line-chart [values]="visits()" [labels]="labels()" [label]="'Visitas diarias de los últimos ' + range() + ' días'" />
        <details class="raw">
          <summary>Ver los datos como tabla</summary>
          <div class="table-wrap">
            <table>
              <thead><tr><th scope="col">Día</th><th scope="col" class="num">Visitas</th><th scope="col" class="num">Conversiones</th></tr></thead>
              <tbody>
                @for (v of visits(); track $index) {
                  <tr><td>{{ labels()[$index] }}</td><td class="num">{{ num(v) }}</td><td class="num">{{ num(conversions()[$index]) }}</td></tr>
                }
              </tbody>
            </table>
          </div>
        </details>
      </div>
      <div class="panel">
        <h3>Visitas por canal</h3>
        <ul class="channels">
          @for (c of channels(); track c.name) {
            <li>
              <div class="ch-top"><span>{{ c.name }}</span><span class="v">{{ c.share }} %</span></div>
              <div class="track" aria-hidden="true"><span [style.width.%]="c.share"></span></div>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: `
    .segmented { display: inline-flex; padding: 3px; border: 1px solid var(--line-strong); border-radius: var(--r-md); background: var(--bg-2); }
    .segmented button { min-height: 36px; padding: var(--s-2) var(--s-4); border: 0; border-radius: var(--r-sm); background: none; color: var(--text-2); cursor: pointer; font-size: var(--fs-sm); }
    @media (pointer: coarse) { .segmented button { min-height: var(--tap); } .raw summary { min-height: var(--tap); display: flex; align-items: center; } }
    .segmented button[aria-checked='true'] { background: var(--surface-3); color: var(--text); font-weight: 500; }
    .raw { margin-top: var(--s-4); }
    .raw summary { cursor: pointer; color: var(--accent); font-size: var(--fs-sm); margin-bottom: var(--s-3); }
    .raw .table-wrap { max-height: 260px; overflow: auto; }
    .channels { list-style: none; display: grid; gap: var(--s-4); }
    .ch-top { display: flex; justify-content: space-between; font-size: var(--fs-sm); margin-bottom: var(--s-2); }
    .v { font: 500 var(--fs-xs) var(--font-mono); color: var(--text-2); }
    .track { height: 8px; border-radius: var(--r-pill); background: var(--surface-3); overflow: hidden; }
    .track span { display: block; height: 100%; border-radius: inherit; background: var(--brand-gradient); transition: width var(--t-base) var(--ease); }
  `,
})
export class DemoAnalytics {
  protected readonly ranges: Range[] = [7, 30, 90];
  protected readonly range = signal<Range>(30);
  protected readonly num = num;
  private readonly allVisits = seededSeries(90, 42, 480, 260);
  private readonly allConv = this.allVisits.map((v, i) => Math.round(v * (0.028 + ((i * 7) % 11) / 1000)));
  protected readonly visits = computed(() => this.allVisits.slice(-this.range()));
  protected readonly conversions = computed(() => this.allConv.slice(-this.range()));
  protected readonly labels = computed(() => {
    const n = this.range();
    return Array.from({ length: n }, (_, i) => (n - 1 - i === 0 ? 'Hoy' : `Hace ${n - 1 - i} d`));
  });
  protected readonly totalVisits = computed(() => this.visits().reduce((a, b) => a + b, 0));
  protected readonly totalConv = computed(() => this.conversions().reduce((a, b) => a + b, 0));
  protected readonly rate = computed(() => `${((this.totalConv() / this.totalVisits()) * 100).toFixed(1).replace('.', ',')} %`);
  protected readonly channels = computed(() => {
    const base = { 7: [44, 27, 18, 11], 30: [41, 29, 19, 11], 90: [38, 31, 20, 11] }[this.range()];
    return ['Búsqueda orgánica', 'Redes sociales', 'Directo', 'Referidos'].map((name, i) => ({ name, share: base[i] }));
  });

  protected arrow(e: KeyboardEvent): void {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = this.ranges.indexOf(this.range());
    const next = this.ranges[(i + (e.key === 'ArrowRight' ? 1 : this.ranges.length - 1)) % this.ranges.length];
    this.range.set(next);
    const group = (e.currentTarget as HTMLElement).parentElement;
    setTimeout(() => group?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
  }
}
