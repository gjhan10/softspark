import { InjectionToken } from '@angular/core';
import { SITE } from '../../core/site.config';
import { AssistantProvider, AssistantReply } from './assistant.model';
import { ruleReply } from './rules';

/** Modo actual: reglas fijas en el navegador. No envía el texto a ningún servidor. */
export class RuleAssistant implements AssistantProvider {
  readonly mode = 'reglas' as const;

  async reply(message: string): Promise<AssistantReply> {
    return ruleReply(message);
  }
}

/**
 * Integración preparada para una IA servida por un backend propio. El backend
 * recibe { message } y devuelve un AssistantReply. Nunca se llama a un modelo
 * desde el navegador ni se guardan claves en el sitio.
 * Si el servicio falla, se responde con las reglas para no dejar al visitante sin respuesta.
 */
export class RemoteAssistant implements AssistantProvider {
  readonly mode = 'ia' as const;
  private readonly fallback = new RuleAssistant();

  constructor(private readonly endpoint: string) {}

  async reply(message: string): Promise<AssistantReply> {
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      return (await res.json()) as AssistantReply;
    } catch {
      return this.fallback.reply(message);
    }
  }
}

export const ASSISTANT_PROVIDER = new InjectionToken<AssistantProvider>('ASSISTANT_PROVIDER', {
  providedIn: 'root',
  factory: () => (SITE.assistantEndpoint ? new RemoteAssistant(SITE.assistantEndpoint) : new RuleAssistant()),
});
