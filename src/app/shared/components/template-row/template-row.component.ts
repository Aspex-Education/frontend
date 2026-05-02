import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateDefinition } from '../../../core/models/template-definition.model';
import { TemplateDefinitionCardComponent } from '../template-definition-card/template-definition-card.component';

@Component({
  selector: 'app-template-row',
  standalone: true,
  imports: [CommonModule, TemplateDefinitionCardComponent],
  templateUrl: './template-row.component.html',
  styleUrls: ['./template-row.component.css']
})
export class TemplateRowComponent {
  @Input({ required: true }) title: string = '';
  @Input({ required: true }) templates: TemplateDefinition[] = [];
  @Output() templateAction = new EventEmitter<TemplateDefinition>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  onCardAction(template: TemplateDefinition) {
    this.templateAction.emit(template);
  }
}
