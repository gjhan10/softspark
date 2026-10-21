import { RenderMode, ServerRoute } from '@angular/ssr';
import { SOLUTIONS } from './data/solutions.data';
import { DEMO_MODULES } from './features/demo/demo-modules';

export const serverRoutes: ServerRoute[] = [
  { path: 'soluciones/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: async () => SOLUTIONS.map((s) => ({ slug: s.slug })) },
  { path: 'demo/:modulo', renderMode: RenderMode.Prerender, getPrerenderParams: async () => DEMO_MODULES.map((m) => ({ modulo: m.id })) },
  { path: '**', renderMode: RenderMode.Prerender },
];
