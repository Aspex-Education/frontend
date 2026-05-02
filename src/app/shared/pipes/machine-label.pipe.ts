import { Pipe, PipeTransform } from '@angular/core';
import { MachineType } from '../../core/models/template.model';
import { MACHINE_LABELS } from '../../core/constants/machine-types.constants';

@Pipe({
  name: 'machineLabel',
  standalone: true
})
export class MachineLabelPipe implements PipeTransform {
  transform(value: string | MachineType | null | undefined): string {
    if (!value) return '';
    return MACHINE_LABELS[value] || value;
  }
}
