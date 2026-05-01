import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateService } from '../../core/services/template.service';
import { 
  SAMOperation, 
  SAMFullResponse, 
  SAMConfigItem, 
  SAMPayload, 
  UpdateTemplateRequest 
} from '../../core/models/template.model';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-template-create-sam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-create-sam.component.html',
  styleUrl: './template-create-sam.component.css'
})
export class TemplateCreateSamComponent implements OnInit, CanComponentDeactivate {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private templateService = inject(TemplateService);

  // Data state
  samData: SAMFullResponse | null = null;
  operations: SAMOperation[] = [];
  
  // Form fields
  samName = '';
  sourceTemplateId = '';

  // UI state
  isLoading = false;
  isSaving = false;
  saveSuccess = false;
  saveError = '';
  isDirty = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSAMData(id);
    } else {
      // Si no hay ID, redirigir ya que un SAM siempre debe venir de una base
      this.router.navigate(['/my-templates']);
    }
  }

  loadSAMData(id: string): void {
    this.isLoading = true;
    this.templateService.getSAMById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: SAMFullResponse) => {
        this.samData = response;
        this.samName = response.name;
        this.sourceTemplateId = response.sourceTemplateId;
        this.operations = response.operations;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el estudio SAM:', err);
        this.isLoading = false;
        this.saveError = 'No se pudo cargar el estudio SAM.';
      }
    });
  }

  markDirty(): void {
    this.isDirty = true;
  }

  calculateIndividualSAM(op: SAMOperation): number {
    // SAM = (Tiempo Basico * Calificación) + Suplementos
    // En realidad suele ser: Tiempo * (Calificación/100) * (1 + Suplemento)
    // Pero el backend ya nos da un valor, aquí lo recalculamos visualmente si cambia.
    const ratingFactor = (op.operatorRating || 0) / 100;
    const supplementFactor = 1 + (op.supplement || 0);
    const result = op.timeSeconds * ratingFactor * supplementFactor;
    return Math.round(result * 100) / 100;
  }

  get totalSAM(): number {
    return this.operations.reduce((sum, op) => sum + (this.calculateIndividualSAM(op) || 0), 0);
  }

  save(): void {
    if (!this.samName.trim() || !this.samData) return;

    const id = this.samData.id;

    // Construir la configuración simplificada para el backend
    const samConfig: SAMConfigItem[] = this.operations.map(op => ({
      operation_id: op.operationId,
      operator_rating: op.operatorRating,
      supplement: op.supplement
    }));

    const payload: SAMPayload = {
      source_template_id: this.sourceTemplateId,
      sam_config: samConfig
    };

    const request: UpdateTemplateRequest = {
      name: this.samName.trim(),
      type: 'SAM',
      jsonPayload: JSON.stringify(payload)
    };

    this.isSaving = true;
    this.saveError = '';

    this.templateService.update(id, request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.isDirty = false;
        this.router.navigate(['/my-templates']);
      },
      error: (err) => {
        this.isSaving = false;
        this.saveError = 'Error al actualizar el estudio SAM.';
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-templates']);
  }

  canDeactivate(): boolean {
    return !this.isDirty || this.saveSuccess;
  }
}
