export interface OfferLaboral {
  id: string;
  titulo: string;
  descripcion: string;
  pais: string;
  ciudad: string;
  barrio: string;
  telefonoFijo: string;
  whatsapp: string;
  activa: boolean;
  destacada: boolean;
  fechaCreacion?: any;
}

export interface OfferLaboralInput {
  titulo: string;
  descripcion: string;
  pais: string;
  ciudad: string;
  barrio: string;
  telefonoFijo: string;
  whatsapp: string;
  activa: boolean;
  destacada: boolean;
}
