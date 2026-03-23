import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateService } from '../../core/services/template.service';
import { OperationItem, ListadoOperacionesPayload, CreateTemplateRequest, MachineType } from '../../core/models/template.model';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Component({
  selector: 'app-template-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-create.component.html',
  styleUrl: './template-create.component.css'
})
export class TemplateCreateComponent implements CanComponentDeactivate {
  private destroyRef = inject(DestroyRef);

  // Form fields
  productName = '';
  description = '';

  // Operations table
  operations: OperationItem[] = [this.createEmptyOperation()];

  // UI state
  isSaving = false;
  saveSuccess = false;
  saveError = '';
  isDirty = false;

  // Machines list
  readonly machines: { value: MachineType; label: string }[] = [
    { value: 'plana', label: 'Plana' },
    { value: 'collarin', label: 'Collarín' },
    { value: 'triple-transporte', label: 'Triple transporte' },
    { value: 'fileteadora', label: 'Fileteadora' },
    { value: 'dos-agujas', label: 'Dos agujas' },
    { value: 'de-poste', label: 'De poste' },
    { value: 'plana-mecatronica', label: 'Plana mecatrónica' },
    { value: 'fileteadora-mecatronica', label: 'Fileteadora mecatrónica' },
    { value: 'collarin-mecatronica', label: 'Collarín mecatrónico' },
    { value: 'plana-electronica', label: 'Plana electrónica' },
    { value: 'fileteadora-electronica', label: 'Fileteadora electrónica' },
    { value: 'collarin-electronica', label: 'Collarín electrónico' },
    { value: 'ribeteadora', label: 'Ribeteadora' },
    { value: 'presilladora', label: 'Presilladora' },
    { value: 'cerradora', label: 'Cerradora' },
    { value: 'empretinadora', label: 'Empretinadora' },
    { value: 'botonadora', label: 'Botonadora' },
    { value: 'estampadora', label: 'Bordadora / Estampadora' },
    { value: 'maquina-20u', label: 'Máquina 20U' },
    { value: 'zig-zag', label: 'Zig-zag' },
    { value: 'multi-agujas', label: 'Multi agujas' },
    { value: 'other', label: 'Otra...' },
  ];

  constructor(
    private router: Router,
    private templateService: TemplateService
  ) {}

  createEmptyOperation(): OperationItem {
    return {
      order: (this.operations?.length ?? 0) + 1,
      description: '',
      machine: 'plana',
      machine_other: null,
      time_seconds: 0
    };
  }

  addOperation(): void {
    this.operations.push(this.createEmptyOperation());
    this.markDirty();
  }

  removeOperation(index: number): void {
    this.operations.splice(index, 1);
    // Recalcular orders
    this.operations.forEach((op, i) => op.order = i + 1);
    this.markDirty();
  }

  markDirty(): void {
    this.isDirty = true;
  }

  get totalSeconds(): number {
    return this.operations.reduce((sum, op) => sum + (op.time_seconds || 0), 0);
  }

  get totalMinutes(): number {
    return Math.round((this.totalSeconds / 60) * 100) / 100;
  }

  get isFormValid(): boolean {
    return this.productName.trim() !== '' &&
      this.operations.length > 0 &&
      this.operations.every(op => op.description.trim() !== '' && op.time_seconds > 0);
  }

  save(): void {
    if (!this.isFormValid) return;

    // Construir descripción por defecto si está vacía
    const finalDescription = this.description.trim() ||
      `Listado de operaciones para ${this.productName}`;

    // Recalcular orders antes de guardar
    const operations = this.operations.map((op, i) => ({ ...op, order: i + 1 }));

    // Construir payload
    const payload: ListadoOperacionesPayload = {
      product: this.productName.trim(),
      operations,
      total_time_seconds: this.totalSeconds
    };

    // Construir request
    const request: CreateTemplateRequest = {
      name: this.productName.trim(),
      description: finalDescription,
      type: 'LISTADO_OPERACIONES',
      userId: '00000000-0000-0000-0000-000000000001', // placeholder
      jsonPayload: JSON.stringify(payload)
    };

    this.isSaving = true;
    this.saveError = '';
    
    this.templateService.create(request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.isDirty = false;
      },
      error: (err) => {
        this.isSaving = false;
        this.saveError = 'Error al guardar. Intenta de nuevo.';
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  canDeactivate(): boolean {
    return !this.isDirty || this.saveSuccess;
  }
}
