import { Component, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateCreateListadoComponent } from '../template-create-listado/template-create-listado.component';
import { TemplateCreateSamComponent } from '../template-create-sam/template-create-sam.component';
import { TemplateService } from '../../core/services/template.service';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-template-create',
  standalone: true,
  imports: [CommonModule, TemplateCreateListadoComponent, TemplateCreateSamComponent],
  templateUrl: './template-create.component.html',
  styleUrl: './template-create.component.css'
})
export class TemplateCreateComponent implements OnInit, CanComponentDeactivate {
  templateType: string | null = null;
  private destroyRef = inject(DestroyRef);

  @ViewChild(TemplateCreateListadoComponent) listadoComponent?: TemplateCreateListadoComponent;
  @ViewChild(TemplateCreateSamComponent) samComponent?: TemplateCreateSamComponent;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');

    const validTypes = ['listado_operaciones', 'sam'];

    if (id) {
      this.isLoading = true;
      this.templateService.getById(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (t) => {
          this.templateType = t.type.toLowerCase();
          this.isLoading = false;
          if (!validTypes.includes(this.templateType)) {
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        }
      });
    } else if (type) {
      this.templateType = type.toLowerCase();
      if (!validTypes.includes(this.templateType)) {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }

  canDeactivate(): boolean {
    if (this.templateType === 'listado_operaciones' && this.listadoComponent) {
      return this.listadoComponent.canDeactivate();
    }
    if (this.templateType === 'sam' && this.samComponent) {
      return this.samComponent.canDeactivate();
    }
    return true;
  }
}
