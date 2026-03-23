import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { TemplateDefinitionService } from '../core/services/template-definition.service';
import { TemplateDefinition } from '../core/models/template-definition.model';
import { TemplateDefinitionCardComponent } from '../shared/components/template-definition-card/template-definition-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TemplateDefinitionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Placeholder for future template data
  userTemplates: any[] = [];
  availableTemplates: TemplateDefinition[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private templateDefinitionService: TemplateDefinitionService
  ) {}

  ngOnInit(): void {
    this.templateDefinitionService.getAll().subscribe({
      next: (templates) => {
        this.availableTemplates = templates;
      },
      error: (error) => {
        console.error('Error al cargar plantillas:', error);
      }
    });
  }

  onTemplateAction(template: TemplateDefinition): void {
    if (template.type === 'EXCEL' || template.type === 'PDF') {
      window.open(template.resourceUrl!, '_blank');
    } else {
      this.router.navigate(['/plantillas', template.id]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
