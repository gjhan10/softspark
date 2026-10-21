import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { findSolution } from '../../data/solutions.data';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-solution-preview',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[attr.data-family]': 'family()', '[class.wide]': 'wide()' },
  templateUrl: './solution-preview.html',
  styleUrl: './solution-preview.scss',
})
export class SolutionPreview {
  readonly slug = input.required<string>();
  readonly wide = input(false);
  protected readonly family = computed(() => findSolution(this.slug())?.family ?? 'web');
  protected readonly stock = [
    { pct: 82, s: 'ok' },
    { pct: 24, s: 'low' },
    { pct: 64, s: 'ok' },
    { pct: 6, s: 'out' },
    { pct: 48, s: 'ok' },
  ];
  protected readonly board = [3, 2, 2].map((n) => Array.from({ length: n }, (_, i) => i));
  protected readonly funnel = [
    { pct: 100, label: 'Prospectos' },
    { pct: 76, label: 'Contactados' },
    { pct: 52, label: 'Propuesta' },
    { pct: 30, label: 'Ganadas' },
  ];
}
