
import { Routes } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Shipments } from './features/shipments/shipments';
import { ShipmentTracking } from './features/shipment-tracking/shipment-tracking';
import { Pickups } from './features/pickups/pickups';
import { Warehouse } from './features/warehouse/warehouse';
import { dispatch } from './features/dispatch/dispatch';
import { delivery } from './features/delivery/delivery';
import { Returns } from './features/returns/returns';
import { Users} from './features/users/users';
import { Roles } from './features/roles/roles';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'shipments', component: Shipments },
      { path: 'shipment-tracking', component: ShipmentTracking },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'pickups', component: Pickups },
      { path: 'warehouse', component: Warehouse },
      { path: 'dispatch', component: dispatch },
      { path: 'delivery', component: delivery },
      { path: 'returns', component: Returns},
      { path: 'users', component: Users},
      { path: 'roles', component: Roles },
    ],
  },
];
