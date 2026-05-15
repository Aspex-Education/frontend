export interface OfferLaboral {
  id: string;
  titulo: string;
  descripcion: string;
  ciudad: string;
  telefono: string;
  whatsapp: string;
  activa: boolean;
  destacada: boolean;
  fechaCreacion?: any;
}

export interface OfferLaboralInput {
  titulo: string;
  descripcion: string;
  ciudad: string;
  telefono: string;
  whatsapp: string;
  activa: boolean;
  destacada: boolean;
}
