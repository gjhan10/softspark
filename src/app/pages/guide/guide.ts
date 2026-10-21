import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Seo } from '../../core/seo.service';
import { SCENARIOS, SOFTWARE_TYPES } from '../../data/software-types.data';
import { Wizard } from '../../features/wizard/wizard';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-guide',
  imports: [Icon, Wizard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class Guide {
  protected readonly types = SOFTWARE_TYPES;
  protected readonly scenarios = SCENARIOS;

  constructor() {
    inject(Seo).set({
      title: '¿Qué necesito?',
      description: 'Diferencias entre una página estática, una web corporativa, una aplicación web, un CRM, un ERP y un sistema a medida, con ejemplos y un asistente para elegir.',
      path: 'que-necesito',
    });
  }

  protected typeName(id: string): string {
    return SOFTWARE_TYPES.find((t) => t.id === id)?.name ?? '';
  }

  protected toWizard(event: Event): void {
    const el = document.getElementById('asistente');
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `${location.pathname}#asistente`);
  }
}
