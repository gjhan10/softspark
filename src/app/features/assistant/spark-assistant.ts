import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { AssistantReply } from './assistant.model';
import { ASSISTANT_PROVIDER } from './assistant.provider';
import { EXAMPLES } from './rules';

interface Turn {
  id: number;
  question: string;
  reply: AssistantReply | null;
}

@Component({
  selector: 'app-spark-assistant',
  imports: [FormsModule, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
  template: `
    <div class="shell">
      <div class="top">
        <span class="avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" /></svg></span>
        <div>
          <strong>Spark Assistant</strong>
          <span class="mode" [class.ai]="mode === 'ia'">
            <span class="dot" aria-hidden="true"></span>
            {{ mode === 'ia' ? 'Con inteligencia artificial' : 'Modo guiado por reglas · sin IA' }}
          </span>
        </div>
      </div>

      <div class="log" #log aria-live="polite" aria-relevant="additions">
        <div class="msg bot">
          <p>Hola. Cuéntame a qué se dedica tu negocio y qué te gustaría mejorar. Te sugiero un tipo de solución, los módulos que podría tener y lo que conviene preparar para cotizar.</p>
          @if (mode === 'reglas') {
            <p class="fine">Las sugerencias salen de reglas fijas definidas por SoftSpark. Tu texto no sale de tu navegador.</p>
          }
        </div>

        @for (t of turns(); track t.id) {
          <div class="msg me"><p>{{ t.question }}</p></div>
          @if (t.reply; as r) {
            <div class="msg bot reply">
              <p>{{ r.intro }}</p>
              @if (r.understood && r.solution) {
                <div class="sol">
                  <span class="label">Solución sugerida</span>
                  <a [routerLink]="['/soluciones', r.solution.slug]" class="sol-name">{{ r.solution.name }} <app-icon name="arrow-up-right" [size]="14" /></a>
                  <p>{{ r.solution.why }}</p>
                </div>
                <div class="cols">
                  <div>
                    <span class="label">Módulos recomendados</span>
                    <ul>@for (m of r.modules; track m) {<li><app-icon name="check" [size]="13" /> {{ m }}</li>}</ul>
                  </div>
                  <div>
                    <span class="label">Posibles integraciones</span>
                    <ul>@for (m of r.integrations; track m) {<li><app-icon name="plug" [size]="13" /> {{ m }}</li>}</ul>
                    <span class="label">Para cotizar, ten a mano</span>
                    <ul>@for (m of r.toQuote; track m) {<li><app-icon name="info" [size]="13" /> {{ m }}</li>}</ul>
                  </div>
                </div>
                @if (r.matched.length && mode === 'reglas') {
                  <p class="fine">Me basé en: {{ r.matched.join(', ') }}.</p>
                }
                <div class="acts">
                  <a routerLink="/contacto" [queryParams]="{ tipo: r.projectType, plan: r.plan, solucion: r.solution.slug }" class="btn btn-brand btn-sm">Cotizar con esta sugerencia <app-icon name="arrow-right" [size]="15" /></a>
                  <a [routerLink]="['/soluciones', r.solution.slug]" class="btn btn-secondary btn-sm">Ver la solución</a>
                </div>
              }
            </div>
          } @else {
            <div class="msg bot typing" aria-label="Spark Assistant está respondiendo"><i></i><i></i><i></i></div>
          }
        }
      </div>

      @if (!turns().length) {
        <div class="examples" role="group" aria-label="Ejemplos">
          @for (e of examples; track e) {
            <button type="button" class="chip" (click)="ask(e)">{{ e }}</button>
          }
        </div>
      }

      <form class="composer" (ngSubmit)="ask(draft)">
        <label for="sa-input" class="sr-only">Describe tu negocio y lo que necesitas</label>
        <textarea id="sa-input" name="draft" rows="2" maxlength="600" [(ngModel)]="draft" (keydown.enter)="onEnter($any($event))" placeholder="Ej.: Tengo una distribuidora y necesito controlar mis inventarios."></textarea>
        <button type="submit" class="send" [disabled]="busy() || !draft.trim()" aria-label="Enviar">
          <app-icon name="arrow-right" [size]="18" />
        </button>
      </form>
      <p class="disclaimer">Orientación general, no una cotización. Para un alcance exacto, conversamos sobre tu proyecto.</p>
    </div>
  `,
  styles: `
    :host { display: block; }
    .shell { display: grid; border: 1px solid var(--line); border-radius: var(--r-2xl); background: var(--surface); box-shadow: var(--shadow-3); overflow: hidden; }
    .top { display: flex; gap: var(--s-3); align-items: center; padding: var(--s-4) var(--s-5); border-bottom: 1px solid var(--line); background: var(--brand-gradient-soft); }
    .top strong { display: block; font-size: var(--fs-md); }
    .avatar { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--brand-gradient); box-shadow: var(--shadow-glow); }
    .avatar svg { width: 20px; height: 20px; fill: #fff; }
    .mode { display: inline-flex; gap: 6px; align-items: center; font: 500 var(--fs-label) var(--font-mono); color: var(--text-2); }
    .mode .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--warn); }
    .mode.ai .dot { background: var(--ok); }
    .log { display: grid; gap: var(--s-3); align-content: start; max-height: min(62vh, 620px); min-height: 220px; overflow-y: auto; padding: var(--s-5); scroll-behavior: smooth; }
    .msg { max-width: 92%; padding: var(--s-3) var(--s-4); border-radius: 18px; font-size: var(--fs-sm); animation: msg-in var(--t-base) var(--ease-out); }
    .msg p + p { margin-top: var(--s-2); }
    .bot { justify-self: start; background: var(--surface-2); border: 1px solid var(--line); border-top-left-radius: 6px; }
    .me { justify-self: end; background: var(--accent); color: var(--accent-ink); border-top-right-radius: 6px; }
    .reply { display: grid; gap: var(--s-3); width: 100%; }
    .fine { font-size: var(--fs-2xs); color: var(--text-3); }
    .label { display: block; margin: var(--s-2) 0 var(--s-1); font: 500 var(--fs-label) var(--font-mono); text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); }
    .sol { padding: var(--s-3) var(--s-4); border-radius: var(--r-lg); background: var(--surface); border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line)); }
    .sol .label { margin-top: 0; }
    .sol-name { display: inline-flex; gap: 4px; align-items: center; font-weight: 650; font-size: var(--fs-md); color: var(--accent); text-decoration: none; }
    .sol p { color: var(--text-2); margin-top: 2px; }
    .cols { display: grid; gap: var(--s-3); }
    ul { list-style: none; display: grid; gap: 3px; }
    li { display: flex; gap: 6px; align-items: flex-start; color: var(--text-2); }
    li app-icon { margin-top: 3px; color: var(--accent); flex: none; }
    .acts { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-2); }
    .typing { display: flex; gap: 4px; padding: var(--s-4); }
    .typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--text-3); animation: dot 1s var(--ease-in-out) infinite; }
    .typing i:nth-child(2) { animation-delay: .15s; } .typing i:nth-child(3) { animation-delay: .3s; }
    .examples { display: flex; flex-wrap: wrap; gap: var(--s-2); padding: 0 var(--s-5) var(--s-4); }
    .examples .chip { text-align: left; white-space: normal; height: auto; padding-block: 8px; }
    .composer { display: flex; gap: var(--s-2); align-items: flex-end; margin: 0 var(--s-4); padding: var(--s-2); border: 1px solid var(--line-strong); border-radius: var(--r-xl); background: var(--surface); transition: border-color var(--t-fast), box-shadow var(--t-fast); }
    .composer:focus-within { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
    textarea { flex: 1; min-height: 44px; max-height: 160px; padding: 10px 12px; border: 0; background: none; resize: vertical; outline: none; font-size: var(--fs-sm); }
    .send { display: grid; place-items: center; width: 44px; height: 44px; flex: none; border: 0; border-radius: 14px; background: var(--brand-gradient); color: #fff; cursor: pointer; transition: opacity var(--t-fast), transform var(--t-fast); }
    .send:disabled { opacity: .4; cursor: not-allowed; }
    .send:not(:disabled):active { transform: scale(.95); }
    .disclaimer { padding: var(--s-3) var(--s-5) var(--s-4); font-size: var(--fs-2xs); color: var(--text-3); }
    @keyframes msg-in { from { opacity: 0; transform: translateY(6px); } }
    @keyframes dot { 50% { opacity: .3; transform: translateY(-2px); } }
    @media (min-width: 700px) { .cols { grid-template-columns: 1fr 1fr; } }
  `,
})
export class SparkAssistant {
  private readonly provider = inject(ASSISTANT_PROVIDER);
  protected readonly mode = this.provider.mode;
  protected readonly examples = EXAMPLES;
  protected readonly turns = signal<Turn[]>([]);
  protected readonly busy = signal(false);
  protected draft = '';
  private nextId = 1;
  private readonly log = viewChild<ElementRef<HTMLElement>>('log');

  protected onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) return;
    event.preventDefault();
    this.ask(this.draft);
  }

  protected async ask(text: string): Promise<void> {
    const question = text.trim();
    if (!question || this.busy()) return;
    const id = this.nextId++;
    this.draft = '';
    this.busy.set(true);
    this.turns.update((t) => [...t, { id, question, reply: null }]);
    this.scroll();
    // Pausa breve para que la respuesta se perciba como tal; con movimiento reducido es inmediata.
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [reply] = await Promise.all([this.provider.reply(question), new Promise((r) => setTimeout(r, reduce ? 0 : 450))]);
    this.turns.update((t) => t.map((x) => (x.id === id ? { ...x, reply } : x)));
    this.busy.set(false);
    this.scroll();
  }

  private scroll(): void {
    setTimeout(() => {
      const el = this.log()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
