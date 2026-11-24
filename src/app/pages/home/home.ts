import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { findProject } from '../../data/projects.data';
import { SERVICES } from '../../data/services.data';
import { TECH_GROUPS } from '../../data/tech.data';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly tech = TECH_GROUPS;
  protected readonly demos = DEMO_MODULES;
  /** Tres demos grandes en la portada; el resto queda en la lista. */
  protected readonly featured = DEMO_MODULES.filter((m) => ['crm', 'erp', 'automatizacion'].includes(m.id));
  protected readonly caseStudy = findProject('apuntes-java-backend')!;

  /** Diferenciadores: describen la forma real de trabajo, no métricas que no se pueden verificar. */
  protected readonly reasons = [
    {
      title: 'Soluciones adaptadas a tu negocio',
      text: 'Partimos de cómo trabaja tu equipo hoy y diseñamos el software alrededor de eso.',
    },
    {
      title: 'Arquitectura que crece contigo',
      text: 'Una primera versión acotada y una base preparada para sumar módulos, usuarios e integraciones.',
    },
    {
      title: 'Código mantenible',
      text: 'Tipado, pruebas automatizadas, control de versiones y documentación de uso.',
    },
    {
      title: 'Diseño centrado en quien lo usa',
      text: 'Flujos y pantallas validados antes de programar, accesibles y pensados también para el móvil.',
    },
    {
      title: 'Integración con lo que ya usas',
      text: 'Conectamos el nuevo sistema con tus herramientas mediante APIs, sin duplicar datos ni tareas.',
    },
    {
      title: 'Acompañamiento técnico directo',
      text: 'Hablas con quien diseña y desarrolla tu proyecto, con avances que puedes probar.',
    },
  ];

  constructor() {
    const seo = inject(Seo);
    seo.set({
      title: 'Inicio',
      description:
        'SoftSpark diseña y desarrolla páginas web, aplicaciones, sistemas empresariales (ERP y CRM), APIs y automatizaciones a medida para negocios en Perú y otros países.',
      path: '',
    });
    seo.organization();
  }
}
