import { Routes } from '@angular/router';

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

// Merchant Portal
import { MerchantLayout } from './layouts/merchant-layout/merchant-layout';
import { Dashboard as MerchantDashboard } from './features/merchant/dashboard/dashboard';
import { CreateShipment } from './features/merchant/create-shipment/create-shipment';
import { Shipments as MerchantShipments } from './features/merchant/shipments/shipments';
import { Tracking } from './features/merchant/tracking/tracking';
import { Profile } from './features/merchant/profile/profile';

export const routes: Routes = [

  // Internal Admin / Operations Portal
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'shipments', component: Shipments },
      { path: 'shipment-tracking', component: ShipmentTracking },
      { path: 'pickups', component: Pickups },
      { path: 'warehouse', component: Warehouse },
      { path: 'dispatch', component: dispatch },
      { path: 'delivery', component: delivery },
      { path: 'returns', component: Returns },
      { path: 'users', component: Users },
      { path: 'roles', component: Roles },
      { path: 'branches', component: Branches },
      { path: 'merchants', component: Merchants },
      { path: 'customers', component: Customers },
      { path: 'reports', component: Reports }
    ]
  },

  // Merchant Portal
  {
    path: 'merchant',
    component: MerchantLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: MerchantDashboard },
      { path: 'create-shipment', component: CreateShipment },
      { path: 'shipments', component: MerchantShipments },
      { path: 'tracking', component: Tracking },
      { path: 'profile', component: Profile }
    ]
  }

];