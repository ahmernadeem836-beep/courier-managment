
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

export interface ApiRole {
  role_id: number;
  role_name: string;
  description: string | null;
  created_at?: string;
}

export interface ApiPermission {
  permission_id: number;
  permission_name: string;
  description: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private http = inject(HttpClient);

  getRoles(): Observable<{ count: number; roles: ApiRole[] }> {
    return this.http.get<{ count: number; roles: ApiRole[] }>(
      `${API_URL}/roles`
    );
  }

  getAllPermissions(): Observable<{
    count: number;
    permissions: ApiPermission[];
  }> {
    return this.http.get<{
      count: number;
      permissions: ApiPermission[];
    }>(`${API_URL}/roles/permissions/all`);
  }

  getRolePermissions(roleId: number): Observable<{
    role: { role_id: number; role_name: string };
    count: number;
    permissions: ApiPermission[];
  }> {
    return this.http.get<{
      role: { role_id: number; role_name: string };
      count: number;
      permissions: ApiPermission[];
    }>(`${API_URL}/roles/${roleId}/permissions`);
  }

  assignPermissions(
    roleId: number,
    permissionIds: number[]
  ): Observable<any> {
    return this.http.post(
      `${API_URL}/roles/${roleId}/permissions`,
      { permission_ids: permissionIds }
    );
  }

  createRole(data: {
    role_name: string;
    description: string;
  }): Observable<any> {
    return this.http.post(`${API_URL}/roles`, data);
  }

  updateRole(
    roleId: number,
    data: { role_name: string; description: string }
  ): Observable<any> {
    return this.http.put(`${API_URL}/roles/${roleId}`, data);
  }
}
