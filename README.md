# SoftSpark

Sitio comercial de SoftSpark, empresa de desarrollo, comercialización y personalización de software: páginas web, aplicaciones, sistemas empresariales (ERP, CRM), dashboards, automatización y software a medida.

Es un sitio **estático** (Angular con prerender) publicado en GitHub Pages. No tiene backend: el asistente, la demo y el formulario funcionan en el navegador, y el formulario está preparado para conectarse a un receptor real cuando exista.

## Stack

- Angular 21 (componentes standalone, signals, control flow, prerender estático)
- TypeScript 5.9 y SCSS con tokens CSS (tema oscuro y claro)
- Vitest para pruebas unitarias
- GitHub Actions + GitHub Pages para el despliegue

No hay dependencias de UI externas: los iconos y los gráficos son SVG propios.

## Requisitos

- Node.js 20.19 o superior (el workflow usa Node 24, ver `.nvmrc`)
- npm 10 o superior

## Comandos

```bash
npm ci            # instala dependencias desde el lockfile
npm start         # servidor de desarrollo en http://localhost:4200
npm test          # pruebas unitarias (Vitest)
npm run build     # build de producción + 404.html, sitemap.xml y robots.txt
```

El resultado queda en `dist/softspark/browser`. En producción la app usa `baseHref: /softspark/`, por lo que para probar el build localmente hay que servirlo bajo esa ruta.

## Estructura

```
src/app/
  core/          configuración del sitio (site.config.ts), SEO y tema
  data/          contenido comercial: servicios, soluciones, planes, FAQ, proceso, tipos de software
  layout/        header, footer, navegación y selector de tema
  shared/        componentes reutilizables (iconos, tarjetas, migas de pan, avisos)
  features/
    wizard/      asistente «Encuentra la solución adecuada» (lógica en recommend.ts)
    quote/       formulario de cotización y servicio de envío desacoplado
    demo/        demo interactiva con datos sintéticos (dashboard, CRM, inventario, analítica, proyectos)
    hero-visual/ composición ilustrativa del inicio
  pages/         una carpeta por ruta
public/          favicon, imagen Open Graph y logotipo
scripts/         post-build.mjs (404.html, sitemap.xml, robots.txt)
```

## Personalización

Todo el contenido comercial está en `src/app/data/` y se reutiliza en todas las páginas, sin duplicarlo:

| Qué cambiar | Archivo |
| --- | --- |
| Servicios (las 6 capacidades) | `data/services.data.ts` |
| Catálogo de soluciones y categorías | `data/solutions.data.ts` |
| Planes, tabla comparativa y condiciones | `data/plans.data.ts` |
| Preguntas frecuentes | `data/faq.data.ts` |
| Proceso de trabajo | `data/process.data.ts` |
| Tipos de software y ejemplos | `data/software-types.data.ts` |
| Tipos de proyecto del formulario | `data/project-types.ts` |
| Preguntas y lógica del asistente | `features/wizard/wizard.data.ts`, `features/wizard/recommend.ts` |

### Precios

Los planes muestran «Cotización según alcance» o «Precio personalizado». Para publicar precios aprobados, edita `PRICING` en `src/app/core/site.config.ts`:

```ts
export const PRICING = {
  currency: 'PEN',
  showAmounts: true,
  amounts: { standard: 1500, pro: null, premium: null, enterprise: null },
};
```

Con `showAmounts: true`, cada plan que tenga importe se muestra como «Desde S/ 1500»; los que tengan `null` mantienen su etiqueta. Hay una prueba que falla si se muestran importes sin activarlos.

### URLs, correo y contacto

Todo está centralizado en `SITE` (`src/app/core/site.config.ts`):

- `siteUrl`: URL pública del sitio. Se usa para los canonical, Open Graph, el sitemap y robots.txt.
- `blogUrl`: URL del blog personal.
- `email`: correo comercial. Si es `null`, se ocultan los enlaces de correo y el formulario solo permite copiar el mensaje.
- `whatsapp` y `social`: se muestran en el footer solo si tienen valor.
- `quoteEndpoint`: receptor del formulario (ver más abajo).

Hoy `email` usa el correo público del fundador como contacto provisional. Cámbialo cuando exista un correo comercial propio.

## Formulario de cotización

GitHub Pages solo sirve archivos: no recibe formularios ni envía correos. Por eso el formulario funciona en dos modos:

