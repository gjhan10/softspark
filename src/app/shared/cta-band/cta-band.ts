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
            <a routerLink="/contacto" class="btn btn-brand btn-lg">Empezar un proyecto <app-icon name="arrow-right" [size]="18" class="icon-shift" /></a>
            <a routerLink="/que-necesito" class="btn btn-secondary btn-lg"><app-icon name="compass" [size]="18" /> Spark Assistant</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .band { position: relative; overflow: hidden; isolation: isolate; display: grid; gap: var(--s-5); align-items: center; padding: clamp(28px, 5vw, 56px); border: 1px solid var(--line); border-radius: var(--r-2xl); background: var(--surface); box-shadow: var(--shadow-2); }
    .band::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--mesh); }
    .copy { display: grid; gap: var(--s-3); max-width: 620px; }
    h2 { font-size: var(--fs-h2); letter-spacing: -0.035em; }
    p { color: var(--text-2); }
    .btns { display: flex; flex-wrap: wrap; gap: var(--s-2); }
    @media (min-width: 960px) { .band { grid-template-columns: 1fr auto; } }
  `,
})
export class CtaBand {
  readonly title = input('¿Tienes un proyecto en mente?');
  readonly text = input('Cuéntanos qué quieres lograr. Te ayudamos a definir el alcance y preparamos una propuesta a medida.');
}
