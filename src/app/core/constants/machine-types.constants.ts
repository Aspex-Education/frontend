import { MachineType } from '../models/template.model';

export interface MachineOption {
  value: MachineType;
  label: string;
}

export const MACHINE_OPTIONS: MachineOption[] = [
  { value: 'plana', label: 'Plana' },
  { value: 'collarin', label: 'Collarín' },
  { value: 'triple-transporte', label: 'Triple transporte' },
  { value: 'fileteadora', label: 'Fileteadora' },
  { value: 'dos-agujas', label: 'Dos agujas' },
  { value: 'de-poste', label: 'De poste' },
  { value: 'plana-mecatronica', label: 'Plana mecatrónica' },
  { value: 'fileteadora-mecatronica', label: 'Fileteadora mecatrónica' },
  { value: 'collarin-mecatronica', label: 'Collarín mecatrónico' },
  { value: 'plana-electronica', label: 'Plana electrónica' },
  { value: 'fileteadora-electronica', label: 'Fileteadora electrónica' },
  { value: 'collarin-electronica', label: 'Collarín electrónico' },
  { value: 'ribeteadora', label: 'Ribeteadora' },
  { value: 'presilladora', label: 'Presilladora' },
  { value: 'cerradora', label: 'Cerradora' },
  { value: 'empretinadora', label: 'Empretinadora' },
  { value: 'botonadora', label: 'Botonadora' },
  { value: 'estampadora', label: 'Bordadora / Estampadora' },
  { value: 'maquina-20u', label: 'Máquina 20U' },
  { value: 'zig-zag', label: 'Zig-zag' },
  { value: 'multi-agujas', label: 'Multi agujas' },
  { value: 'preparacion', label: 'Preparación' },
  { value: 'manual-mesa', label: 'Manual mesa' },
  { value: 'plancha-vapor', label: 'Plancha vapor' },
  { value: 'calidad-empaque', label: 'Calidad / Empaque' },
  { value: 'other', label: 'Otra...' },
];

export const MACHINE_LABELS: Record<string, string> = MACHINE_OPTIONS.reduce((acc, curr) => {
  acc[curr.value] = curr.label;
  return acc;
}, {} as Record<string, string>);
