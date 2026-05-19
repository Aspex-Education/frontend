import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template } from '../../../core/models/template.model';

export type UserTemplateActionType = 'view' | 'edit' | 'delete';

export interface UserTemplateAction {
  action: UserTemplateActionType;
  template: Template;
}

@Component({
  selector: 'app-user-template-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-template-card.component.html',
  styleUrls: ['./user-template-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTemplateCardComponent {
  @Input() template!: Template;
  @Output() cardAction = new EventEmitter<UserTemplateAction>();

  getAccentColor(type: string): string {
    const colors: Record<string, string> = {
      'LISTADO_OPERACIONES': '#003f87',
      'SAM': '#725400',
      'EXCEL': '#217346',
      'PDF': '#DC2626',
      'WORD': '#2B579A',
    };
    return colors[type] || '#003f87';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'LISTADO_OPERACIONES': 'Listado de Operaciones',
      'SAM': 'SAM',
      'EXCEL': 'Excel',
      'PDF': 'PDF',
      'WORD': 'Word',
    };
    return labels[type] || type;
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'LISTADO_OPERACIONES': 'pi-list',
      'SAM': 'pi-chart-bar',
      'EXCEL': 'pi-file-excel',
      'PDF': 'pi-file-pdf',
      'WORD': 'pi-file-word',
    };
    return icons[type] || 'pi-file';
  }

  emit(action: UserTemplateActionType): void {
    this.cardAction.emit({ action, template: this.template });
  }
}
