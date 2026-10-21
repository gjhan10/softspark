import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const PATHS = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  x: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9M12 3c-2.5 2.6-3.8 5.6-3.8 9s1.3 6.4 3.8 9',
  store: 'M3.5 9 5 4h14l1.5 5M3.5 9h17M3.5 9a2.8 2.8 0 0 0 5.6 0 2.9 2.9 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0M5 11.5V20h14v-8.5M10 20v-5h4v5',
  window: 'M3.5 5h17v14h-17zM3.5 9h17M6.5 7h.01M9 7h.01',
  building: 'M4 21V5l8-2v18M12 8h8v13M3 21h18M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2',
  workflow: 'M4 4h6v6H4zM14 14h6v6h-6zM7 10v4a3 3 0 0 0 3 3h4M17 14v-4a3 3 0 0 0-3-3h-4',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.2a6.5 6.5 0 0 1 3.5 5.8',
  box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
  trending: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  kanban: 'M4 4h4.5v16H4zM10 4h4.5v10H10zM16 4h4v7h-4z',
  grid: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  mail: 'M3.5 6h17v12h-17zM4 6.5l8 6.5 8-6.5',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5.5M12 7.5h.01',
  alert: 'M12 3.5 21.5 20h-19zM12 10v4.5M12 17.2h.01',
  refresh: 'M20 11a8 8 0 0 0-14.8-3.5M4 4v4h4M4 13a8 8 0 0 0 14.8 3.5M20 20v-4h-4',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  shield: 'M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z',
  plug: 'M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5V12l3 2',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z',
  play: 'M7 5l12 7-12 7z',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01M11 7h5M11 17h5',
  link: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  template: `<svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path [attr.d]="d()" /></svg>`,
  styles: `:host { display: inline-flex; flex: none; line-height: 0; } svg { display: block; }`,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  protected readonly d = computed(() => PATHS[this.name()]);
}
