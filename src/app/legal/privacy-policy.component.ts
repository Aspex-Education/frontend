import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
  tocOpen = false;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  toggleToc(): void {
    this.tocOpen = !this.tocOpen;
  }

  closeToc(): void {
    this.tocOpen = false;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      this.closeToc();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
