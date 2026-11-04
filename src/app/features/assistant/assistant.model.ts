import type { PlanId } from '../../data/plans.data';
import type { ProjectType } from '../../data/project-types';

/** Respuesta de Spark Assistant, igual venga de las reglas o de una IA futura. */
export interface AssistantReply {
  /** true si se identificó al menos una necesidad concreta. */
  understood: boolean;
  intro: string;
  solution?: { name: string; slug: string; why: string };
  modules: string[];
  integrations: string[];
  /** Información que conviene tener para cotizar. */
  toQuote: string[];
  projectType: ProjectType;
  plan: PlanId;
  /** Palabras del mensaje que activaron la sugerencia (transparencia del modo por reglas). */
  matched: string[];
}

export type AssistantMode = 'reglas' | 'ia';

export interface AssistantProvider {
  readonly mode: AssistantMode;
  reply(message: string): Promise<AssistantReply>;
}
