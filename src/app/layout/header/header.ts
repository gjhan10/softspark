import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { Icon } from '../../shared/icon/icon';
import { NAV_LINKS } from '../nav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'close(true)', '(window:scroll)': 'onScroll()' },
})
export class Header {
  private readonly doc = inject(DOCUMENT);
  protected readonly links = NAV_LINKS;
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);
  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('toggleBtn');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    const sub = inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.close(false));
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
  }

  toggle(): void {
    if (this.open()) {
      this.close(true);
      return;
    }
    this.open.set(true);
    this.doc.body.style.overflow = 'hidden';
    setTimeout(() => this.panel()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus());
  }

  close(returnFocus: boolean): void {
    if (!this.open()) return;
    this.open.set(false);
    this.doc.body.style.overflow = '';
    if (returnFocus) this.toggleBtn()?.nativeElement.focus();
  }

  onScroll(): void {
    this.scrolled.set((this.doc.defaultView?.scrollY ?? 0) > 8);
  }

  trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.open()) return;
    const root = this.panel()?.nativeElement;
    if (!root) return;
    const items = [this.toggleBtn()!.nativeElement, ...Array.from(root.querySelectorAll<HTMLElement>('a, button'))];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && this.doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
