
import { Routes } from '@angular/router';

// Authentication
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';

// Internal Portal
import { MainLayout } from './layouts/main-layout/main-layout';

import { Dashboard } from './features/dashboard/dashboard';
import { Shipments } from './features/shipments/shipments';
import { ShipmentTracking } from './features/shipment-tracking/shipment-tracking';
import { Pickups } from './features/pickups/pickups';
import { Warehouse } from './features/warehouse/warehouse';
import { dispatch } from './features/dispatch/dispatch';
import { delivery } from './features/delivery/delivery';
import { Returns } from './features/returns/returns';
import { Users } from './features/users/users';
import { Roles } from './features/roles/roles';
import { Branches } from './features/branches/branches';
import { Merchants } from './features/merchants/merchants';
import { Customers } from './features/customers/customers';
import { Reports } from './features/reports/reports';
import { guestGuard } from './core/guards/guest-guard';
// Merchant Portal
import { MerchantLayout } from './layouts/merchant-layout/merchant-layout';
import { Dashboard as MerchantDashboard } from './features/merchant/dashboard/dashboard';
import { CreateShipment } from './features/merchant/create-shipment/create-shipment';
import { Shipments as MerchantShipments } from './features/merchant/shipments/shipments';
import { Tracking } from './features/merchant/tracking/tracking';
import { Profile } from './features/merchant/profile/profile';

export const routes: Routes = [

  // Login
  {
    path: 'login',
    component: Login
  },

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Internal Admin / Operations Portal
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        data: { module: 'dashboard' }
      },
      {
        path: 'shipments',
        component: Shipments,
        canActivate: [authGuard],
        data: { module: 'shipments' }
      },
      {
        path: 'shipment-tracking',
        component: ShipmentTracking,
        canActivate: [authGuard],
        data: { module: 'shipment-tracking' }
      },
      { 
  path: 'login', 
  component: Login, 
  canActivate: [guestGuard] 
},
      {
        path: 'pickups',
        component: Pickups,
        canActivate: [authGuard],
        data: { module: 'pickups' }
      },
      {
        path: 'warehouse',
        component: Warehouse,
        canActivate: [authGuard],
        data: { module: 'warehouse' }
      },
      {
        path: 'dispatch',
        component: dispatch,
        canActivate: [authGuard],
        data: { module: 'dispatch' }
      },
      {
        path: 'delivery',
        component: delivery,
        canActivate: [authGuard],
        data: { module: 'delivery' }
      },
      {
        path: 'returns',
        component: Returns,
        canActivate: [authGuard],
        data: { module: 'returns' }
      },
      {
        path: 'users',
        component: Users,
        canActivate: [authGuard],
        data: { module: 'users' }
      },
      {
        path: 'roles',
        component: Roles,
        canActivate: [authGuard],
        data: { module: 'roles' }
      },
      {
        path: 'branches',
        component: Branches,
        canActivate: [authGuard],
        data: { module: 'branches' }
      },
      {
        path: 'merchants',
        component: Merchants,
        canActivate: [authGuard],
        data: { module: 'merchants' }
      },
      {
        path: 'customers',
        component: Customers,
        canActivate: [authGuard],
        data: { module: 'customers' }
      },
      {
        path: 'reports',
        component: Reports,
        canActivate: [authGuard],
        data: { module: 'reports' }
      }
    ]
  },

  // Merchant Portal
  {
    path: 'merchant',
    component: MerchantLayout,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: MerchantDashboard,
        canActivate: [authGuard],
        data: { module: 'merchant-dashboard' }
      },
      {
        path: 'create-shipment',
        component: CreateShipment,
        canActivate: [authGuard],
        data: { module: 'create-shipment' }
      },
      {
        path: 'shipments',
        component: MerchantShipments,
        canActivate: [authGuard],
        data: { module: 'merchant-shipments' }
      },
      {
        path: 'tracking',
        component: Tracking,
        canActivate: [authGuard],
        data: { module: 'merchant-tracking' }
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard],
        data: { module: 'merchant-profile' }
      }
    ]
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }

];
