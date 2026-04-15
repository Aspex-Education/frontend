import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/services/auth.service';
import { TemplateService } from '../../core/services/template.service';
import { Template } from '../../core/models/template.model';
import { UserTemplateCardComponent, UserTemplateAction } from '../../shared/components/user-template-card';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-templates',
  standalone: true,
  imports: [CommonModule, UserTemplateCardComponent, ConfirmModalComponent],
  templateUrl: './user-templates.component.html',
  styleUrl: './user-templates.component.css'
})
export class UserTemplatesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  
  userTemplates: Template[] = [];
  isLoading = true;

  // Delete modal state
  isDeleteModalVisible = false;
  isDeletingTemplate = false;
  templateToDelete: Template | null = null;

  constructor(
    private authService: AuthService,
    private templateService: TemplateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserTemplates();
  }

  private loadUserTemplates(): void {
    const userId = this.authService.currentUserId();
    if (userId) {
      this.templateService.getByUserId(userId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (templates) => {
          this.userTemplates = templates;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar plantillas del usuario:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  onUserTemplateAction(event: UserTemplateAction): void {
    const { action, template } = event;
    if (action === 'view' || action === 'edit') {
      this.router.navigate(['/templates', template.id, action]); 
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

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
