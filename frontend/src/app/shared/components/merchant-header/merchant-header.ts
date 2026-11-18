import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
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

  constructor(private router: Router) {}

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  logout(): void {
    // Authentication integration baad mein karenge.
    this.router.navigate(['/']);
  }
}