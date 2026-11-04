import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArtName =
  | 'web'
  | 'store'
  | 'app'
  | 'erp'
  | 'automation'
  | 'custom'
  | 'api'
  | 'architecture'
  | 'code'
  | 'ux'
  | 'support'
  | 'adapt'
  | 'dashboard'
  | 'security';

/**
 * Ilustraciones SVG originales de SoftSpark. Usan los colores del tema
 * (--accent, --violet, --sky…) y se animan con CSS: los trazos `.draw` se
 * dibujan y los elementos `.pulse`/`.flow` tienen movimiento ambiental.
 * Son decorativas: siempre van con aria-hidden.
 */
@Component({
  selector: 'app-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 240 160" fill="none" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('web') {
          <rect x="34" y="22" width="172" height="116" rx="12" class="f-surface s-line" />
          <path d="M34 44h172" class="s-line" />
          <circle cx="48" cy="33" r="3" class="f-line" /><circle cx="58" cy="33" r="3" class="f-line" /><circle cx="68" cy="33" r="3" class="f-line" />
          <rect x="50" y="58" width="78" height="10" rx="5" class="f-ink" />
          <rect x="50" y="76" width="110" height="6" rx="3" class="f-muted" />
          <rect x="50" y="88" width="92" height="6" rx="3" class="f-muted" />
          <rect x="50" y="106" width="46" height="16" rx="8" class="f-accent pulse" />
          <circle cx="176" cy="94" r="20" class="s-violet draw" stroke-width="2" pathLength="600" />
          <path d="M156 94h40M176 74c8 10 8 30 0 40M176 74c-8 10-8 30 0 40" class="s-violet draw" stroke-width="1.5" pathLength="600" style="--d:.3s" />
        }
        @case ('store') {
          <rect x="30" y="30" width="120" height="104" rx="12" class="f-surface s-line" />
          @for (c of [0, 1]; track c) {
            @for (r of [0, 1]; track r) {
              <rect [attr.x]="42 + c * 52" [attr.y]="42 + r * 44" width="44" height="36" rx="7" class="f-soft" />
              <rect [attr.x]="48 + c * 52" [attr.y]="68 + r * 44" width="22" height="4" rx="2" class="f-muted" />
            }
          }
          <path d="M162 58h14l12 40h30l8-28h-46" class="s-accent draw" stroke-width="2.5" pathLength="600" />
          <circle cx="192" cy="110" r="5" class="f-accent" /><circle cx="214" cy="110" r="5" class="f-accent" />
          <path d="M170 128c18 8 40 6 54-6" class="s-violet draw" stroke-width="2" stroke-dasharray="4 6" pathLength="600" style="--d:.4s" />
        }
        @case ('app') {
          <rect x="26" y="26" width="136" height="104" rx="12" class="f-surface s-line" />
          <rect x="26" y="26" width="34" height="104" rx="12" class="f-soft" />
          <rect x="72" y="40" width="76" height="40" rx="8" class="f-soft" />
          <path d="M80 70l14-10 12 6 16-14 16 8" class="s-accent draw" stroke-width="2.5" pathLength="600" />
          <rect x="72" y="88" width="34" height="30" rx="7" class="f-muted" />
          <rect x="114" y="88" width="34" height="30" rx="7" class="f-violet-soft" />
          <rect x="172" y="44" width="44" height="80" rx="10" class="f-surface s-line" />
          <rect x="180" y="58" width="28" height="6" rx="3" class="f-ink" />
          <rect x="180" y="72" width="28" height="22" rx="5" class="f-accent pulse" />
          <rect x="180" y="100" width="20" height="5" rx="2.5" class="f-muted" />
        }
        @case ('erp') {
          <circle cx="120" cy="80" r="22" class="f-accent" />
          <path d="M112 80h16M120 72v16" class="s-white" stroke-width="2.5" />
          @for (n of hub; track $index) {
            <path [attr.d]="'M120 80 L' + n[0] + ' ' + n[1]" class="s-line draw" stroke-width="2" pathLength="600" [style.--d]="$index * 0.12 + 's'" />
            <rect [attr.x]="n[0] - 22" [attr.y]="n[1] - 14" width="44" height="28" rx="8" class="f-surface s-line" />
            <rect [attr.x]="n[0] - 12" [attr.y]="n[1] - 3" width="24" height="6" rx="3" [attr.class]="$index % 2 ? 'f-violet-soft' : 'f-soft'" />
          }
          <circle r="4" class="f-violet mover"><animateMotion dur="3.2s" repeatCount="indefinite" path="M120 80 L46 34 L120 80 L194 34 L120 80 L194 126 L120 80 L46 126 Z" /></circle>
        }
        @case ('automation') {
          <rect x="22" y="58" width="48" height="44" rx="10" class="f-surface s-line" />
          <rect x="96" y="58" width="48" height="44" rx="10" class="f-surface s-line" />
          <rect x="170" y="58" width="48" height="44" rx="10" class="f-accent" />
          <path d="M70 80h26M144 80h26" class="s-accent draw" stroke-width="2.5" pathLength="600" />
          <path d="M40 80l6 6 10-12" class="s-ok" stroke-width="3" />
          <circle cx="120" cy="80" r="9" class="s-violet spin-slow" stroke-width="3" stroke-dasharray="14 8" />
          <path d="M186 80h16M196 74l6 6-6 6" class="s-white" stroke-width="2.5" />
          <path d="M46 46c0-14 22-22 74-22s74 8 74 22" class="s-violet draw" stroke-width="1.8" stroke-dasharray="3 6" pathLength="600" style="--d:.5s" />
          <circle cx="194" cy="44" r="4" class="f-violet pulse" />
        }
        @case ('custom') {
          <rect x="30" y="28" width="122" height="104" rx="12" class="f-ink-panel" />
          <path d="M50 58l-12 12 12 12" class="s-sky" stroke-width="3" />
          <path d="M94 58l12 12-12 12" class="s-sky" stroke-width="3" />
          <path d="M80 54l-10 32" class="s-violet" stroke-width="3" />
          <rect x="44" y="98" width="62" height="6" rx="3" class="f-code" />
          <rect x="44" y="110" width="40" height="6" rx="3" class="f-code-2" />
          <g class="spin-slow">
            <circle cx="186" cy="80" r="22" class="s-accent" stroke-width="7" stroke-dasharray="9 7" />
          </g>
          <circle cx="186" cy="80" r="11" class="f-surface s-accent" stroke-width="2.5" />
        }
        @case ('api') {
          <rect x="22" y="40" width="70" height="80" rx="12" class="f-surface s-line" />
          <rect x="148" y="40" width="70" height="80" rx="12" class="f-surface s-line" />
          <text x="57" y="86" text-anchor="middle" class="t-mono">GET</text>
          <text x="183" y="86" text-anchor="middle" class="t-mono t-ok">200</text>
          <path d="M92 66h56" class="s-accent draw" stroke-width="2.5" pathLength="600" />
          <path d="M148 96H92" class="s-violet draw" stroke-width="2.5" pathLength="600" style="--d:.4s" />
          <circle r="4" class="f-accent mover"><animateMotion dur="2.4s" repeatCount="indefinite" path="M92 66h56" /></circle>
          <circle r="4" class="f-violet mover"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M148 96H92" /></circle>
        }
        @case ('architecture') {
          @for (row of layers; track $index) {
            <rect [attr.x]="row.x" [attr.y]="row.y" [attr.width]="row.w" height="26" rx="8" [attr.class]="row.c" />
          }
          <path d="M120 50v12M84 88v12M156 88v12M120 88v12" class="s-line" stroke-width="2" />
          <path d="M60 140h120" class="s-accent draw" stroke-width="2" stroke-dasharray="4 6" pathLength="600" />
          <path d="M200 120l12-12 12 12M212 108v36" class="s-violet draw" stroke-width="2.5" pathLength="600" style="--d:.5s" />
        }
        @case ('code') {
          <rect x="28" y="24" width="184" height="112" rx="12" class="f-ink-panel" />
          @for (l of codeLines; track $index) {
            <rect [attr.x]="44 + l[0]" [attr.y]="44 + $index * 15" [attr.width]="l[1]" height="6" rx="3" [attr.class]="l[2]" />
          }
          <rect x="150" y="96" width="50" height="26" rx="8" class="f-ok-soft" />
          <path d="M162 109l6 6 12-12" class="s-ok draw" stroke-width="3" pathLength="600" style="--d:.6s" />
        }
        @case ('ux') {
          <rect x="40" y="26" width="110" height="108" rx="14" class="f-surface s-line" />
          <circle cx="70" cy="56" r="12" class="f-violet-soft" />
          <rect x="88" y="50" width="44" height="6" rx="3" class="f-ink" />
          <rect x="88" y="60" width="30" height="5" rx="2.5" class="f-muted" />
          <rect x="54" y="80" width="82" height="34" rx="8" class="f-soft" />
          <path d="M150 104c22-6 34-24 36-46" class="s-accent draw" stroke-width="2" stroke-dasharray="4 6" pathLength="600" />
          <path d="M178 46l10 26 6-10 10-4z" class="f-accent cursor" />
          <circle cx="186" cy="58" r="16" class="s-violet pulse-ring" stroke-width="2" />
        }
        @case ('support') {
          <rect x="30" y="34" width="112" height="56" rx="14" class="f-soft" />
          <rect x="44" y="50" width="70" height="6" rx="3" class="f-ink" />
          <rect x="44" y="64" width="50" height="6" rx="3" class="f-muted" />
          <rect x="98" y="88" width="112" height="48" rx="14" class="f-accent" />
          <rect x="112" y="104" width="64" height="6" rx="3" class="f-white" />
          <rect x="112" y="116" width="40" height="5" rx="2.5" class="f-white-2" />
          <circle cx="192" cy="50" r="14" class="f-violet-soft" />
          <circle cx="186" cy="50" r="2.5" class="f-violet typing" /><circle cx="192" cy="50" r="2.5" class="f-violet typing t2" /><circle cx="198" cy="50" r="2.5" class="f-violet typing t3" />
        }
        @case ('adapt') {
          <rect x="36" y="40" width="64" height="80" rx="12" class="f-soft" />
          <rect x="140" y="40" width="64" height="80" rx="12" class="f-surface s-accent" stroke-width="2" />
          @for (i of [0, 1, 2]; track i) {
            <rect x="48" [attr.y]="54 + i * 20" width="40" height="10" rx="5" class="f-muted" />
            <rect x="152" [attr.y]="54 + i * 20" [attr.width]="40 - i * 8" height="10" rx="5" [attr.class]="i === 0 ? 'f-accent' : 'f-violet-soft'" />
          }
          <path d="M104 80h30M126 72l8 8-8 8" class="s-violet draw" stroke-width="2.5" pathLength="600" />
        }
        @case ('dashboard') {
          <rect x="24" y="24" width="192" height="112" rx="12" class="f-surface s-line" />
          @for (b of bars; track $index) {
            <rect [attr.x]="40 + $index * 16" [attr.y]="120 - b" width="10" [attr.height]="b" rx="3" [attr.class]="$index === bars.length - 1 ? 'f-accent grow' : 'f-soft grow'" [style.animation-delay]="$index * 60 + 'ms'" />
          }
          <circle cx="178" cy="72" r="26" class="s-line" stroke-width="9" />
          <circle cx="178" cy="72" r="26" class="s-violet draw" stroke-width="9" pathLength="100" style="--len:100" stroke-dasharray="64 100" />
        }
        @case ('security') {
          <path d="M120 22l58 20v38c0 34-26 54-58 62-32-8-58-28-58-62V42z" class="f-soft s-accent" stroke-width="2" />
          <rect x="98" y="72" width="44" height="36" rx="8" class="f-accent" />
          <path d="M106 72v-8a14 14 0 0 1 28 0v8" class="s-accent" stroke-width="4" />
          <circle cx="120" cy="88" r="4" class="f-white" />
          <path d="M120 92v7" class="s-white" stroke-width="3" />
        }
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { display: block; width: 100%; height: 100%; overflow: visible; }
    .f-surface { fill: var(--surface); }
    .f-soft { fill: var(--accent-soft); }
    .f-violet-soft { fill: var(--violet-soft); }
    .f-ok-soft { fill: var(--ok-soft); }
    .f-muted { fill: var(--surface-3); }
    .f-ink { fill: var(--text); opacity: .82; }
    .f-accent { fill: var(--accent); }
    .f-violet { fill: var(--violet); }
    .f-line { fill: var(--line-strong); }
    .f-white { fill: #fff; }
    .f-white-2 { fill: rgb(255 255 255 / 60%); }
    .f-ink-panel { fill: #111827; }
    :host-context([data-theme='dark']) .f-ink-panel { fill: #070b18; stroke: var(--line); }
    .f-code { fill: #8ba3ff; opacity: .7; }
    .f-code-2 { fill: #c4b5fd; opacity: .6; }
    .s-line { stroke: var(--line-strong); }
    .s-accent { stroke: var(--accent); }
    .s-violet { stroke: var(--violet); }
    .s-sky { stroke: #67e8f9; }
    .s-ok { stroke: var(--ok); }
    .s-white { stroke: #fff; }
    .t-mono { font: 700 13px var(--font-mono); fill: var(--accent); }
    .t-ok { fill: var(--ok); }
    .pulse { animation: art-pulse 2.8s var(--ease-in-out) infinite; transform-box: fill-box; transform-origin: center; }
    .pulse-ring { animation: art-ring 2.4s var(--ease-out) infinite; transform-box: fill-box; transform-origin: center; }
    .spin-slow { animation: art-spin 9s linear infinite; transform-box: fill-box; transform-origin: center; }
    .cursor { animation: art-cursor 3.2s var(--ease-in-out) infinite; }
    .typing { animation: art-type 1.2s var(--ease-in-out) infinite; }
    .t2 { animation-delay: .15s; } .t3 { animation-delay: .3s; }
    .grow { transform-box: fill-box; transform-origin: bottom; animation: art-grow .9s var(--ease-out) both; }
    @keyframes art-pulse { 50% { opacity: .55; transform: scale(.96); } }
    @keyframes art-ring { from { opacity: .9; transform: scale(.6); } to { opacity: 0; transform: scale(1.4); } }
    @keyframes art-spin { to { transform: rotate(360deg); } }
    @keyframes art-cursor { 50% { transform: translate(-6px, 6px); } }
    @keyframes art-type { 50% { opacity: .25; } }
    @keyframes art-grow { from { transform: scaleY(.1); } }
    @media (prefers-reduced-motion: reduce) {
      .pulse, .pulse-ring, .spin-slow, .cursor, .typing, .grow { animation: none; }
      .mover { display: none; }
    }
  `,
})
export class Art {
  readonly name = input.required<ArtName>();
  protected readonly hub = [
    [46, 34],
    [194, 34],
    [194, 126],
    [46, 126],
  ];
  protected readonly layers = [
    { x: 70, y: 24, w: 100, c: 'f-accent' },
    { x: 46, y: 62, w: 76, c: 'f-soft' },
    { x: 130, y: 62, w: 64, c: 'f-violet-soft' },
    { x: 46, y: 100, w: 148, c: 'f-muted' },
  ];
  protected readonly codeLines: [number, number, string][] = [
    [0, 60, 'f-code'],
    [14, 90, 'f-code-2'],
    [14, 70, 'f-code'],
    [28, 52, 'f-code-2'],
    [0, 30, 'f-code'],
  ];
  protected readonly bars = [36, 52, 44, 66, 58, 80, 88];
}
