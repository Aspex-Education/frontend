import { InjectionToken } from '@angular/core';

export interface AnalyticsTracker {
  trackEvent(name: string, params?: Record<string, any>): void;
}

export const ANALYTICS_TRACKER = new InjectionToken<AnalyticsTracker>('AnalyticsTracker');
