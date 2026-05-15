import { InjectionToken } from '@angular/core';
import { OffersRepository } from './offers-repository';

export const OFFERS_REPOSITORY = new InjectionToken<OffersRepository>('OffersRepository');
