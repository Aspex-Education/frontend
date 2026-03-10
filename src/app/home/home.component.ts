import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Placeholder for future template data
  userTemplates: any[] = [];
  availableTemplates: any[] = [];

  constructor() {}
}
