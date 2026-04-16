import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {
  private router = inject(Router);
  selectedPlan: 'free' | 'pro' | null = null;
  whatsappNumberUrl = `https://wa.me/573000000000?text=`;

  selectPlan(plan: 'free' | 'pro' | null) {
    if (plan === 'free') {
      this.router.navigate(['/home']);
      return;
    }
    this.selectedPlan = plan;
    // Scroll to top when the view switches to ensure correct placement
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getWhatsappLink() {
    let msg = '';
    if (this.selectedPlan === 'pro') {
      msg = 'Hola, quiero activar el plan Taller Unipersonal ya realicé el pago.';
    } else {
      msg = 'Hola, me gustaría activar mi cuenta gratuita en Confex.';
    }
    return this.whatsappNumberUrl + encodeURIComponent(msg);
  }
}
