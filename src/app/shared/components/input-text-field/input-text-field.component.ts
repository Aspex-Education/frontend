import {
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule],
  templateUrl: './input-text-field.component.html',
  styleUrls: ['./input-text-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextFieldComponent),
      multi: true,
    },
  ],
})
export class InputTextFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() icon: string = '';
  @Input() control: AbstractControl | null = null;
  @Input() inputId: string = `input-${Math.random().toString(36).slice(2, 9)}`;

  value: string = '';
  isDisabled: boolean = false;
  isTouched: boolean = false;

  private cdr = inject(ChangeDetectorRef);

  private onChange: (val: string) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(val: string): void {
    this.value = val ?? '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouched();
      this.cdr.markForCheck();
    }
  }

  get hasError(): boolean {
    const ctrl = this.control;
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  get errorMessage(): string {
    if (!this.control?.errors) return '';
    const errors = this.control.errors;

    if (errors['required']) return 'Este campo es requerido.';
    if (errors['email']) return 'Ingrese un correo electrónico válido.';
    if (errors['minlength'])
      return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength'])
      return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['pattern']) return 'Formato no válido.';
    return 'Campo inválido.';
  }
}
