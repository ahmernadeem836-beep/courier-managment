
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface ReportStat {
  title: string;
  value: string;
  description: string;
}

interface ShipmentStatus {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface BranchReport {
  name: string;
  totalShipments: number;
  delivered: number;
  pending: number;
}

@Component({
  selector: 'app-reports',
  imports: [FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {

  selectedPeriod = 'Last 30 Days';

  stats: ReportStat[] = [
    {
      title: 'Total Shipments',
      value: '12,480',
      description: 'Shipments processed'
    },
    {
      title: 'Delivered Shipments',
      value: '8,920',
      description: 'Successfully delivered'
    },
    {
      title: 'In Transit',
      value: '2,845',
      description: 'Currently moving'
    },
    {
      title: 'Pending Shipments',
      value: '715',
      description: 'Awaiting next action'
    }
  ];

  shipmentStatuses: ShipmentStatus[] = [
    {
      name: 'Delivered',
      count: 8920,
      percentage: 71.5,
      color: 'bg-emerald-500'
    },
    {
      name: 'In Transit',
      count: 2845,
      percentage: 22.8,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending',
      count: 520,
      percentage: 4.2,
      color: 'bg-amber-500'
    },
    {
      name: 'Other',
      count: 195,
      percentage: 1.5,
      color: 'bg-slate-400'
    }
  ];

  branchReports: BranchReport[] = [
    {
      name: 'Lahore Head Office',
      totalShipments: 4200,
      delivered: 3100,
      pending: 250
    },
    {
      name: 'Lahore Main Branch',
      totalShipments: 3200,
      delivered: 2450,
      pending: 180
    },
    {
      name: 'Islamabad Branch',
      totalShipments: 2800,
      delivered: 2050,
      pending: 160
    },
    {
      name: 'Karachi Branch',
      totalShipments: 2280,
      delivered: 1320,
      pending: 125
    }
  ];

  get deliveryRate(): number {
    const total = 12480;
    const delivered = 8920;

    return Math.round((delivered / total) * 100);
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
  }

}
