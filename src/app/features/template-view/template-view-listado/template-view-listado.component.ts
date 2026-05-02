import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template, ListadoOperacionesPayload, parsePayload } from '../../../core/models/template.model';
import { MachineLabelPipe } from '../../../shared/pipes/machine-label.pipe';

@Component({
  selector: 'app-template-view-listado',
  standalone: true,
  imports: [CommonModule, MachineLabelPipe],
  templateUrl: './template-view-listado.component.html',
  styles: [`
    .form-group h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .section-title { font-size: 1.25rem; font-weight: 600; margin: 32px 0 16px; color: #333; }
    .table-wrapper { overflow-x: auto; }
    .view-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .view-table th { background: #f3f4f6; padding: 10px 8px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #d1d5db; }
    .view-table td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; color: #333; }
    .text-center { text-align: center; }
    .totals-section { background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: right; font-size: 1rem; }
  `]
})
export class TemplateViewListadoComponent implements OnInit {
  @Input({ required: true }) template!: Template;
  @Input() isSingleViewMode = false;
  
  parsedPayload: ListadoOperacionesPayload | null = null;

  ngOnInit(): void {
    if (this.template?.jsonPayload) {
      this.parsedPayload = parsePayload(this.template.jsonPayload);
    }
  }

  getTotalMinutes(): number {
    if (!this.parsedPayload) return 0;
    return Math.round((this.parsedPayload.total_time_seconds / 60) * 100) / 100;
  }
}
