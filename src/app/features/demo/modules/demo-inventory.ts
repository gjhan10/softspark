import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../shared/toast/toast';
import { money, Product } from '../demo-data';
import { DemoStore } from '../demo-store';

@Component({
  selector: 'app-demo-inventory',
  imports: [Icon, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-ui.scss',
  template: `
    <div class="mod-head">
      <div>
        <h2>Gestión de inventario</h2>
        <p>Productos de un almacén ficticio. Ajusta el stock o agrega productos.</p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" (click)="adding.set(!adding())" [attr.aria-expanded]="adding()" aria-controls="inv-add">
        <app-icon [name]="adding() ? 'x' : 'plus'" [size]="16" /> {{ adding() ? 'Cancelar' : 'Agregar producto' }}
      </button>
    </div>

    @if (adding()) {
      <form id="inv-add" class="add-form" [formGroup]="form" (ngSubmit)="add()" novalidate>
        <div class="fields">
          <div class="field">
            <label for="inv-name">Nombre</label>
            <input id="inv-name" class="input" formControlName="name" [attr.aria-invalid]="bad('name')" />
            @if (bad('name')) { <span class="error"><app-icon name="alert" [size]="14" /> Escribe al menos 3 caracteres.</span> }
          </div>
          <div class="field">
            <label for="inv-cat">Categoría</label>
            <select id="inv-cat" class="input" formControlName="category">
              @for (c of categories(); track c) { <option [value]="c">{{ c }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="inv-stock">Stock</label>
            <input id="inv-stock" class="input" type="number" min="0" formControlName="stock" [attr.aria-invalid]="bad('stock')" />
            @if (bad('stock')) { <span class="error"><app-icon name="alert" [size]="14" /> Número entero mayor o igual a 0.</span> }
          </div>
          <div class="field">
            <label for="inv-min">Mínimo</label>
            <input id="inv-min" class="input" type="number" min="0" formControlName="min" [attr.aria-invalid]="bad('min')" />
            @if (bad('min')) { <span class="error"><app-icon name="alert" [size]="14" /> Número entero mayor o igual a 0.</span> }
          </div>
          <div class="field">
            <label for="inv-price">Precio (S/)</label>
            <input id="inv-price" class="input" type="number" min="0" step="1" formControlName="price" [attr.aria-invalid]="bad('price')" />
            @if (bad('price')) { <span class="error"><app-icon name="alert" [size]="14" /> Precio mayor que 0.</span> }
          </div>
        </div>
        <div class="btns"><button type="submit" class="btn btn-primary btn-sm">Guardar en la demo</button></div>
      </form>
    }

    <div class="toolbar">
      <label class="search">
        <span class="sr-only">Buscar productos</span>
        <app-icon name="search" [size]="18" />
        <input class="input" type="search" placeholder="Buscar por nombre o SKU" [value]="query()" (input)="query.set($any($event.target).value)" />
      </label>
      <label class="sr-only" for="inv-filter">Categoría</label>
      <select id="inv-filter" class="input" [value]="category()" (change)="category.set($any($event.target).value)">
        <option value="">Todas las categorías</option>
        @for (c of categories(); track c) { <option [value]="c">{{ c }}</option> }
      </select>
      <label class="checkbox low">
        <input type="checkbox" [checked]="onlyLow()" (change)="onlyLow.set($any($event.target).checked)" />
        <span>Solo stock bajo ({{ store.lowStock().length }})</span>
      </label>
    </div>

    <p class="result-count" aria-live="polite">{{ rows().length }} {{ rows().length === 1 ? 'producto' : 'productos' }}</p>

    @if (rows().length) {
      <div class="table-wrap">
        <table class="responsive">
          <thead><tr><th scope="col">Producto</th><th scope="col">Categoría</th><th scope="col">Estado</th><th scope="col" class="num">Stock</th><th scope="col" class="num">Precio</th></tr></thead>
          <tbody>
            @for (p of rows(); track p.sku) {
              <tr>
                <td data-label="Producto" class="wide"><strong>{{ p.name }}</strong><br /><code class="muted">{{ p.sku }}</code></td>
                <td data-label="Categoría">{{ p.category }}</td>
                <td data-label="Estado"><span class="tag" [attr.data-tone]="state(p).tone">{{ state(p).label }}</span></td>
                <td data-label="Stock" class="num">
                  <span class="stock">
                    <button type="button" class="icon-btn" (click)="adjust(p, -1)" [disabled]="p.stock === 0" [attr.aria-label]="'Restar una unidad de ' + p.name"><app-icon name="minus" [size]="14" /></button>
                    <span class="qty">{{ p.stock }}</span>
                    <button type="button" class="icon-btn" (click)="adjust(p, 1)" [attr.aria-label]="'Sumar una unidad a ' + p.name"><app-icon name="plus" [size]="14" /></button>
                  </span>
                  <small class="muted">mín. {{ p.min }}</small>
                </td>
                <td data-label="Precio" class="num">{{ money(p.price) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <div class="empty">
        <app-icon name="box" [size]="28" />
        <strong>No hay productos con esos filtros</strong>
        <button type="button" class="btn btn-secondary btn-sm" (click)="clear()">Limpiar filtros</button>
      </div>
    }
  `,
  styles: `
    .muted { color: var(--text-3); font-size: 0.82rem; }
    .stock { display: inline-flex; align-items: center; gap: 8px; }
    .qty { min-width: 2.5ch; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
    td.num small { display: block; }
    .low { font-size: 0.9rem; align-items: center; }
  `,
})
export class DemoInventory {
  protected readonly store = inject(DemoStore);
  private readonly toast = inject(ToastService);
  protected readonly money = money;
  protected readonly query = signal('');
  protected readonly category = signal('');
  protected readonly onlyLow = signal(false);
  protected readonly adding = signal(false);
  protected readonly submitted = signal(false);
  protected readonly categories = computed(() => [...new Set(this.store.products().map((p) => p.category))].sort());

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    category: ['Accesorios'],
    stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    min: [5, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    price: [0, [Validators.required, Validators.min(1)]],
  });

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.store
      .products()
      .filter((p) => !this.category() || p.category === this.category())
      .filter((p) => !this.onlyLow() || p.stock <= p.min)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  });

  protected state(p: Product): { label: string; tone: string } {
    if (p.stock === 0) return { label: 'Sin stock', tone: 'danger' };
    if (p.stock <= p.min) return { label: 'Stock bajo', tone: 'warn' };
    return { label: 'Disponible', tone: 'ok' };
  }

  protected bad(name: 'name' | 'stock' | 'min' | 'price'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  protected adjust(p: Product, delta: number): void {
    this.store.adjustStock(p.sku, delta);
  }

  protected add(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const sku = this.store.addProduct({ name: v.name.trim(), category: v.category, stock: Number(v.stock), min: Number(v.min), price: Number(v.price) });
    this.toast.show(`Producto ${sku} agregado (solo en esta demo).`);
    this.form.reset();
    this.submitted.set(false);
    this.adding.set(false);
    this.clear();
  }

  protected clear(): void {
    this.query.set('');
    this.category.set('');
    this.onlyLow.set(false);
  }
}
