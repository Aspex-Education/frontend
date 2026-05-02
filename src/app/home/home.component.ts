import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/services/auth.service';
import { TemplateDefinitionService } from '../core/services/template-definition.service';
import { TemplateService } from '../core/services/template.service';
import { TemplateDefinition, TemplateCategory, TEMPLATE_CATEGORY_LABELS } from '../core/models/template-definition.model';
import { Template } from '../core/models/template.model';
import { TemplateDefinitionCardComponent } from '../shared/components/template-definition-card/template-definition-card.component';
import { UserTemplateCardComponent, UserTemplateAction } from '../shared/components/user-template-card';
import { TemplateRowComponent } from '../shared/components/template-row/template-row.component';
import { ConfirmModalComponent } from '../shared/components/confirm-modal/confirm-modal.component';
import { PromoCardComponent } from '../shared/components/promo-card/promo-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, UserTemplateCardComponent, ConfirmModalComponent, PromoCardComponent, TemplateRowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  userTemplates: Template[] = [];
  availableTemplates: TemplateDefinition[] = [];
  groupedTemplates: { category: TemplateCategory; label: string; templates: TemplateDefinition[] }[] = [];

  // Delete modal state
  isDeleteModalVisible = false;
  isDeletingTemplate = false;
  templateToDelete: Template | null = null;

  private readonly USER_TEMPLATES_LIMIT = 2;

  get visibleUserTemplates(): Template[] {
    return this.userTemplates.slice(0, this.USER_TEMPLATES_LIMIT);
  }

  get hasMoreUserTemplates(): boolean {
    return this.userTemplates.length > this.USER_TEMPLATES_LIMIT;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private templateDefinitionService: TemplateDefinitionService,
    private templateService: TemplateService
  ) { }

  ngOnInit(): void {
    this.loadAvailableTemplates();
    this.loadUserTemplates();
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.getUserProfile().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private loadAvailableTemplates(): void {
    this.templateDefinitionService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (templates) => {
        this.availableTemplates = templates;
        this.groupTemplates(templates);
      },
      error: (error) => console.error('Error al cargar plantillas:', error)
    });
  }

  private groupTemplates(templates: TemplateDefinition[]): void {
    const categoriesOrder: TemplateCategory[] = [
      'BUSSINESS_DATASHEET',
      'TECHNICAL_DATASHEET',
      'TIPS',
      'PATTERN',
      'LEGAL'
    ];

    this.groupedTemplates = categoriesOrder
      .map(cat => ({
        category: cat,
        label: TEMPLATE_CATEGORY_LABELS[cat],
        templates: templates.filter(t => t.category === cat)
      }))
      .filter(group => group.templates.length > 0);
  }

  private loadUserTemplates(): void {
    const userId = this.authService.currentUserId();

    if (userId) {
      this.templateService.getByUserId(userId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (templates) => this.userTemplates = templates,
        error: (error) => console.error('Error al cargar plantillas del usuario:', error)
      });
    }
  }

  onTemplateAction(template: TemplateDefinition): void {
    this.router.navigate(['/templatesDefinition', template.id]);
  }

  // Note: access control for premium templates is handled in the template detail view

  onUserTemplateAction(event: UserTemplateAction): void {
    const { action, template } = event;
    if (action === 'view' || action === 'edit') {
      this.router.navigate(['/templates', template.id, action]); // Generará /templates/:id/view o /templates/:id/edit
    }
    if (action === 'delete') {
      this.templateToDelete = template;
      this.isDeleteModalVisible = true;
    }
  }

  confirmDeleteTemplate(): void {
    if (!this.templateToDelete) return;

    this.isDeletingTemplate = true;
    this.templateService.softDelete(this.templateToDelete.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        // Filtrar y remover de la vista localmente
        this.userTemplates = this.userTemplates.filter(t => t.id !== this.templateToDelete!.id);
        this.isDeletingTemplate = false;
        this.isDeleteModalVisible = false;
        this.templateToDelete = null;
      },
      error: (err) => {
        console.error('Error al realizar el soft-delete:', err);
        this.isDeletingTemplate = false;
      }
    });
  }

  cancelDeleteTemplate(): void {
    this.isDeleteModalVisible = false;
    this.templateToDelete = null;
  }

  onViewAllUserTemplates(): void {
    this.router.navigate(['/my-templates']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
