
import { Injectable } from '@angular/core';

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Branch Manager'
  | 'Warehouse Staff'
  | 'Dispatcher'
  | 'Delivery Rider'
  | 'Finance Officer'
  | 'Support Agent'
  | 'Merchant';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  merchantCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

    getDefaultRoute(): string {
  const role = this.getUserRole();

  const roleRoutes: Record<UserRole, string> = {
    'Super Admin': '/dashboard',
    'Admin': '/dashboard',
    'Branch Manager': '/dashboard',
    'Warehouse Staff': '/warehouse',
    'Dispatcher': '/dispatch',
    'Delivery Rider': '/delivery',
    'Finance Officer': '/reports',
    'Support Agent': '/shipment-tracking',
    'Merchant': '/merchant/dashboard',
  };

  return role ? roleRoutes[role] : '/login';
}

  private currentUser: AuthUser | null = this.loadUser();

  private demoUsers: AuthUser[] = [
    { id: 1, name: 'System Administrator', email: 'superadmin@demo.com', role: 'Super Admin' },
    { id: 2, name: 'Admin User', email: 'admin@demo.com', role: 'Admin' },
    { id: 3, name: 'Branch Manager', email: 'manager@demo.com', role: 'Branch Manager' },
    { id: 4, name: 'Warehouse Staff', email: 'warehouse@demo.com', role: 'Warehouse Staff' },
    { id: 5, name: 'Dispatcher', email: 'dispatcher@demo.com', role: 'Dispatcher' },
    { id: 6, name: 'Delivery Rider', email: 'rider@demo.com', role: 'Delivery Rider' },
    { id: 7, name: 'Finance Officer', email: 'finance@demo.com', role: 'Finance Officer' },
    { id: 8, name: 'Support Agent', email: 'support@demo.com', role: 'Support Agent' },
    { id: 9, name: 'Ali Electronics', email: 'merchant@demo.com', role: 'Merchant', merchantCode: 'AL' },
  ];

  private roleModules: Record<UserRole, string[]> = {
    'Super Admin': [
      'dashboard', 'shipments', 'shipment-tracking', 'pickups',
      'warehouse', 'dispatch', 'delivery', 'returns',
      'users', 'roles', 'branches', 'merchants', 'customers', 'reports'
    ],
    'Admin': [
      'dashboard', 'shipments', 'shipment-tracking', 'pickups',
      'warehouse', 'dispatch', 'delivery', 'returns',
      'users', 'roles', 'branches', 'merchants', 'customers', 'reports'
    ],
    'Branch Manager': [
      'dashboard', 'shipments', 'shipment-tracking', 'pickups',
      'warehouse', 'dispatch', 'delivery', 'returns', 'customers', 'reports'
    ],
    'Warehouse Staff': ['dashboard', 'warehouse'],
    'Dispatcher': ['dashboard', 'dispatch'],
    'Delivery Rider': ['dashboard', 'delivery'],
    'Finance Officer': ['dashboard', 'reports'],
    'Support Agent': ['dashboard', 'shipment-tracking', 'customers'],
    'Merchant': [
      'merchant-dashboard', 'create-shipment', 'merchant-shipments',
      'merchant-tracking', 'merchant-profile'
    ]
  };

  private loadUser(): AuthUser | null {
    try {
      const savedUser = localStorage.getItem('courier_user');
      return savedUser ? JSON.parse(savedUser) as AuthUser : null;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): AuthUser | null {
    const user = this.demoUsers.find(
      item => item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user || password !== 'Demo@123') {
      return null;
    }

    this.currentUser = user;
    localStorage.setItem('courier_user', JSON.stringify(user));

    return user;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): UserRole | null {
    return this.currentUser?.role ?? null;
  }

  getAllowedModules(): string[] {
    if (!this.currentUser) {
      return [];
    }

    return this.roleModules[this.currentUser.role] ?? [];
  }

  hasAccess(module: string): boolean {
    return this.getAllowedModules().includes(module);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('courier_user');
  }
}
