import { Injectable } from '@angular/core';
import { OfferLaboral } from '../models/offer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacebookShareService {
  private readonly shareBaseUrl = environment.apiTemplateUrl.replace('/api', '');
  private readonly ogImage = 'https://bdksktkxmfpfdlckwrih.supabase.co/storage/v1/object/public/aspex-resources/OG-Confex-offers.png';

  shareOffer(offer: OfferLaboral): void {
    const shareUrl = `${this.shareBaseUrl}/share/oferta?` +
      `titulo=${encodeURIComponent(offer.titulo)}&` +
      `descripcion=${encodeURIComponent(offer.descripcion)}&` +
      `id=${offer.id}&` +
      `imagen=${encodeURIComponent(this.ogImage)}`;

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  }
}
