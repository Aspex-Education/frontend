import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, Analytics, setUserId } from 'firebase/analytics';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
// @ts-ignore (ignoring in case config script has not run yet)
import { environmentFirebase } from '../../../environments/environment.firebase';

export enum AnalyticsEvent {
  // Autenticación
  SIGN_UP_SUCCESS = 'sign_up_success',
  LOGIN_SUCCESS = 'login_success',
  
  // Navegación
  PAGE_VIEW = 'page_view',
  
  // Home
  CLICK_LISTADO_OPERACION = 'click_listado_operacion',
  
  // Landing
  LANDING_VIEW = 'landing_view',
  LANDING_INPUT_CHANGE = 'landing_input_change',
  
  // Listado Operación
  VIEW_LISTADO_OPERACION = 'view_listado_operacion',
  CLICK_YOUTUBE_VIDEO = 'click_youtube_video',
  CLICK_VER_PLANTILLAS_EJEMPLO = 'click_ver_plantillas_ejemplo',
  CLICK_CREAR_PLANTILLA = 'click_crear_plantilla',
  
  // Crear plantilla
  SAVE_TEMPLATE = 'save_template',
  EXPORT_TEMPLATE = 'export_template',
  
  // Otras plantillas
  PREVIEW_TEMPLATE = 'preview_template',
  DOWNLOAD_TEMPLATE = 'download_template',

  // Sugerencias de negocio
  FIRST_TIME_USER = 'first_time_user',
  RETURNING_USER = 'returning_user',
  TIME_IN_PAGE = 'time_in_page',
  DROP_OFF_CREAR_PLANTILLA = 'drop_off_crear_plantilla',
  CONVERSION_CREAR_PLANTILLA = 'conversion_crear_plantilla',
  CONVERSION_LANDING_TO_APP = 'conversion_landing_to_app'
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private analytics: Analytics | null = null;
  private isInitialized = false;

  constructor(private router: Router) {}

  initialize(): void {
    if (this.isInitialized) return;
    
    // Safety check to ensure environment is loaded
    if (!environmentFirebase || !environmentFirebase.firebase || !environmentFirebase.firebase.projectId || environmentFirebase.firebase.projectId === 'undefined') {
      console.warn('Firebase configuration missing. Analytics tracking is disabled.');
      return;
    }

    try {
      const app = getApps().length === 0 ? initializeApp(environmentFirebase.firebase) : getApps()[0];
      this.analytics = getAnalytics(app);
      this.isInitialized = true;
      this.setupRouterTracking();
      console.log('Firebase Analytics initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error);
    }
  }

  private setupRouterTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.trackEvent(AnalyticsEvent.PAGE_VIEW, {
        page_path: event.urlAfterRedirects
      });
    });
  }

  trackEvent(eventName: AnalyticsEvent | string, params?: Record<string, any>): void {
    if (!this.analytics) return;
    try {
      logEvent(this.analytics, eventName, params);
    } catch (error) {
      console.error(`Error logging event ${eventName}:`, error);
    }
  }
  
  setUserId(userId: string): void {
    if (!this.analytics) return;
    try {
      setUserId(this.analytics, userId);
    } catch (error) {
      console.error(`Error setting user ID:`, error);
    }
  }
}
