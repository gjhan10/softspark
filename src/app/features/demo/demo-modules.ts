import type { DemoModule } from '../../data/solutions.data';
import type { IconName } from '../../shared/icon/icon';

export const DEMO_MODULES: { id: DemoModule; label: string; icon: IconName; desc: string }[] = [
  { id: 'panel', label: 'Dashboard empresarial', icon: 'grid', desc: 'Indicadores, pedidos recientes y alertas.' },
  { id: 'crm', label: 'CRM comercial', icon: 'users', desc: 'Oportunidades por etapa con búsqueda y filtros.' },
  { id: 'inventario', label: 'Gestión de inventario', icon: 'box', desc: 'Productos, stock bajo y ajustes de stock.' },
  { id: 'analitica', label: 'Panel de análisis', icon: 'trending', desc: 'Tendencias por periodo y por canal.' },
  { id: 'proyectos', label: 'Gestión de proyectos', icon: 'kanban', desc: 'Tablero de tareas por estado y responsable.' },
];

export function isDemoModule(value: unknown): value is DemoModule {
  return DEMO_MODULES.some((m) => m.id === value);
}
