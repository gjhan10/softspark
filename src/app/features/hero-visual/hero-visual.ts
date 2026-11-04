import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { Icon, IconName } from '../../shared/icon/icon';

/**
 * Composición del inicio: el ecosistema que construye SoftSpark (web, API,
 * ERP/CRM, automatización y móvil) conectado por una red de nodos.
 * Todo es ilustrativo y usa datos ficticios.
 */
@Component({
  selector: 'app-hero-visual',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="stage">
      <svg class="net" viewBox="0 0 600 520" aria-hidden="true">
        <defs>
          <radialGradient id="hv-glow">
            <stop offset="0" stop-color="var(--violet)" stop-opacity=".32" />
            <stop offset="1" stop-color="var(--violet)" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="330" cy="250" r="240" fill="url(#hv-glow)" class="glow" />
        <circle cx="300" cy="260" r="210" class="orbit" />
        <circle cx="300" cy="260" r="150" class="orbit o2" />
        @for (p of paths; track $index) {
          <path [attr.d]="p" class="link draw" pathLength="600" [style.--d]="0.3 + $index * 0.18 + 's'" />
        }
        @if (motion()) {
          @for (p of paths; track $index) {
            <circle r="3.5" class="packet">
              <animateMotion [attr.path]="p" dur="5.5s" repeatCount="indefinite" [attr.begin]="$index * -1.1 + 's'" />
            </circle>
          }
        }
        @for (n of nodePoints; track $index) {
          <g class="node" [style.--d]="0.9 + $index * 0.12 + 's'">
            <circle [attr.cx]="n[0]" [attr.cy]="n[1]" r="9" class="halo" />
            <circle [attr.cx]="n[0]" [attr.cy]="n[1]" r="4.5" class="core" />
          </g>
        }
      </svg>

      <div class="window layer" data-depth="10" aria-hidden="true">
        <div class="chrome"><i></i><i></i><i></i><span>app.empresa-demo.pe/panel</span></div>
        <div class="app">
          <aside>
            @for (m of menu; track m.icon; let first = $first) {
              <span class="item" [class.on]="first"><app-icon [name]="m.icon" [size]="15" /><b>{{ m.label }}</b></span>
            }
          </aside>
          <div class="main">
            <div class="kpis">
              @for (k of kpis; track k.label) {
                <div class="kpi">
                  <small>{{ k.label }}</small>
                  <strong>{{ k.value }}</strong>
                  <em [class.down]="k.delta.startsWith('-')">{{ k.delta }}</em>
                </div>
              }
            </div>
            <div class="chart">
              <div class="chart-head"><small>Ventas por semana</small><span class="pill">8 sem.</span></div>
              <svg viewBox="0 0 300 90" preserveAspectRatio="none" class="area">
                <defs>
                  <linearGradient id="hv-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stop-color="var(--accent)" stop-opacity=".28" />
                    <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 70 L40 58 L80 64 L120 44 L160 50 L200 30 L240 36 L300 12 L300 90 L0 90Z" fill="url(#hv-area)" />
                <path d="M0 70 L40 58 L80 64 L120 44 L160 50 L200 30 L240 36 L300 12" class="draw spark" pathLength="600" fill="none" style="--d: .6s" />
              </svg>
            </div>
            <div class="rows">
              @for (r of rows; track r.name) {
                <div class="row"><span class="dot" [attr.data-s]="r.state"></span><b>{{ r.name }}</b><small>{{ r.stage }}</small></div>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="card api layer" data-depth="22" aria-hidden="true">
        <span class="badge">API REST</span>
        <code><b>POST</b> /v1/pedidos</code>
        <span class="status"><i></i> 201 Created · 84 ms</span>
      </div>

      <div class="card flow layer" data-depth="30" aria-hidden="true">
        <span class="badge v">Automatización</span>
        <ol>
          <li class="done"><app-icon name="check" [size]="12" /> Pedido registrado</li>
          <li class="done"><app-icon name="check" [size]="12" /> Factura generada</li>
          <li class="run"><span class="spin"></span> Enviando al cliente</li>
        </ol>
      </div>

      <div class="card sync layer" data-depth="18" aria-hidden="true">
        <span class="chip">ERP</span>
        <span class="wire"><i></i></span>
        <span class="chip">CRM</span>
        <small>Sincronizado</small>
      </div>

      <div class="phone layer" data-depth="38" aria-hidden="true">
        <span class="notch"></span>
        <small>Pedidos hoy</small>
        <strong>48</strong>
        <div class="ring">
          <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="track" /><circle cx="18" cy="18" r="15" class="fill draw" pathLength="100" style="--len: 100; --d: 1.1s" /></svg>
          <span>72 %</span>
        </div>
        <span class="toast"><app-icon name="info" [size]="11" /> 3 pedidos nuevos</span>
      </div>

      <figcaption>Composición ilustrativa con datos ficticios</figcaption>
    </figure>
  `,
  styleUrl: './hero-visual.scss',
})
export class HeroVisual {
  protected readonly menu: { icon: IconName; label: string }[] = [
    { icon: 'grid', label: 'Panel' },
    { icon: 'users', label: 'Clientes' },
    { icon: 'box', label: 'Inventario' },
    { icon: 'workflow', label: 'Flujos' },
  ];
  protected readonly kpis = [
    { label: 'Pedidos', value: '1 284', delta: '+12,4 %' },
    { label: 'Clientes', value: '342', delta: '+4,1 %' },
    { label: 'Stock bajo', value: '7', delta: '-3' },
  ];
  protected readonly rows = [
    { name: 'Alfa Distribuciones', stage: 'Propuesta', state: 'a' },
    { name: 'Beta Logística', stage: 'Negociación', state: 'b' },
  ];
  protected readonly paths = [
    'M60 120 C 160 80, 220 160, 300 140',
    'M300 140 C 380 120, 470 60, 545 95',
    'M300 140 C 290 240, 360 300, 470 330',
    'M90 400 C 170 330, 230 300, 300 140',
    'M470 330 C 520 380, 540 430, 520 470',
  ];
  protected readonly motion = signal(false);
  protected readonly nodePoints = [
    [60, 120],
    [300, 140],
    [545, 95],
    [470, 330],
    [90, 400],
    [520, 470],
  ];

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    // Parallax muy sutil, solo con ratón y si el usuario acepta movimiento.
    afterNextRender(() => {
      const win = host.ownerDocument.defaultView;
      this.motion.set(!!win?.matchMedia('(prefers-reduced-motion: no-preference)').matches);
      if (!win?.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
      const layers = Array.from(host.querySelectorAll<HTMLElement>('.layer'));
      let frame = 0;
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          for (const l of layers) {
            const d = Number(l.dataset['depth'] ?? 10) / 10;
            l.style.setProperty('--px', `${(-x * 6 * d).toFixed(2)}px`);
            l.style.setProperty('--py', `${(-y * 6 * d).toFixed(2)}px`);
          }
        });
      };
      const onLeave = () => layers.forEach((l) => (l.style.removeProperty('--px'), l.style.removeProperty('--py')));
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerleave', onLeave);
      });
    });
  }
}
