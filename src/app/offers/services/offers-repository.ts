import { OfferLaboral, OfferLaboralInput } from '../models/offer.model';

export interface OffersRepository {
  getOfferById(id: string): Promise<OfferLaboral | null>;
  listActiveOffersByCity(city: string, excludeId: string, limit: number): Promise<OfferLaboral[]>;
  listOffers(): Promise<OfferLaboral[]>;
  createOffer(offer: OfferLaboralInput): Promise<string>;
  updateOffer(id: string, offer: OfferLaboralInput): Promise<void>;
  deleteOffer(id: string): Promise<void>;
  setOfferActive(id: string, active: boolean): Promise<void>;
}
