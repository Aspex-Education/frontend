import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="promo-card">
      <span class="promo-tag">{{ tag }}</span>
      <h4 class="promo-title">{{ title }}</h4>
      <div class="promo-img-wrap">
        <img [src]="imageUrl" [alt]="imgAlt" class="promo-img" />
      </div>
      <p class="promo-desc">{{ description }}</p>
      <a [href]="linkUrl" class="promo-link" target="_blank" rel="noopener noreferrer">
        {{ linkText }} <i class="pi pi-arrow-right"></i>
      </a>
    </div>
  `,
  styles: [`
    .promo-card {
      background-color: #ffffff;
      border: 1px solid #e1e3e8;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .promo-tag {
      font-size: 0.6875rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #003f87;
      background-color: #f0f7ff;
      padding: 0.25rem 0.625rem;
      border-radius: 2rem;
      align-self: flex-start;
      margin-bottom: 0.75rem;
    }
    .promo-title {
      font-family: 'Manrope', sans-serif;
      font-size: 1.25rem;
      font-weight: 800;
      color: #1a1c1d;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
    }
    .promo-img-wrap {
      width: 100%;
      height: 180px;
      border-radius: 0.75rem;
      overflow: hidden;
      margin-bottom: 1rem;
    }
    .promo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .promo-img:hover {
      transform: scale(1.05);
    }
    .promo-desc {
      color: #424752;
      font-size: 0.9375rem;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
      flex: 1;
    }
    .promo-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 700;
      color: #003f87;
      text-decoration: none;
      transition: color 0.2s;
    }
    .promo-link:hover {
      color: #0056b3;
      text-decoration: underline;
    }
  `]
})
export class PromoCardComponent {
  @Input() tag: string = 'Noticias';
  @Input() title: string = 'Evento';
  @Input() imageUrl: string = 'https://files.visitbogota.co/sites/default/files/styles/max_650x650/public/2025-07/horizontal%20CREATEX_1.jpg?itok=3XbT3YL5';
  @Input() imgAlt: string = 'Guía de tejidos';
  @Input() description: string = 'Createx 2026 muestra cómo opera hoy la cadena textil en Colombia';
  @Input() linkUrl: string = 'https://www.saloncreatex.com/';
  @Input() linkText: string = 'Obten información';
}
