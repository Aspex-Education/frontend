import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-template-create-sam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-create-sam.component.html',
  styleUrl: './template-create-sam.component.css'
})
export class TemplateCreateSamComponent implements CanComponentDeactivate {
  private destroyRef = inject(DestroyRef);
  isDirty = false;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  canDeactivate(): boolean {
    return !this.isDirty;
  }
}
