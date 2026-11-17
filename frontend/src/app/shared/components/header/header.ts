
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ShipmentService,
  type Shipment
} from '../../../core/services/shipment';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private shipmentService = inject(ShipmentService);

  pageTitle = signal('Dashboard');

  searchTerm = '';
  profileOpen = false;
  notificationOpen = false;

  private pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/shipments': 'Shipments',
    '/shipment-tracking': 'Shipment Tracking',
    '/pickups': 'Pickup Management',
    '/warehouse': 'Warehouse Management',
    '/dispatch': 'Dispatch Management',
    '/delivery': 'Delivery Management',
    '/returns': 'Returns Management',
    '/users': 'User Management',
    '/roles': 'Roles & Permissions',
    '/branches': 'Branch Management',
    '/merchants': 'Merchant Management',
    '/customers': 'Customer Management',
    '/reports': 'Reports & Analytics',
  };

  constructor() {
    this.updatePageTitle(this.router.url);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updatePageTitle(event.urlAfterRedirects);
        }
      });
  }

  private updatePageTitle(url: string): void {
    const route = url.split(/[?#]/)[0].replace(/\/+$/, '');
    const currentRoute = route || '/dashboard';

    this.pageTitle.set(
      this.pageTitles[currentRoute] ?? 'CourierPro'
    );
  }

  get searchResults(): Shipment[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) return [];

    return this.shipmentService
      .getShipments()
      .filter(shipment =>
        shipment.tracking.toLowerCase().includes(search) ||
        shipment.customer.toLowerCase().includes(search) ||
        shipment.merchant.toLowerCase().includes(search) ||
        shipment.origin.toLowerCase().includes(search) ||
        shipment.destination.toLowerCase().includes(search)
      )
      .slice(0, 6);
  }

  openShipment(shipment: Shipment): void {
    this.router.navigate(['/shipment-tracking'], {
      queryParams: { tracking: shipment.tracking }
    });

    this.searchTerm = '';
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationOpen = false;
  }

  toggleNotifications(): void {
    this.notificationOpen = !this.notificationOpen;
    this.profileOpen = false;
  }
}
