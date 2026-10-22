import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { HeroVisual } from '../../features/hero-visual/hero-visual';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, HeroVisual],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor() {
    const seo = inject(Seo);
    seo.set({
      title: 'Inicio',
      description: 'SoftSpark desarrolla páginas web, aplicaciones, sistemas empresariales, ERP, CRM y automatizaciones a medida, desde pequeños negocios hasta empresas con procesos complejos.',
      path: '',
    });
    seo.organization();
  }
}
