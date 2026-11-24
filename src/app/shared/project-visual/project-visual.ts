import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../../data/projects.data';

/** Capturas reales del proyecto: escritorio y, si existe, móvil superpuesto. Sin marcos de navegador dibujados. */
@Component({
  selector: 'app-project-visual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let p = project();
    @if (p.images?.desktop) {
      <img class="desk" [src]="p.images!.desktop" [alt]="p.images!.alt" width="1280" height="800" [attr.loading]="eager() ? 'eager' : 'lazy'" decoding="async" />
      @if (p.images?.mobile) {
        <img class="mob" [src]="p.images!.mobile" alt="" width="390" height="844" [attr.loading]="eager() ? 'eager' : 'lazy'" decoding="async" />
      }
    }
  `,
  styles: `
    :host { position: relative; display: block; padding: var(--space-xl) var(--space-2xl) var(--space-2xl) var(--space-xl); }
    :host:empty { display: none; }
    img { display: block; width: 100%; height: auto; }
    .desk { border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-card); box-shadow: var(--shadow-3); }
    .mob { position: absolute; right: var(--space-md); bottom: var(--space-md); width: 22%; border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-card); box-shadow: var(--shadow-3); aspect-ratio: 390 / 600; object-fit: cover; object-position: top; }
  `,
})
export class ProjectVisual {
  readonly project = input.required<Project>();
  readonly eager = input(false);
}
