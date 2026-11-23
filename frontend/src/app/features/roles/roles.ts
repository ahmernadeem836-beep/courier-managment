
import { Component, OnInit, inject } from '@angular/core';
import {
  RolesService,
  ApiRole,
  ApiPermission
} from '../../core/services/roles';

interface SystemRole {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {

  private rolesService = inject(RolesService);

  roles: SystemRole[] = [];
  permissions: ApiPermission[] = [];

  selectedRole: SystemRole | null = null;

  selectedPermissionIds: number[] = [];
  originalPermissionIds: number[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadRolesModule();
  }

  loadRolesModule(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.rolesService.getRoles().subscribe({
      next: response => {
        this.roles = response.roles.map((role: ApiRole) => ({
          id: role.role_id,
          name: role.role_name,
          description: role.description || 'No description available',
        }));

        this.loading = false;

        if (this.roles.length > 0) {
          this.selectRole(this.roles[0]);
        } else {
          this.selectedRole = null;
        }
      },
      error: error => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Unable to load roles.';
        console.error('Roles API error:', error);
      },
    });
  }

  loadPermissions(): void {
    this.rolesService.getAllPermissions().subscribe({
      next: response => {
        this.permissions = response.permissions;
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to load permissions.';
        console.error('Permissions API error:', error);
      },
    });
  }

  selectRole(role: SystemRole): void {
    this.selectedRole = role;
    this.successMessage = '';
    this.errorMessage = '';

    this.selectedPermissionIds = [];
    this.originalPermissionIds = [];

    this.rolesService.getRolePermissions(role.id).subscribe({
      next: response => {
        const ids = response.permissions.map(
          (permission: ApiPermission) => permission.permission_id
        );

        this.selectedPermissionIds = [...ids];
        this.originalPermissionIds = [...ids];
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to load role permissions.';
        console.error('Role permissions error:', error);
      },
    });
  }

  hasPermission(permissionId: number): boolean {
    return this.selectedPermissionIds.includes(permissionId);
  }

  togglePermission(permissionId: number): void {
    if (this.hasPermission(permissionId)) {
      this.selectedPermissionIds =
        this.selectedPermissionIds.filter(id => id !== permissionId);
    } else {
      this.selectedPermissionIds = [
        ...this.selectedPermissionIds,
        permissionId,
      ];
    }

    this.successMessage = '';
  }

  savePermissions(): void {
    if (!this.selectedRole) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.rolesService.assignPermissions(
      this.selectedRole.id,
      this.selectedPermissionIds
    ).subscribe({
      next: response => {
        this.saving = false;

        this.originalPermissionIds = [
          ...this.selectedPermissionIds,
        ];

        this.successMessage =
          response.message || 'Permissions updated successfully.';
      },
      error: error => {
        this.saving = false;
        this.errorMessage =
          error.error?.message || 'Unable to save permissions.';
        console.error('Save permissions error:', error);
      },
    });
  }

  resetPermissions(): void {
    this.selectedPermissionIds = [
      ...this.originalPermissionIds,
    ];

    this.successMessage = '';
    this.errorMessage = '';
  }

  getPermissionCount(role: SystemRole): number {
    if (this.selectedRole?.id === role.id) {
      return this.selectedPermissionIds.length;
    }

    return 0;
  }

  getPermissionLabel(permissionName: string): string {
    return permissionName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  get hasUnsavedChanges(): boolean {
    if (this.selectedPermissionIds.length !== this.originalPermissionIds.length) {
      return true;
    }

    return !this.selectedPermissionIds.every(
      id => this.originalPermissionIds.includes(id)
    );
  }
}
