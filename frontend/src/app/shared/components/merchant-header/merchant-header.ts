
import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-merchant-header',
  imports: [RouterLink],
  templateUrl: './merchant-header.html',
  styleUrl: './merchant-header.css',
})
export class MerchantHeader {
  pageTitle = signal('Dashboard');
  showNotifications = false;
  showProfileMenu = false;

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
