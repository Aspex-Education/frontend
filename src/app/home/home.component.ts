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

@Component({
  selector: 'app-home',
  imports: [CommonModule, TemplateDefinitionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  userTemplates: Template[] = [];
  availableTemplates: TemplateDefinition[] = [];

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
