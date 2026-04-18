import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  
  selectedPlan: 'free' | 'pro' | null = null;
  whatsappNumberUrl = `https://wa.me/573003323781?text=`;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['premium'] === 'true') {
        this.messageService.add({
          severity: 'info',
          summary: 'Acceso Premium',
          detail: 'Para acceder a plantillas premium debe subir de suscripción mensual',
          life: 5000
        });
      }
    });
  }

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
