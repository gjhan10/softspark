import { Injectable, InjectionToken, inject } from '@angular/core';
import { SITE } from '../../core/site.config';
import { QuoteRequest, SendResult } from './quote.model';

export const QUOTE_ENDPOINT = new InjectionToken<string | null>('QUOTE_ENDPOINT', {
  providedIn: 'root',
  factory: () => SITE.quoteEndpoint,
});

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly endpoint = inject(QUOTE_ENDPOINT);
  private inFlight = false;

  get mode(): 'remote' | 'local' {
    return this.endpoint ? 'remote' : 'local';
  }

  async send(request: QuoteRequest, timeoutMs = 15000): Promise<SendResult> {
    if (!this.endpoint) throw new Error('No hay un receptor configurado para las solicitudes.');
    if (this.inFlight) return { ok: false, reason: 'network', message: 'Ya hay un envío en curso.' };
    this.inFlight = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      if (res.ok) return { ok: true };
      return { ok: false, reason: 'server', message: `El servidor respondió con el código ${res.status}.` };
    } catch (e) {
      if ((e as Error).name === 'AbortError') return { ok: false, reason: 'timeout', message: 'El servidor tardó demasiado en responder.' };
      return { ok: false, reason: 'network', message: 'No se pudo conectar con el servidor. Revisa tu conexión.' };
    } finally {
      clearTimeout(timer);
      this.inFlight = false;
    }
  }
}
