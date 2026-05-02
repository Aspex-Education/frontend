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
  UpdateTemplateRequest,
  CreateTemplateRequest,
  Template
} from '../../core/models/template.model';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes.guard';
import { AuthService } from '../../auth/services/auth.service';

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
  private authService = inject(AuthService);

  // Data state
  samData: SAMFullResponse | null = null;
  operations: SAMOperation[] = [];
  userListados: Template[] = [];

  // Form fields
  samName = '';
  sourceTemplateId = '';

  // UI state
  isLoading = false;
  isSaving = false;
  saveSuccess = false;
  saveError = '';
  isDirty = false;
  isEditMode = false;
  selectedBaseId = '';
  selectedBaseName = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSAMData(id);
    } else {
      this.isEditMode = false;
      this.loadUserListados();
    }
  }

  loadUserListados(): void {
    const userId = this.authService.currentUserId();
    if (!userId) return;

    this.isLoading = true;
    this.templateService.getByUserId(userId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (templates: Template[]) => {
        this.userListados = templates.filter(t => t.type === 'LISTADO_OPERACIONES');
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar listados:', err);
        this.isLoading = false;
      }
    });
  }

  onSelectBase(baseId: string): void {
    if (!baseId) {
      this.operations = [];
      this.sourceTemplateId = '';
      return;
    }

    this.isLoading = true;
    this.templateService.getById(baseId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (template: Template) => {
        this.sourceTemplateId = template.id;
        this.selectedBaseName = template.name;
        if (template.jsonPayload) {
          const payload = JSON.parse(template.jsonPayload);
          if (payload && payload.operations) {
            this.operations = payload.operations.map((op: any) => ({
              operationId: op.id || op.operation_id || op.order.toString(),
              order: op.order,
              description: op.description,
              machine: op.machine,
              timeSeconds: op.time_seconds,
              operatorRating: 100, // Valor por defecto
              supplement: 0.15,    // Valor por defecto (15%)
              samIndividual: 0
            }));
            this.markDirty();
          }
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el listado base:', err);
        this.isLoading = false;
        this.saveError = 'No se pudo cargar el listado base seleccionado.';
      }
    });
  }

  loadSAMData(id: string): void {
    this.isLoading = true;
    this.templateService.getSAMById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: any) => {
        this.samData = {
          id: response.id,
          name: response.name,
          sourceTemplateId: response.source_template_id,
          sourceTemplateName: response.source_template_name,
          totalSam: response.total_sam,
          operations: response.operations.map((op: any) => ({
            operationId: op.id || op.operation_id,
            order: op.order,
            description: op.description,
            machine: op.machine,
            timeSeconds: op.time_seconds,
            operatorRating: op.operator_rating,
            supplement: op.supplement,
            samIndividual: op.sam_individual
          }))
        };
        this.samName = this.samData.name;
        this.sourceTemplateId = this.samData.sourceTemplateId;
        this.operations = this.samData.operations;
        this.isLoading = false;
      },
      error: (err: any) => {
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
    if (!op.operatorRating) return 0;
    const ratingFactor = op.operatorRating / 100;
    const supplementFactor = 1 + (op.supplement || 0);
    const result = op.timeSeconds / ratingFactor * supplementFactor;
    return Math.round(result * 100) / 100;
  }

  get totalSAM(): number {
    return this.operations.reduce((sum, op) => sum + (this.calculateIndividualSAM(op) || 0), 0);
  }

  save(): void {
    if (!this.samName.trim() || !this.sourceTemplateId) return;

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
      description: `Estudio técnico SAM basado en el listado operacional ${this.samData?.sourceTemplateName || this.selectedBaseName}`,
      type: 'SAM',
      jsonPayload: JSON.stringify(payload)
    };

    this.isSaving = true;
    this.saveError = '';

    const id = this.isEditMode && this.samData ? this.samData.id : null;
    const requestObservable = id
      ? this.templateService.update(id, request)
      : this.templateService.create(request);

    requestObservable.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.isDirty = false;
        this.router.navigate(['/my-templates']);
      },
      error: (err: any) => {
        this.isSaving = false;
        this.saveError = `Error al ${id ? 'actualizar' : 'crear'} el estudio SAM.`;
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-templates']);
  }
  goCreateSAM(): void {
    this.router.navigate(['/templates/sam/create']);
  }
  canDeactivate(): boolean {
    return !this.isDirty || this.saveSuccess;
  }
}
