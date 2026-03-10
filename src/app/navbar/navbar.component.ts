import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public menuOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
