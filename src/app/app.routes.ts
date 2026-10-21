import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'servicios', loadComponent: () => import('./pages/services/services').then((m) => m.Services) },
  { path: 'soluciones', loadComponent: () => import('./pages/solutions/solutions').then((m) => m.Solutions) },
  { path: 'soluciones/:slug', loadComponent: () => import('./pages/solution-detail/solution-detail').then((m) => m.SolutionDetail) },
  { path: 'planes', loadComponent: () => import('./pages/plans/plans').then((m) => m.Plans) },
  { path: 'proceso', loadComponent: () => import('./pages/process/process').then((m) => m.Process) },
  { path: 'preguntas-frecuentes', loadComponent: () => import('./pages/faq/faq').then((m) => m.FaqPage) },
  { path: 'que-necesito', loadComponent: () => import('./pages/guide/guide').then((m) => m.Guide) },
  { path: 'contacto', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: 'privacidad', loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy) },
  { path: 'demo', pathMatch: 'full', redirectTo: 'demo/panel' },
  { path: 'demo/:modulo', loadComponent: () => import('./features/demo/demo-shell').then((m) => m.DemoShell) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
