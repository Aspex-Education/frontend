import { Component, computed, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { PromoCardComponent } from '../../shared/components/promo-card/promo-card.component';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';

export interface LaborPrice {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  lastUpdate: string;
}

@Component({
  selector: 'app-price-engine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, HttpClientModule, RouterLink, PromoCardComponent, ActionButtonComponent],
  templateUrl: './price-engine.component.html',
  styleUrl: './price-engine.component.css'
})
export class PriceEngineComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  priceDatabase = signal<LaborPrice[]>([]);
  dropdownOpen = signal<boolean>(false);

  searchControl = new FormControl('');
  searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  // Filtrado
  filteredResults = computed(() => {
    const term = this.searchTerm()?.toLowerCase().trim() || '';
    const db = this.priceDatabase();
    if (!term) return db;
    return db.filter(item => item.name.toLowerCase().includes(term));
  });

  selectedItem = signal<LaborPrice | null>(null);

  ngOnInit() {
    this.http.get<LaborPrice[]>('assets/data/prices.json').subscribe({
      next: (data) => {
        this.priceDatabase.set(data);
        // Seleccionar el primero por defecto
        if (data.length > 0) {
          this.selectItem(data[0]);
        }
      },
      error: (err) => console.error('Error al cargar prices.json', err)
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen.update(v => !v);
  }

  selectItem(item: LaborPrice) {
    this.selectedItem.set(item);
    this.searchControl.setValue(item.name, { emitEvent: false });
    this.dropdownOpen.set(false);
  }



  // Cierra el dropdown si se hace click afuera
  @HostListener('document:click')
  closeDropdown() {
    if (this.dropdownOpen()) {
      this.dropdownOpen.set(false);
      // Restaurar el valor del input si había un elemento seleccionado
      const currentSelection = this.selectedItem();
      if (currentSelection) {
        this.searchControl.setValue(currentSelection.name, { emitEvent: false });
      }
    }
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
