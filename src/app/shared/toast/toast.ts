import { ChangeDetectionStrategy, Component, inject, Injectable, signal } from '@angular/core';
import { Icon } from '../icon/icon';

export interface Toast {
  id: number;
  text: string;
  tone: 'ok' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly items = signal<Toast[]>([]);
  private seq = 0;

  show(text: string, tone: Toast['tone'] = 'ok'): void {
    const id = ++this.seq;
    this.items.update((list) => [...list.slice(-2), { id, text, tone }]);
    setTimeout(() => this.dismiss(id), 3800);
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }
}

@Component({
  selector: 'app-toast-outlet',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack" role="status" aria-live="polite">
      @for (t of toasts.items(); track t.id) {
        <div class="toast" [attr.data-tone]="t.tone">
          <app-icon [name]="t.tone === 'ok' ? 'check' : 'info'" [size]="18" />
          <span>{{ t.text }}</span>
          <button type="button" (click)="toasts.dismiss(t.id)" aria-label="Cerrar aviso"><app-icon name="x" [size]="16" /></button>
        </div>
      }
    </div>
  `,
  styles: `
    .stack { position: fixed; right: 16px; bottom: 16px; z-index: 1800; display: grid; gap: 8px; width: min(380px, calc(100vw - 32px)); }
    .toast {
      display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; padding: 12px 12px 12px 14px;
      background: var(--surface-3); border: 1px solid var(--line-strong); border-radius: var(--r-md); box-shadow: var(--shadow-2);
      font-size: 0.92rem; animation: in var(--t-base) var(--ease);
    }
    .toast[data-tone='ok'] app-icon:first-child { color: var(--ok); }
    .toast[data-tone='info'] app-icon:first-child { color: var(--accent); }
    button { display: grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: var(--r-sm); background: none; color: var(--text-3); cursor: pointer; }
    button:hover { background: var(--surface-2); color: var(--text); }
    @keyframes in { from { opacity: 0; transform: translateY(8px); } }
  `,
})
export class ToastOutlet {
  protected readonly toasts = inject(ToastService);
}
