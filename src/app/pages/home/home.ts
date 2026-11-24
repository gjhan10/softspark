import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { findProject } from '../../data/projects.data';
import { SERVICES } from '../../data/services.data';
import { TECH_GROUPS } from '../../data/tech.data';
import { DEMO_MODULES } from '../../features/demo/demo-modules';
import { Icon, type IconName } from '../../shared/icon/icon';
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
  /** Bento: cada servicio con la captura real que mejor lo muestra. */
  private readonly shots: Record<string, string> = {
    'sistemas-empresariales': 'projects/lab-erp.webp',
    'web-comercial': 'projects/softspark-inicio-desktop.webp',
    'aplicaciones-web': 'projects/lab-proyectos.webp',
    automatizacion: 'projects/lab-automatizacion.webp',
    'web-esencial': 'projects/apuntes-leccion-desktop.webp',
    'software-a-medida': 'projects/lab-inventario.webp',
  };
  protected readonly bento = ['sistemas-empresariales', 'aplicaciones-web', 'automatizacion', 'web-comercial', 'web-esencial', 'software-a-medida']
    .map((id) => SERVICES.find((s) => s.id === id)!)
    .map((s) => ({ ...s, img: this.shots[s.id] }));
  protected readonly caseStudy = findProject('apuntes-java-backend')!;

  /** Diferenciadores: describen la forma real de trabajo, no métricas que no se pueden verificar. */
  protected readonly reasons = [
    {
      icon: 'layers' as IconName,
      title: 'Soluciones adaptadas a tu negocio',
      text: 'Partimos de cómo trabaja tu equipo hoy y diseñamos el software alrededor de eso.',
    },
    {
      icon: 'server' as IconName,
      title: 'Arquitectura que crece contigo',
      text: 'Una primera versión acotada y una base preparada para sumar módulos, usuarios e integraciones.',
    },
    {
      icon: 'code' as IconName,
      title: 'Código mantenible',
      text: 'Tipado, pruebas automatizadas, control de versiones y documentación de uso.',
    },
    {
      icon: 'compass' as IconName,
      title: 'Diseño centrado en quien lo usa',
      text: 'Flujos y pantallas validados antes de programar, accesibles y pensados también para el móvil.',
    },
    {
      icon: 'plug' as IconName,
      title: 'Integración con lo que ya usas',
      text: 'Conectamos el nuevo sistema con tus herramientas mediante APIs, sin duplicar datos ni tareas.',
    },
    {
      icon: 'users' as IconName,
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
