import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <span class="eyebrow">Legal</span>
        <h1>Aviso de privacidad</h1>
        <p class="lead">Qué datos se usan en este sitio, para qué y cómo ejercer tus derechos.</p>
      </div>
    </header>

    <article class="container prose">
      <div class="notice" data-tone="warn">
        <app-icon name="info" />
        <p>Este aviso es una versión básica que debe revisarse y ajustarse a la normativa aplicable ({{ site.jurisdiction }}: Ley N.º 29733, de Protección de Datos Personales, y su reglamento) antes de recopilar datos a través de un receptor de formularios.</p>
      </div>

      <h2>Responsable</h2>
      <p>{{ site.name }}@if (site.email) {, contacto: <a [href]="'mailto:' + site.email">{{ site.email }}</a>}.</p>

      <h2>Datos del formulario de cotización</h2>
      <p>El formulario solicita nombre, correo electrónico, empresa (opcional), tipo de proyecto, plan, descripción de la necesidad, presupuesto aproximado (opcional) y plazo estimado. Se usan únicamente para responder a tu solicitud y preparar una propuesta.</p>
      <p>En la versión actual del sitio, el formulario <strong>no envía tus datos a ningún servidor</strong>: prepara un mensaje que tú decides enviar desde tu aplicación de correo. Los datos llegan a {{ site.name }} solo cuando envías ese correo.</p>

      <h2>Asistente y demostraciones</h2>
      <p>El asistente «Encuentra la solución adecuada» y las demostraciones funcionan por completo en tu navegador. Sus respuestas y cambios no se envían a ningún sitio y se pierden al cerrar o recargar la página.</p>

      <h2>Almacenamiento local y servicios de terceros</h2>
      <ul>
        <li>Se guarda en tu navegador la preferencia de tema claro u oscuro (almacenamiento local). No contiene datos personales.</li>
        <li>Las tipografías se cargan desde Google Fonts, por lo que tu navegador se conecta a servidores de Google al visitar el sitio.</li>
        <li>El sitio está alojado en GitHub Pages, que puede registrar datos técnicos de acceso como la dirección IP.</li>
        <li>No se usan cookies propias ni herramientas de analítica en esta versión.</li>
      </ul>

      <h2>Tus derechos</h2>
      <p>Puedes solicitar el acceso, la rectificación, la cancelación u oposición al uso de tus datos escribiendo al contacto indicado arriba.</p>

      <h2>Cambios</h2>
      <p>Si en el futuro se conecta un receptor de formularios, una herramienta de analítica u otro servicio, este aviso se actualizará antes de recopilar datos con ellos.</p>

      <p class="back"><a routerLink="/contacto" class="link"><app-icon name="arrow-left" [size]="16" /> Volver al formulario</a></p>
    </article>
  `,
  styles: `
    .prose { max-width: 780px; padding-block: var(--s-7) var(--s-9); display: grid; gap: var(--s-4); }
    .prose h2 { font-size: var(--fs-lg); margin-top: var(--s-4); }
    .prose p, .prose li { color: var(--text-2); }
    .prose ul { padding-left: var(--s-5); display: grid; gap: var(--s-2); }
    .prose a { color: var(--accent); }
    .back { margin-top: var(--s-4); }
  `,
})
export class Privacy {
  protected readonly site = SITE;

  constructor() {
    inject(Seo).set({
      title: 'Aviso de privacidad',
      description: 'Aviso de privacidad de SoftSpark: datos del formulario de cotización, almacenamiento local y servicios de terceros.',
      path: 'privacidad',
    });
  }
}
