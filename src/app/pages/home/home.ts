import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { TECH_GROUPS } from '../../data/tech.data';
import { HeroVisual } from '../../features/hero-visual/hero-visual';
import { Art, ArtName } from '../../shared/art/art';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, HeroVisual, Art, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly site = SITE;
  protected readonly tech = TECH_GROUPS;

  protected readonly building = [
    'Sitios corporativos',
    'Tiendas en línea',
    'Aplicaciones web',
    'ERP',
    'CRM',
    'Dashboards',
    'APIs REST',
    'Integraciones',
    'Automatización de procesos',
    'Software a medida',
  ];

  /** Diferenciadores: describen la forma real de trabajo, no métricas que no se pueden verificar. */
  protected readonly reasons: { art: ArtName; title: string; text: string }[] = [
    {
      art: 'adapt',
      title: 'Soluciones adaptadas a tu negocio',
      text: 'Partimos de cómo trabaja tu equipo hoy y diseñamos el software alrededor de eso, en lugar de obligarte a cambiar todo para encajar en una herramienta genérica.',
    },
    {
      art: 'architecture',
      title: 'Arquitectura que crece contigo',
      text: 'Empezamos por una primera versión acotada y dejamos la base preparada para sumar módulos, usuarios e integraciones.',
    },
    {
      art: 'code',
      title: 'Código mantenible',
      text: 'Tipado, pruebas automatizadas, control de versiones y documentación de uso, para que el sistema se pueda evolucionar sin miedo.',
    },
    {
      art: 'ux',
      title: 'Diseño centrado en quien lo usa',
      text: 'Flujos y pantallas validados antes de programar, accesibles y pensados también para el móvil.',
    },
    {
      art: 'api',
      title: 'Integración con lo que ya usas',
      text: 'Conectamos el nuevo sistema con tus herramientas mediante APIs, para no duplicar datos ni tareas.',
    },
    {
      art: 'support',
      title: 'Acompañamiento técnico directo',
      text: 'Hablas con quien diseña y desarrolla tu proyecto: avances que puedes probar y decisiones explicadas sin jerga.',
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
