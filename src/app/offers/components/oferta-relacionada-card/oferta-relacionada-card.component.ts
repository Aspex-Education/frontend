import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferLaboral } from '../../models/offer.model';

@Component({
  selector: 'app-oferta-relacionada-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oferta-relacionada-card.component.html',
  styleUrls: ['./oferta-relacionada-card.component.css']
})
export class OfertaRelacionadaCardComponent {
  @Input() offer: OfferLaboral | null = null;
  @Output() selectOffer = new EventEmitter<OfferLaboral>();

  onView(): void {
    if (this.offer) {
      this.selectOffer.emit(this.offer);
    }
  }
}
