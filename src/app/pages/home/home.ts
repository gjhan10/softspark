import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { FAQS } from '../../data/faq.data';
import { PLANS, planPrice } from '../../data/plans.data';
import { PROCESS } from '../../data/process.data';
import { SERVICES } from '../../data/services.data';
import { SCENARIOS } from '../../data/software-types.data';
import { findSolution, Solution, SOLUTION_CATEGORIES, SOLUTIONS } from '../../data/solutions.data';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { HeroVisual } from '../../features/hero-visual/hero-visual';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Icon } from '../../shared/icon/icon';
import { SolutionCard } from '../../shared/solution-card/solution-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, HeroVisual, SolutionCard, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly services = SERVICES;
  protected readonly categories = SOLUTION_CATEGORIES;
  protected readonly featured = ['sitio-corporativo', 'catalogo-digital', 'crm-comercial', 'erp-modular', 'panel-de-indicadores', 'automatizacion-de-procesos'].map((s) => findSolution(s)!) as Solution[];
  protected readonly total = SOLUTIONS.length;
  protected readonly plans = PLANS;
  protected readonly price = planPrice;
  protected readonly process = PROCESS.slice(0, 6);
  protected readonly faqs = FAQS.filter((f) => ['¿Por qué no hay precios publicados?', '¿El plan incluye hosting y dominio?', '¿Cuál es la diferencia entre un ERP y un CRM?', '¿Se puede empezar con algo pequeño y crecer después?'].includes(f.q));
  protected readonly scenarios = SCENARIOS.slice(0, 4);
  protected readonly demos = DEMO_MODULES;

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
