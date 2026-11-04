import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Seo } from '../../core/seo.service';
import { SCENARIOS, SOFTWARE_TYPES } from '../../data/software-types.data';
import { ASSISTANT_PROVIDER } from '../../features/assistant/assistant.provider';
import { SparkAssistant } from '../../features/assistant/spark-assistant';
import { Wizard } from '../../features/wizard/wizard';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-guide',
  imports: [Icon, Wizard, SparkAssistant],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class Guide {
  protected readonly types = SOFTWARE_TYPES;
  protected readonly scenarios = SCENARIOS;
  protected readonly localMode = inject(ASSISTANT_PROVIDER).mode === 'reglas';

  constructor() {
    inject(Seo).set({
      title: 'Spark Assistant: ¿qué software necesito?',
      description: 'Describe tu negocio y Spark Assistant te orienta sobre el tipo de software, los módulos y las integraciones. Incluye las diferencias entre web, aplicación, CRM, ERP y sistema a medida.',
      path: 'que-necesito',
    });
  }

  protected typeName(id: string): string {
    return SOFTWARE_TYPES.find((t) => t.id === id)?.name ?? '';
  }

  protected toWizard(event: Event): void {
    const el = document.getElementById('cuestionario');
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `${location.pathname}#cuestionario`);
  }
}
