import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TemplateDefinition,
  TemplateType,
  TemplateCategory,
  TEMPLATE_CATEGORY_LABELS,
} from '../../../core/models/template-definition.model';

interface TypeConfig {
  label: string;
  colorClass: string;
  piIcon: string;
  borderColor: string;
}

const TYPE_CONFIG: Record<TemplateType, TypeConfig> = {
  PDF:                  { label: 'PDF',      colorClass: 'badge--pdf',     piIcon: 'pi-file-pdf',   borderColor: '#dc2626' },
  EXCEL:                { label: 'Excel',    colorClass: 'badge--excel',   piIcon: 'pi-file-excel', borderColor: '#16a34a' },
  LISTADO_OPERACIONES:  { label: 'Plantilla',colorClass: 'badge--default', piIcon: 'pi-list',       borderColor: '#003f87' },
  SAM:                  { label: 'Plantilla',colorClass: 'badge--default', piIcon: 'pi-chart-bar',  borderColor: '#003f87' },
};

@Component({
  selector: 'app-template-definition-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-definition-card.component.html',
  styleUrls: ['./template-definition-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDefinitionCardComponent {
  @Input() template!: TemplateDefinition;
  @Output() cardAction = new EventEmitter<TemplateDefinition>();

  get typeConfig(): TypeConfig {
    return TYPE_CONFIG[this.template.type] ?? TYPE_CONFIG['LISTADO_OPERACIONES'];
  }

  get categoryLabel(): string | null {
    if (!this.template.category) return null;
    return TEMPLATE_CATEGORY_LABELS[this.template.category as TemplateCategory] ?? null;
  }

  onButtonClick(): void {
    this.cardAction.emit(this.template);
  }
}
