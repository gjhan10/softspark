import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Hace aparecer el elemento cuando entra en pantalla.
 * El estilo vive en styles.scss (.reveal / .in) y solo oculta el contenido si
 * `html.motion-ok` está presente, de modo que sin JavaScript o con movimiento
 * reducido todo se ve desde el principio.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[style.--i]': 'revealIndex()' },
})
export class Reveal {
  /** Posición dentro de un grupo, para escalonar la aparición. */
  readonly revealIndex = input(0, { alias: 'appReveal', transform: (v: number | string | undefined) => Number(v) || 0 });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('in');
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              el.classList.add('in');
              io.disconnect();
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
