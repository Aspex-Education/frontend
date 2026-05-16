import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OFFERS_REPOSITORY } from '../../services/offers-repository.token';
import { OffersRepository } from '../../services/offers-repository';
import { AdminAuthService } from '../../services/admin-auth.service';
import { WhatsappShareService } from '../../services/whatsapp-share.service';
import { FacebookShareService } from '../../services/facebook-share.service';
import { OfferLaboral } from '../../models/offer.model';

@Component({
  selector: 'app-admin-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-ofertas.component.html',
  styleUrls: ['./admin-ofertas.component.css']
})
export class AdminOfertasComponent implements OnInit {
  loginPassword = '';
  errorMessage = '';
  offers: OfferLaboral[] = [];
  isAuthenticated = false;
  isLoading = false;

  constructor(
    @Inject(OFFERS_REPOSITORY) private offersRepository: OffersRepository,
    private authService: AdminAuthService,
    private whatsappShare: WhatsappShareService,
    private facebookShare: FacebookShareService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadOffers();
    }
  }

  async login(): Promise<void> {
    this.errorMessage = '';
    if (!this.authService.login(this.loginPassword)) {
      this.errorMessage = 'Contraseña incorrecta. Intenta de nuevo.';
      return;
    }

    this.isAuthenticated = true;
    this.loginPassword = '';
    await this.loadOffers();
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.offers = [];
  }

  async loadOffers(): Promise<void> {
    this.isLoading = true;
    this.offers = await this.offersRepository.listOffers();
    this.isLoading = false;
  }

  async toggleActive(offer: OfferLaboral): Promise<void> {
    await this.offersRepository.setOfferActive(offer.id, !offer.activa);
    offer.activa = !offer.activa;
  }

  async deleteOffer(offer: OfferLaboral): Promise<void> {
    const confirmed = window.confirm(`¿Eliminar oferta "${offer.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmed) {
      return;
    }

    await this.offersRepository.deleteOffer(offer.id);
    this.offers = this.offers.filter((item) => item.id !== offer.id);
  }

  getDateLabel(offer: OfferLaboral): string {
    if (!offer.fechaCreacion) {
      return '-';
    }

    if (typeof offer.fechaCreacion === 'object' && 'toDate' in offer.fechaCreacion) {
      return offer.fechaCreacion.toDate().toLocaleDateString();
    }

    return new Date(offer.fechaCreacion).toLocaleDateString();
  }

  shareOnWhatsapp(offer: OfferLaboral): void {
    const baseUrl = window.location.origin;
    this.whatsappShare.shareOffer(offer, baseUrl);
  }

  shareOnFacebook(offer: OfferLaboral): void {
    this.facebookShare.shareOffer(offer);
  }
}
