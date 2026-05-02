import { Component, Input, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateService } from '../../../core/services/template.service';
import { SAMFullResponse, Template } from '../../../core/models/template.model';
import { MachineLabelPipe } from '../../../shared/pipes/machine-label.pipe';

@Component({
  selector: 'app-template-view-sam',
  standalone: true,
  imports: [CommonModule, MachineLabelPipe],
  templateUrl: './template-view-sam.component.html',
  styles: [`
    .sam-header { margin-top: 1rem; }
    .badge { background: #f1f5f9; color: #475569; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
    .machine-tag { background: #eff6ff; color: #2563eb; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
    .sam-totals { display: flex; justify-content: flex-end; align-items: baseline; gap: 1rem; border-right: 4px solid #2563eb; }
    .total-label { font-size: 0.875rem; font-weight: 600; color: #64748b; }
    .total-value { font-size: 1.5rem; font-weight: 700; color: #2563eb; }
    
    .section-title { font-size: 1.25rem; font-weight: 600; margin: 32px 0 16px; color: #333; }
    .table-wrapper { overflow-x: auto; }
    .view-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .view-table th { background: #f3f4f6; padding: 10px 8px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #d1d5db; }
    .view-table td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; color: #333; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .totals-section { background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: right; font-size: 1rem; }
  `]
})
export class TemplateViewSamComponent implements OnInit {
  @Input({ required: true }) template!: Template;
  
  private templateService = inject(TemplateService);
  private destroyRef = inject(DestroyRef);
  
  samData: SAMFullResponse | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadEnrichedData();
  }

  loadEnrichedData(): void {
    this.templateService.getSAMById(this.template.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        // Map snake_case to camelCase
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos SAM enriquecidos:', err);
        this.isLoading = false;
      }
    });
  }
}
