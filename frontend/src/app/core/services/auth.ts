
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  switchMap,
  catchError,
  throwError,
  map,
} from 'rxjs';

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Branch Manager'
  | 'Warehouse Staff'
  | 'Dispatcher'
  | 'Delivery Rider'
  | 'Finance Officer'
  | 'Support Agent'
  | 'Merchant'
  | 'Customer';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  roles: UserRole[];
  permissions: string[];
  merchantCode?: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    user_id: number;
    full_name: string;
    email: string;
  };
}

interface ProfileResponse {
  message: string;
  user: {
    user_id: number;
    full_name: string;
    email: string;
    phone: string | null;
  };
  roles: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'http://localhost:5000/api';

  private currentUser: AuthUser | null = this.loadUser();

  private readonly roleRoutes: Record<UserRole, string> = {
    'Super Admin': '/dashboard',
    'Admin': '/dashboard',
    'Branch Manager': '/dashboard',
    'Warehouse Staff': '/warehouse',
    'Dispatcher': '/dispatch',
    'Delivery Rider': '/delivery',
    'Finance Officer': '/reports',
    'Support Agent': '/shipment-tracking',
    'Merchant': '/merchant/dashboard',
    'Customer': '/shipment-tracking',
  };

  private readonly modulePermissions: Record<string, string[]> = {
    dashboard: [],
    shipments: ['view_shipments'],
    'shipment-tracking': ['view_shipments', 'track_shipments'],
    pickups: ['view_pickups'],
    warehouse: ['view_warehouse'],
    dispatch: ['view_dispatch'],
    delivery: ['view_delivery'],
    returns: ['view_returns'],
    users: ['view_users'],
    roles: ['manage_roles'],
    branches: ['view_branches'],
    merchants: ['view_merchants'],
    customers: ['view_customers'],
    reports: ['view_reports'],
    'merchant-dashboard': ['view_merchant_dashboard'],
    'create-shipment': ['create_shipments'],
    'merchant-shipments': ['view_own_shipments'],
    'merchant-tracking': ['track_own_shipments'],
    'merchant-profile': ['view_own_merchant_profile'],
  };

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, {
        email: email.trim(),
        password,
      })
      .pipe(
        switchMap((response) => {
          localStorage.setItem('courier_token', response.token);

          const headers = new HttpHeaders({
            Authorization: `Bearer ${response.token}`,
          });

          return this.http.get<ProfileResponse>(
            `${this.apiUrl}/auth/profile`,
            { headers }
          );
        }),

        map((profile) => this.setCurrentUser(profile)),

        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  private setCurrentUser(profile: ProfileResponse): AuthUser {
    const validRoles: UserRole[] = [
      'Super Admin',
      'Admin',
      'Branch Manager',
      'Warehouse Staff',
      'Dispatcher',
      'Delivery Rider',
      'Finance Officer',
      'Support Agent',
      'Merchant',
      'Customer',
    ];

    const roles = profile.roles.filter(
      (role): role is UserRole =>
        validRoles.includes(role as UserRole)
    );

    const user: AuthUser = {
      id: profile.user.user_id,
      name: profile.user.full_name,
      email: profile.user.email,
      role: roles[0] ?? 'Customer',
      roles,
      permissions: profile.permissions ?? [],
    };

    this.currentUser = user;

    localStorage.setItem('courier_user', JSON.stringify(user));

    return user;
  }

  private loadUser(): AuthUser | null {
    try {
      const savedUser = localStorage.getItem('courier_user');

      return savedUser
        ? (JSON.parse(savedUser) as AuthUser)
        : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    this.currentUser = null;

    localStorage.removeItem('courier_user');
    localStorage.removeItem('courier_token');
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('courier_token') &&
      this.currentUser !== null
    );
  }

  getUserRole(): UserRole | null {
    return this.currentUser?.role ?? null;
  }

  getDefaultRoute(): string {
    const role = this.getUserRole();

    return role ? this.roleRoutes[role] : '/login';
  }

  getAllowedModules(): string[] {
    if (!this.currentUser) {
      return [];
    }

    return Object.keys(this.modulePermissions).filter((module) =>
      this.hasAccess(module)
    );
  }

  hasAccess(module: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    if (module === 'dashboard') {
      return this.currentUser.permissions.length > 0;
    }

    const requiredPermissions = this.modulePermissions[module];

    if (!requiredPermissions) {
      return false;
    }

    return requiredPermissions.some((permission) =>
      this.currentUser!.permissions.includes(permission)
    );
  }

  logout(): void {
    this.clearSession();
  }
}
