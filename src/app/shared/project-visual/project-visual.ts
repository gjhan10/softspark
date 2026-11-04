import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../../data/projects.data';
import { SolutionPreview } from '../solution-preview/solution-preview';

/** Composición de dispositivos: capturas reales si existen; si no, el mockup de la solución. */
@Component({
  selector: 'app-project-visual',
  imports: [SolutionPreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let p = project();
    @if (p.images?.desktop) {
      <div class="laptop">
        <div class="bar" aria-hidden="true"><i></i><i></i><i></i></div>
        <img [src]="p.images!.desktop" [alt]="p.images!.alt" width="1280" height="800" [attr.loading]="eager() ? 'eager' : 'lazy'" decoding="async" />
      </div>
      @if (p.images?.mobile) {
        <div class="phone">
          <img [src]="p.images!.mobile" alt="" width="390" height="844" [attr.loading]="eager() ? 'eager' : 'lazy'" decoding="async" />
        </div>
      }
    } @else if (p.preview) {
      <div class="mock"><app-solution-preview [slug]="p.preview" [wide]="true" /></div>
    }
  `,
  styles: `
    :host { position: relative; display: block; padding: 6% 8% 8% 4%; }
    .laptop { border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface); box-shadow: var(--shadow-3); overflow: hidden; }
    .bar { display: flex; gap: 5px; padding: 8px 10px; border-bottom: 1px solid var(--line); background: var(--surface-2); }
    .bar i { width: 8px; height: 8px; border-radius: 50%; background: var(--line-strong); }
    img { display: block; width: 100%; height: auto; }
    .phone { position: absolute; right: 2%; bottom: 2%; width: 24%; padding: 5px; border: 1px solid var(--line-strong); border-radius: 22px; background: var(--surface); box-shadow: var(--shadow-3); overflow: hidden; }
    .phone img { border-radius: 17px; aspect-ratio: 390 / 600; object-fit: cover; object-position: top; }
    .mock { border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-3); }
  `,
})
export class ProjectVisual {
  readonly project = input.required<Project>();
  readonly eager = input(false);
}
