import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/services/auth.service';
import { TemplateDefinitionService } from '../core/services/template-definition.service';
import { TemplateService } from '../core/services/template.service';
import { TemplateDefinition } from '../core/models/template-definition.model';
import { Template } from '../core/models/template.model';
import { TemplateDefinitionCardComponent } from '../shared/components/template-definition-card/template-definition-card.component';
import { UserTemplateCardComponent, UserTemplateAction } from '../shared/components/user-template-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TemplateDefinitionCardComponent, UserTemplateCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  userTemplates: Template[] = [];
  availableTemplates: TemplateDefinition[] = [];

  private readonly USER_TEMPLATES_LIMIT = 4;

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
  }

  private loadAvailableTemplates(): void {
    this.templateDefinitionService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (templates) => this.availableTemplates = templates,
      error: (error) => console.error('Error al cargar plantillas:', error)
    });
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

  onUserTemplateAction(event: UserTemplateAction): void {
    const { action, template } = event;
    if (action === 'view' || action === 'edit') {
      this.router.navigate(['/templates', template.id]);
    }
    if (action === 'delete') {
      console.warn('Delete not yet implemented for:', template.id);
    }
  }

  onViewAllUserTemplates(): void {
    // TODO: navigate to full user templates list when route is available
    console.info('Ver todas las plantillas — ruta pendiente de implementación');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
