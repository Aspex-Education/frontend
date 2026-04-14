import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateCreateListadoComponent } from '../template-create-listado/template-create-listado.component';
import { TemplateCreateSamComponent } from '../template-create-sam/template-create-sam.component';
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

  @ViewChild(TemplateCreateListadoComponent) listadoComponent?: TemplateCreateListadoComponent;
  @ViewChild(TemplateCreateSamComponent) samComponent?: TemplateCreateSamComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.templateType = this.route.snapshot.paramMap.get('type');
    
    // Validar que el tipo sea válido
    const validTypes = ['listado_operaciones', 'sam'];
    if (!this.templateType || !validTypes.includes(this.templateType)) {
      // Redirigir a home si el tipo no es válido
      this.router.navigate(['/home']);
    }
  }

  canDeactivate(): boolean {
    // Delegar al componente hijo activo
    if (this.templateType === 'listado_operaciones' && this.listadoComponent) {
      return this.listadoComponent.canDeactivate();
    }
    if (this.templateType === 'sam' && this.samComponent) {
      return this.samComponent.canDeactivate();
    }
    return true;
  }
}
