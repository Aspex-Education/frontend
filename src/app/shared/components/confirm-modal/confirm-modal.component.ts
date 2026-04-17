import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ActionButtonComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmModalComponent {
  @Input() visible: boolean = false;
  @Input() header: string = 'Confirmar Acción';
  @Input() message: string = '¿Estás seguro de continuar?';
  @Input() confirmLabel: string = 'Confirmar';
  @Input() confirmVariant: 'primary' | 'danger' | 'secondary' = 'danger';
  @Input() width: string = '400px';
  @Input() loading: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  handleConfirm() {
    this.confirmed.emit();
  }

  handleCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancelled.emit();
  }

  onDialogVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
    if (!value) {
      this.cancelled.emit();
    }
  }
}
