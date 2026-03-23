import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateDefinitionService } from '../../core/services/template-definition.service';
import { TemplateDefinition } from '../../core/models/template-definition.model';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
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
  ) {}

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

  getVideoUrl(type: string): string {
    const videos: Record<string, string> = {
      'LISTADO_OPERACIONES': 'https://www.youtube.com/embed/VIDEO_ID_1',
      'EXCEL': 'https://www.youtube.com/embed/VIDEO_ID_2',
      'PDF': 'https://www.youtube.com/embed/VIDEO_ID_3',
      'SAM': ''
    };
    return videos[type] || '';
  }

  onAction(): void {
    if (!this.template) return;

    if (this.template.type === 'EXCEL' || this.template.type === 'PDF') {
      window.open(this.template.resourceUrl!, '_blank');
    } else {
      this.router.navigate(['/templates/create']);
    }
  }

  onViewGuides(): void {
    this.router.navigate(['/templates', this.template!.type.toLowerCase(), 'guide']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
