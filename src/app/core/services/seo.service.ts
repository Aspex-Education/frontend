import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Inicializa el servicio para que escuche los cambios de ruta
   * y actualice automáticamente las etiquetas basándose en la propiedad 'data' de las rutas.
   */
  init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'] || 'Confex';
      const description = data['description'] || 'Plataforma para el sector textil y confección';
      const image = data['image'] || 'https://confex-dev.netlify.app/assets/company/og-tag-offer.jpg';
      const url = window.location.href;

      this.updateMetaTags({ title, description, image, url });
    });
  }

  /**
   * Permite actualizar manualmente las etiquetas (útil para páginas con contenido dinámico como una oferta específica)
   */
  updateMetaTags(config: { title?: string, description?: string, image?: string, url?: string }) {
    if (config.title) {
      this.titleService.setTitle(config.title);
      this.metaService.updateTag({ property: 'og:title', content: config.title });
      this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    }
    
    if (config.description) {
      this.metaService.updateTag({ name: 'description', content: config.description });
      this.metaService.updateTag({ property: 'og:description', content: config.description });
      this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    }
    
    if (config.image) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
      this.metaService.updateTag({ name: 'twitter:image', content: config.image });
    }
    
    if (config.url) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
    }
  }
}
