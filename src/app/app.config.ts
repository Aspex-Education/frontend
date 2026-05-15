import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { initializeApp } from 'firebase/app';
import { environmentFirebase } from '../environments/environment.firebase';

import { routes } from './app.routes';
import { AuthInterceptor } from './auth/services/auth.interceptor';
import { AnalyticsService } from './core/services/analytics.service';
import { OFFERS_REPOSITORY } from './offers/services/offers-repository.token';
import { FirebaseOffersRepository } from './offers/services/firebase-offers.repository';
import { ANALYTICS_TRACKER } from './offers/services/offers-analytics';

const app = initializeApp(environmentFirebase.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: OFFERS_REPOSITORY, useClass: FirebaseOffersRepository },
    { provide: ANALYTICS_TRACKER, useExisting: AnalyticsService },
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    MessageService
  ]
};
