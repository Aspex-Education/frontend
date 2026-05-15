import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OFFERS_REPOSITORY } from '../../services/offers-repository.token';
import { OffersRepository } from '../../services/offers-repository';
import { ANALYTICS_TRACKER, AnalyticsTracker } from '../../services/offers-analytics';
import { OfferLaboral } from '../../models/offer.model';
import { OfertaNoDisponibleComponent } from '../oferta-no-disponible/oferta-no-disponible.component';
import { OfertaRelacionadaCardComponent } from '../oferta-relacionada-card/oferta-relacionada-card.component';

@Component({
  selector: 'app-oferta-publica',
  standalone: true,
  imports: [CommonModule, RouterModule, OfertaNoDisponibleComponent, OfertaRelacionadaCardComponent],
  templateUrl: './oferta-publica.component.html',
  styleUrls: ['./oferta-publica.component.css']
})
export class OfertaPublicaComponent implements OnInit {
  offer: OfferLaboral | null = null;
  relatedOffers: OfferLaboral[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(OFFERS_REPOSITORY) private offersRepository: OffersRepository,
    @Inject(ANALYTICS_TRACKER) private analyticsTracker: AnalyticsTracker
  ) {}

  ngOnInit(): void {
    this.loadOffer();
  }

  private async loadOffer(): Promise<void> {
    const offerId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!offerId) {
      this.offer = null;
      this.isLoading = false;
      return;
    }

    const offer = await this.offersRepository.getOfferById(offerId);
    if (!offer || !offer.activa) {
      this.offer = null;
      this.isLoading = false;
      return;
    }

    this.offer = offer;
    this.analyticsTracker.trackEvent('oferta_vista', {
      oferta_id: offer.id,
      ciudad: offer.ciudad,
      titulo: offer.titulo
    });

    this.relatedOffers = await this.offersRepository.listActiveOffersByCity(offer.ciudad, offer.id, 5);
    this.isLoading = false;
  }

  openWhatsapp(): void {
    if (!this.offer?.whatsapp) {
      return;
    }

    this.analyticsTracker.trackEvent('clic_whatsapp', {
      oferta_id: this.offer.id,
      ciudad: this.offer.ciudad,
      titulo: this.offer.titulo
    });
    window.open(`https://wa.me/${this.offer.whatsapp}`, '_blank');
  }

  makePhoneCall(): void {
    if (!this.offer?.telefono) {
      return;
    }

    this.analyticsTracker.trackEvent('clic_llamar', {
      oferta_id: this.offer.id,
      ciudad: this.offer.ciudad,
      titulo: this.offer.titulo
    });
    window.location.href = `tel:${this.offer.telefono}`;
  }

  viewRelatedOffer(offer: OfferLaboral): void {
    this.analyticsTracker.trackEvent('clic_oferta_relacionada', {
      oferta_id: offer.id,
      ciudad: offer.ciudad,
      titulo: offer.titulo
    });
    this.router.navigate(['/oferta', offer.id]);
  }
}
