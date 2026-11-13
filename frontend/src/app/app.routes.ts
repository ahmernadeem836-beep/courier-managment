
import { Routes } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Shipments } from './features/shipments/shipments';
import { ShipmentTracking } from './features/shipment-tracking/shipment-tracking';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'shipments', component: Shipments },
      { path: 'shipment-tracking', component: ShipmentTracking },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