1. **Local** (actual, `quoteEndpoint: null`). Valida los datos, muestra un resumen y prepara el mensaje. El usuario lo envía desde su correo (`mailto:`) o lo copia. La interfaz indica claramente que la solicitud **todavía no ha sido enviada**.
2. **Remoto** (`quoteEndpoint: 'https://…'`). Envía la solicitud como JSON por `POST` y muestra «Solicitud recibida» **solo** si el servidor responde 2xx. Si falla, muestra el error y ofrece reintentar o enviarla por correo.

Para conectar un receptor:

- Usa un proveedor de formularios con endpoint público pensado para sitios estáticos, o una API propia (por ejemplo, una función serverless que valide los datos y envíe el correo).
- El endpoint debe aceptar `POST` con `Content-Type: application/json` y permitir CORS desde el dominio del sitio.
- **No pongas claves privadas ni tokens en el frontend**: todo lo que está en `site.config.ts` es público. Si el proveedor necesita una clave secreta, debe usarse en el servidor, nunca en este repositorio.
- Actualiza el aviso de privacidad (`pages/privacy/privacy.ts`) antes de empezar a recibir datos.

El contrato está en `features/quote/quote.model.ts` (`QuoteRequest`) y el envío en `features/quote/quote.service.ts`.

## Publicación con GitHub Actions

El workflow `.github/workflows/deploy.yml` se ejecuta en cada push a `main` y también de forma manual (`workflow_dispatch`):

1. Instala dependencias con `npm ci` usando el lockfile.
2. Ejecuta las pruebas (`npm test`).
3. Compila (`npm run build`).
4. Sube `dist/softspark/browser` como artefacto de Pages y lo despliega con las acciones oficiales.

Si falla cualquier paso, el despliegue no se hace y el error se ve en la pestaña **Actions** del repositorio.

### Activar GitHub Pages

1. Crea el repositorio `softspark` en GitHub y sube este proyecto a la rama `main`.
2. En el repositorio, ve a **Settings → Pages**.
3. En **Build and deployment → Source**, elige **GitHub Actions**.
4. Haz un push a `main` (o ejecuta el workflow a mano desde **Actions**).
5. El sitio quedará en `https://<usuario>.github.io/softspark/`.

Si el repositorio tiene otro nombre, cambia `baseHref` en `angular.json` y `siteUrl` en `site.config.ts`. Con un dominio propio, `baseHref` debe ser `/`.

## Rutas en GitHub Pages

Todas las rutas se prerenderizan como `ruta/index.html`, así que una recarga directa (por ejemplo `/softspark/planes/`) carga la página real con su contenido y metadatos. GitHub Pages redirige `/planes` a `/planes/`; conviene usar la barra final en los enlaces externos que lleven parámetros (por ejemplo `/softspark/contacto/?plan=pro`). Para cualquier ruta desconocida, `404.html` carga la aplicación y muestra la página 404.

## Limitaciones del hosting estático

Según la documentación de GitHub Pages:

- El sitio publicado no puede superar 1 GB y tiene un límite flexible de 100 GB de transferencia al mes.
- Los despliegues expiran a los 10 minutos.
- No ejecuta código de servidor, bases de datos ni procesos en segundo plano.
- No está pensado para operar un negocio en línea, una tienda ni un SaaS comercial. Un sitio de presentación de la empresa encaja; vender o cobrar desde aquí no.

Además:

- `robots.txt` solo lo leen los buscadores en la raíz del dominio. En `usuario.github.io/softspark/` el archivo generado no se aplica: envía el sitemap a Google Search Console o usa un dominio propio.
- Las tipografías se cargan desde Google Fonts.

## Qué requiere backend

| Función | Estado actual | Para producción |
| --- | --- | --- |
| Formulario de cotización | Prepara el mensaje para enviarlo por correo | Endpoint o proveedor de formularios |
| Demo interactiva | Datos sintéticos en memoria | Cada sistema real necesita su propio backend |
| Usuarios, roles, inicio de sesión | No existe | Servicio de autenticación y base de datos |
| Pagos | No existe | Pasarela de pago y backend |
| Analítica | No existe | Proveedor de analítica y aviso de privacidad actualizado |

## Incorporar un backend en el futuro

1. Crea una API separada (por ejemplo, Spring Boot o funciones serverless) con su propio hosting.
2. Conecta el formulario configurando `quoteEndpoint`.
3. Para nuevas funciones, crea servicios en `src/app/core/` que llamen a la API con `HttpClient` (`provideHttpClient()` en `app.config.ts`).
4. La autenticación debe resolverse en el servidor (cookies seguras o tokens de corta duración). Nunca guardes contraseñas ni secretos en el navegador.
5. Si el sitio pasa a necesitar renderizado en servidor, cambia `outputMode` a `server` en `angular.json` y despliega en un hosting que ejecute Node.js.
