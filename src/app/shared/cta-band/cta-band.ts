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
    .band {
      position: relative; overflow: hidden; display: grid; gap: var(--s-5); align-items: center;
      padding: clamp(28px, 5vw, 56px); border: 1px solid var(--line-strong); border-radius: var(--r-xl);
      background: radial-gradient(120% 140% at 100% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%), var(--surface);
    }
    .band::after { content: ''; position: absolute; inset: auto 0 0; height: 2px; background: var(--brand-gradient); opacity: 0.8; }
    .copy { display: grid; gap: var(--s-3); max-width: 620px; }
    h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); }
    p { color: var(--text-2); }
    .btns { display: flex; flex-wrap: wrap; gap: var(--s-2); }
    @media (min-width: 960px) { .band { grid-template-columns: 1fr auto; } }
  `,
})
export class CtaBand {
  readonly title = input('¿Tienes un proyecto en mente?');
  readonly text = input('Cuéntanos qué quieres lograr. Te ayudamos a definir el alcance y preparamos una propuesta a medida.');
}
