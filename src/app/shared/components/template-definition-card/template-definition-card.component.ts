import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateDefinition } from '../../../core/models/template-definition.model';

@Component({
  selector: 'app-template-definition-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-definition-card.component.html',
  styleUrl: './template-definition-card.component.css'
})
export class TemplateDefinitionCardComponent {
  @Input() template!: TemplateDefinition;
  @Output() cardAction = new EventEmitter<TemplateDefinition>();

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'LISTADO_OPERACIONES': '📋',
      'SAM': '📊',
      'EXCEL': '📊', // Will be styled with CSS
      'PDF': '📄'   // Will be styled with CSS
    };
    return icons[type] || '📄';
  }

  getAccentColor(type: string): string {
    const colors: Record<string, string> = {
      'LISTADO_OPERACIONES': '#2563EB',
      'SAM': '#7C3AED',
      'EXCEL': '#217346',
      'PDF': '#DC2626'
    };
    return colors[type] || '#2563EB';
  }

  getButtonText(): string {
    if (this.template.type === 'EXCEL' || this.template.type === 'PDF') {
      return 'Descargar';
    }
    return 'Explorar';
  }

  onButtonClick(): void {
    this.cardAction.emit(this.template);
  }
}
