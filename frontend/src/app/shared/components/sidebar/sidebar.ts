
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: '▦', route: '/dashboard' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Shipments', icon: '□', route: '/shipments' },
        { label: 'Shipment Tracking', icon: '⌖', route: '/shipment-tracking' },
        { label: 'Pickup Management', icon: '↗', route: '/pickups' },
        { label: 'Warehouse', icon: '▤', route: '/warehouse' },
        { label: 'Dispatch', icon: '⇧', route: '/dispatch' },
        { label: 'Delivery', icon: '⌖', route: '/delivery' },
        { label: 'Returns', icon: '↩', route: '/returns' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Users', icon: '♙', route: '/users' },
        { label: 'Roles & Permissions', icon: '⚙', route: '/roles' },
        { label: 'Branches', icon: '⌂', route: '/branches' },
        { label: 'Merchants', icon: '▣', route: '/merchants' },
        { label: 'Customers', icon: '♧', route: '/customers' },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Reports', icon: '▥', route: '/reports' },
      ],
    },
  ];
}
