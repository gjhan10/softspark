import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section-tight">
      <div class="container">
        <div class="band">
          <div class="copy">
            <h2>{{ title() }}</h2>
            <p>{{ text() }}</p>
          </div>
          <div class="btns">
            <a routerLink="/contacto" class="btn btn-primary btn-lg">Solicitar cotización <app-icon name="arrow-right" [size]="18" class="icon-shift" /></a>
            <a routerLink="/que-necesito" class="btn btn-secondary btn-lg">¿Qué necesito?</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .band { display: grid; gap: var(--s-5); align-items: end; padding-top: var(--s-6); border-top: 1px solid var(--line-strong); }
    .copy { display: grid; gap: var(--s-3); max-width: 620px; }
    h2 { font-size: var(--fs-h2); }
    p { color: var(--text-2); }
    .btns { display: flex; flex-wrap: wrap; gap: var(--s-2); }
    @media (min-width: 960px) { .band { grid-template-columns: 1fr auto; } }
  `,
})
export class CtaBand {
  readonly title = input('¿Tienes un proyecto en mente?');
  readonly text = input('Cuéntanos qué quieres lograr. Te ayudamos a definir el alcance y preparamos una propuesta a medida.');
}
