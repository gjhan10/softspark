import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bars" role="img" [attr.aria-label]="summary()">
      @for (v of values(); track $index) {
        <div class="col">
          <span class="val">{{ format()(v) }}</span>
          <span class="bar" [style.height.%]="(v / max()) * 100" [class.last]="$last"></span>
          <span class="lbl">{{ labels()[$index] }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .bars { display: flex; align-items: stretch; gap: 8px; height: 220px; padding-top: 8px; }
    .col { flex: 1; min-width: 0; display: grid; grid-template-rows: auto 1fr auto; gap: 6px; text-align: center; }
    .col { align-items: end; }
    .bar { align-self: end; justify-self: center; width: min(100%, 44px); min-height: 4px; border-radius: 6px 6px 2px 2px; background: color-mix(in srgb, var(--accent) 70%, transparent); transition: height var(--t-base) var(--ease); }
    .bar.last { background: var(--brand-gradient); }
    .val { font: 500 11px var(--font-mono); color: var(--text-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .lbl { font-size: 12px; color: var(--text-3); white-space: nowrap; }
    @media (max-width: 520px) { .val { display: none; } }
  `,
})
export class BarChart {
  readonly values = input.required<number[]>();
  readonly labels = input.required<string[]>();
  readonly label = input('');
  readonly format = input<(n: number) => string>((n) => String(n));
  protected readonly max = computed(() => Math.max(1, ...this.values()));
  protected readonly summary = computed(() => `${this.label()}: ` + this.values().map((v, i) => `${this.labels()[i]} ${this.format()(v)}`).join(', '));
}

@Component({
  selector: 'app-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" tabindex="0" role="img"
        [attr.aria-label]="label() + '. Usa las flechas para recorrer los valores.'"
        (pointermove)="hover($event)" (pointerleave)="active.set(-1)" (keydown)="key($event)" (blur)="active.set(-1)">
        <defs>
          <linearGradient [attr.id]="gid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.32" />
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
          </linearGradient>
        </defs>
        @for (g of grid(); track g.y) {
          <line [attr.x1]="0" [attr.x2]="W" [attr.y1]="g.y" [attr.y2]="g.y" class="grid" />
        }
        <path [attr.d]="area()" [attr.fill]="'url(#' + gid + ')'" />
        <path [attr.d]="line()" class="line" />
        @if (active() >= 0) {
          <line [attr.x1]="x(active())" [attr.x2]="x(active())" y1="0" [attr.y2]="H" class="cursor" />
          <circle [attr.cx]="x(active())" [attr.cy]="y(values()[active()])" r="4.5" class="dot" />
        }
      </svg>
      @if (active() >= 0) {
        <div class="tip" [style.left.%]="(x(active()) / W) * 100">
          <strong>{{ values()[active()] }}</strong> · {{ labels()[active()] }}
        </div>
      }
      <div class="axis">
        @for (g of grid(); track g.y) {
          <span [style.top.%]="(g.y / H) * 100">{{ g.v }}</span>
        }
      </div>
      <div class="xaxis"><span>{{ labels()[0] }}</span><span>{{ labels()[labels().length - 1] }}</span></div>
    </div>
  `,
  styles: `
    .wrap { position: relative; padding-left: 40px; }
    svg { display: block; width: 100%; height: 240px; overflow: visible; outline: none; border-radius: 6px; }
    svg:focus-visible { outline: 2px solid var(--focus); outline-offset: 4px; }
    .grid { stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke; }
    .line { fill: none; stroke: var(--accent); stroke-width: 2.25; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    .cursor { stroke: var(--line-strong); stroke-width: 1; vector-effect: non-scaling-stroke; }
    .dot { fill: var(--bg); stroke: var(--cyan); stroke-width: 2.5; vector-effect: non-scaling-stroke; }
    .axis span { position: absolute; left: 0; transform: translateY(-50%); font: 500 11px var(--font-mono); color: var(--text-3); }
    .xaxis { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--text-3); }
    .tip { position: absolute; top: -8px; transform: translate(-50%, -100%); padding: 6px 10px; border-radius: 8px; background: var(--surface-3); border: 1px solid var(--line-strong); font-size: 12px; white-space: nowrap; pointer-events: none; box-shadow: var(--shadow-2); }
    .tip { color: var(--text-3); } .tip strong { color: var(--text); }
  `,
})
export class LineChart {
  readonly values = input.required<number[]>();
  readonly labels = input.required<string[]>();
  readonly label = input('Gráfico');
  protected readonly W = 600;
  protected readonly H = 240;
  protected readonly gid = `lg-${Math.random().toString(36).slice(2, 8)}`;
  protected readonly active = signal(-1);
  private readonly bounds = computed(() => {
    const v = this.values();
    const min = Math.min(...v);
    const max = Math.max(...v);
    const pad = (max - min) * 0.12 || 1;
    return { min: Math.max(0, Math.floor(min - pad)), max: Math.ceil(max + pad) };
  });
  protected readonly grid = computed(() => {
    const { min, max } = this.bounds();
    return [0, 1, 2, 3].map((i) => {
      const v = Math.round(max - ((max - min) * i) / 3);
      return { v, y: this.y(v) };
    });
  });
  protected readonly line = computed(() => this.values().map((v, i) => `${i ? 'L' : 'M'}${this.x(i).toFixed(1)} ${this.y(v).toFixed(1)}`).join(' '));
  protected readonly area = computed(() => `${this.line()} L${this.W} ${this.H} L0 ${this.H} Z`);

  protected x(i: number): number {
    const n = this.values().length;
    return n <= 1 ? 0 : (i / (n - 1)) * this.W;
  }

  protected y(v: number): number {
    const { min, max } = this.bounds();
    return this.H - ((v - min) / (max - min || 1)) * this.H;
  }

  protected hover(e: PointerEvent): void {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const n = this.values().length;
    const i = Math.round(((e.clientX - rect.left) / rect.width) * (n - 1));
    this.active.set(Math.min(n - 1, Math.max(0, i)));
  }

  protected key(e: KeyboardEvent): void {
    const n = this.values().length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const cur = this.active() < 0 ? (e.key === 'ArrowRight' ? -1 : n) : this.active();
      this.active.set(Math.min(n - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1))));
    } else if (e.key === 'Home') {
      this.active.set(0);
    } else if (e.key === 'End') {
      this.active.set(n - 1);
    }
  }
}
