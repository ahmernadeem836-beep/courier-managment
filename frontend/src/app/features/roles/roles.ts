
import { Component } from '@angular/core';

interface Permission {
  key: string;
  label: string;
}

interface SystemRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles {

  permissions: Permission[] = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' },
  ];

  roles: SystemRole[] = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system administration',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative operations',
      permissions: ['view', 'create', 'update'],
    },
    {
      id: 3,
      name: 'Branch Manager',
      description: 'Branch-level management',
      permissions: ['view', 'create', 'update'],
    },
    {
      id: 4,
      name: 'Warehouse Staff',
      description: 'Warehouse operations',
      permissions: ['view', 'update'],
    },
    {
      id: 5,
      name: 'Dispatcher',
      description: 'Shipment dispatch operations',
      permissions: ['view', 'create', 'update'],
    },
    {
      id: 6,
      name: 'Delivery Rider',
      description: 'Assigned delivery operations',
      permissions: ['view', 'update'],
    },
    {
      id: 7,
      name: 'Finance Officer',
      description: 'Finance-related access',
      permissions: ['view'],
    },
    {
      id: 8,
      name: 'Support Agent',
      description: 'Customer support operations',
      permissions: ['view', 'update'],
    },
    {
      id: 9,
      name: 'Customer',
      description: 'Customer shipment access',
      permissions: ['view'],
    },
  ];

  selectedRole: SystemRole = this.roles[0];

  selectRole(role: SystemRole): void {
    this.selectedRole = role;
  }

  hasPermission(permission: string): boolean {
    return this.selectedRole.permissions.includes(permission);
  }

  togglePermission(permission: string): void {
    const permissions = this.selectedRole.permissions;

    if (permissions.includes(permission)) {
      this.selectedRole.permissions =
        permissions.filter(item => item !== permission);
    } else {
      this.selectedRole.permissions = [...permissions, permission];
    }
  }

  getPermissionCount(role: SystemRole): number {
    return role.permissions.length;
  }
}
