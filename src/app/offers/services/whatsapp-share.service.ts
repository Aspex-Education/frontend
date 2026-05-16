import { Injectable } from '@angular/core';
import { OfferLaboral } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class WhatsappShareService {
  shareOffer(offer: OfferLaboral, baseUrl: string): void {
    const offerUrl = `${baseUrl}/oferta/${offer.id}`;
    const message = `*Oferta de Trabajo o busqueda de Satélite* \n\n${offer.titulo}\n ${offer.descripcion}\n*Ubicación* : ${offer.barrio}, ${offer.ciudad} - ${offer.pais}\n\nAplica aquí o mira más detalles: ${offerUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
