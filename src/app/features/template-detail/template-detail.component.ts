import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateDefinitionService } from '../../core/services/template-definition.service';
import { TemplateDefinition } from '../../core/models/template-definition.model';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, ActionButtonComponent],
  templateUrl: './template-detail.component.html',
  styleUrl: './template-detail.component.css'
})
export class TemplateDetailComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  template: TemplateDefinition | null = null;
  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateDefinitionService: TemplateDefinitionService
  ) { }

  private authService = inject(AuthService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.notFound = true;
      this.isLoading = false;
      return;
    }

    this.templateDefinitionService.getById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (template) => {
        this.template = template;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar plantilla:', error);
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'LISTADO_OPERACIONES': '📋',
      'SAM': '📊',
      'EXCEL': '📊',
      'PDF': '📄'
    };
    return icons[type] || '📄';
  }

  getAccentColor(type: string): string {
    const colors: Record<string, string> = {
      'LISTADO_OPERACIONES': '#2563EB',
      'SAM': '#7C3AED',
      'EXCEL': '#217346',
      'PDF': '#DC2626'
    };
    return colors[type] || '#2563EB';
  }

  getAccentGradient(type: string): string {
    const gradients: Record<string, string> = {
      'LISTADO_OPERACIONES': 'linear-gradient(135deg, #003f87, #0056b3)',
      'SAM': 'linear-gradient(135deg, #5b21b6, #7c3aed)',
      'EXCEL': 'linear-gradient(135deg, #14532d, #166534)',
      'PDF': 'linear-gradient(135deg, #991b1b, #dc2626)'
    };
    return gradients[type] || 'linear-gradient(135deg, #003f87, #0056b3)';
  }

  getEmbedUrl(url: string | null): string {
    if (!url) return '';
    // Si ya es un embed, dejarlo como está
    if (url.includes('/embed/')) return url;
    
    // Extraer ID de youtube (de v= o de youtu.be/)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url; // Fallback si no es de youtube o no se pudo parsear
  }

  async onAction(): Promise<void> {
    if (!this.template) return;
    if (this.template.accessLevel === 'PREMIUM' && !(await this.authService.hasPremiumAccess())) {
      this.router.navigate(['/plans'], { queryParams: { premium: 'true' } });
      return;
    }

    if (this.template.type === 'EXCEL' || this.template.type === 'PDF') {
      if (this.template.resourceUrl) {
        window.open(this.template.resourceUrl, '_blank');
      }
    } else {
      const type = this.template.type.toLowerCase();
      this.router.navigate(['/templates', type, 'create']);
    }
  }

  async onViewGuides(): Promise<void> {
    if (!this.template) return;

    if (this.template.accessLevel === 'PREMIUM' && !(await this.authService.hasPremiumAccess())) {
      this.router.navigate(['/plans'], { queryParams: { premium: 'true' } });
      return;
    }

    this.router.navigate(['/templates', this.template!.type.toLowerCase(), 'guide']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
