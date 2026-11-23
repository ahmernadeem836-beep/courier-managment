
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

export interface ApiRole {
  role_id: number;
  role_name: string;
  description?: string;
}

export interface ApiBranch {
  branch_id: number;
  branch_name: string;
  branch_code: string;
  address: string;
  city: string;
  phone: string | null;
  is_active: number | boolean;
}

export interface ApiUser {
  user_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  is_active: number | boolean;
  branch_id: number | null;
  branch_name: string | null;
  roles: {
    role_id: number;
    role_name: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private http = inject(HttpClient);

  getUsers(): Observable<{ count: number; users: ApiUser[] }> {
    return this.http.get<{ count: number; users: ApiUser[] }>(
      `${API_URL}/users`
    );
  }

  getRoles(): Observable<{ count: number; roles: ApiRole[] }> {
    return this.http.get<{ count: number; roles: ApiRole[] }>(
      `${API_URL}/roles`
    );
  }

  getBranches(): Observable<{ count: number; branches: ApiBranch[] }> {
    return this.http.get<{ count: number; branches: ApiBranch[] }>(
      `${API_URL}/branches`
    );
  }

  createUser(data: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    role_id: number;
    branch_id: number;
  }): Observable<any> {
    return this.http.post(`${API_URL}/users`, data);
  }

  deactivateUser(userId: number): Observable<any> {
    return this.http.patch(
      `${API_URL}/users/${userId}/deactivate`,
      {}
    );
  }

  activateUser(userId: number): Observable<any> {
    return this.http.patch(
      `${API_URL}/users/${userId}/activate`,
      {}
    );
  }
}
