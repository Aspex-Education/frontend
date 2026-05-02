import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateService } from '../../core/services/template.service';
import { Template } from '../../core/models/template.model';
import { TemplateViewListadoComponent } from './template-view-listado/template-view-listado.component';
import { TemplateViewSamComponent } from './template-view-sam/template-view-sam.component';

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateViewListadoComponent, TemplateViewSamComponent],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.css'
})
export class TemplateViewComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  templates: Template[] = [];
  selectedTemplate: Template | null = null;
  isLoading = true;
  isEmpty = false;
  isSingleViewMode = false;
  templateType: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');

    if (id) {
      this.isSingleViewMode = true;
      this.templateService.getById(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (template) => {
          this.templateType = template.type.toLowerCase();
          this.selectedTemplate = template;
          this.isLoading = false;
          this.isEmpty = false;
        },
        error: (error) => {
          console.error('Error al cargar plantilla:', error);
          this.isLoading = false;
          this.isEmpty = true;
        }
      });
      return;
    }

    // Case 2: We are loading a dropdown of guides by type
    if (!type) {
      this.isLoading = false;
      this.isEmpty = true;
      return;
    }

    this.templateType = type.toLowerCase();
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

  onSelectTemplate(template: Template | null): void {
    this.selectedTemplate = template;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
