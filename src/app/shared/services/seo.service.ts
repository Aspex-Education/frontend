import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const DEFAULT_OG_IMAGE = 'https://bdksktkxmfpfdlckwrih.supabase.co/storage/v1/object/public/assets/confex-og.jpg';
export const BASE_URL = 'https://confex-dev.netlify.app';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  update(config: SeoConfig): void {
    const title = config.title;
    const description = config.description;
    const ogTitle = config.ogTitle || title;
    const ogDescription = config.ogDescription || description;
    const ogImage = config.ogImage || DEFAULT_OG_IMAGE;
    const ogUrl = config.ogUrl || BASE_URL;

    // Update browser title
    this.titleService.setTitle(title);

    // Update standard meta description
    this.metaService.updateTag({ name: 'description', content: description });

    // Update OpenGraph meta tags
    this.metaService.updateTag({ property: 'og:title', content: ogTitle });
    this.metaService.updateTag({ property: 'og:description', content: ogDescription });
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({ property: 'og:url', content: ogUrl });

    // Update Twitter meta tags
    this.metaService.updateTag({ name: 'twitter:title', content: ogTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: ogDescription });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImage });
  }

  reset(): void {
    this.update({
      title: 'Confex — Ofertas laborales confección Colombia',
      description: 'Encuentra trabajo en talleres de confección en Colombia.',
      ogImage: DEFAULT_OG_IMAGE,
      ogUrl: BASE_URL
    });
  }
}
