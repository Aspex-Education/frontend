import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get hostClasses(): string {
    return [
      'action-btn',
      `action-btn--${this.variant}`,
      `action-btn--${this.size}`,
      this.fullWidth ? 'action-btn--full' : '',
      this.loading ? 'action-btn--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  onClick(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.clicked.emit(event);
    }
  }
}
