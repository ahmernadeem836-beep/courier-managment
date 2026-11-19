
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(private auth: Auth) {}

  menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: '▦', route: '/dashboard', module: 'dashboard' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Shipments', icon: '□', route: '/shipments', module: 'shipments' },
        { label: 'Shipment Tracking', icon: '⌖', route: '/shipment-tracking', module: 'shipment-tracking' },
        { label: 'Pickup Management', icon: '↗', route: '/pickups', module: 'pickups' },
        { label: 'Warehouse', icon: '▤', route: '/warehouse', module: 'warehouse' },
        { label: 'Dispatch', icon: '⇧', route: '/dispatch', module: 'dispatch' },
        { label: 'Delivery', icon: '⌖', route: '/delivery', module: 'delivery' },
        { label: 'Returns', icon: '↩', route: '/returns', module: 'returns' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Users', icon: '♙', route: '/users', module: 'users' },
        { label: 'Roles & Permissions', icon: '⚙', route: '/roles', module: 'roles' },
        { label: 'Branches', icon: '⌂', route: '/branches', module: 'branches' },
        { label: 'Merchants', icon: '▣', route: '/merchants', module: 'merchants' },
        { label: 'Customers', icon: '♧', route: '/customers', module: 'customers' },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Reports', icon: '▥', route: '/reports', module: 'reports' },
      ],
    },
  ];

  get filteredMenuGroups() {
    return this.menuGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          this.auth.hasAccess(item.module)
        ),
      }))
      .filter(group => group.items.length > 0);
  }
  get currentUser() {
  return this.auth.getCurrentUser();
}

get currentUserRole() {
  return this.auth.getUserRole();
}
}
