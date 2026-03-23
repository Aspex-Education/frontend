import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateService } from '../../core/services/template.service';
import { Template, ListadoOperacionesPayload, parsePayload } from '../../core/models/template.model';

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.css'
})
export class TemplateViewComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  templates: Template[] = [];
  selectedTemplate: Template | null = null;
  parsedPayload: ListadoOperacionesPayload | null = null;
  isLoading = true;
  isEmpty = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    
    if (!type) {
      this.isLoading = false;
      this.isEmpty = true;
      return;
    }

    // Convert to uppercase for the request
    const typeUpperCase = type.toUpperCase();

    this.templateService.getPublicByType(typeUpperCase).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (templates) => {
        this.templates = templates;
        this.isLoading = false;
        this.isEmpty = templates.length === 0;
      },
      error: (error) => {
        console.error('Error al cargar plantillas:', error);
        this.isLoading = false;
        this.isEmpty = true;
      }
    });
  }

  onSelectTemplate(template: Template): void {
    this.selectedTemplate = template;
    this.parsedPayload = parsePayload(template.jsonPayload);
  }

  getMachineLabel(machine: string): string {
    const labels: Record<string, string> = {
      'plana': 'Plana',
      'collarin': 'Collarín',
      'triple-transporte': 'Triple transporte',
      'fileteadora': 'Fileteadora',
      'dos-agujas': 'Dos agujas',
      'de-poste': 'De poste',
      'plana-mecatronica': 'Plana mecatrónica',
      'fileteadora-mecatronica': 'Fileteadora mecatrónica',
      'collarin-mecatronica': 'Collarín mecatrónico',
      'plana-electronica': 'Plana electrónica',
      'fileteadora-electronica': 'Fileteadora electrónica',
      'collarin-electronica': 'Collarín electrónico',
      'ribeteadora': 'Ribeteadora',
      'presilladora': 'Presilladora',
      'cerradora': 'Cerradora',
      'empretinadora': 'Empretinadora',
      'botonadora': 'Botonadora',
      'estampadora': 'Bordadora / Estampadora',
      'maquina-20u': 'Máquina 20U',
      'zig-zag': 'Zig-zag',
      'multi-agujas': 'Multi agujas'
    };
    return labels[machine] || machine;
  }

  getTotalMinutes(): number {
    if (!this.parsedPayload) return 0;
    return Math.round((this.parsedPayload.total_time_seconds / 60) * 100) / 100;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
