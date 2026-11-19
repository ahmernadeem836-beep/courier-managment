
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, UserRole } from '../../core/services/auth';

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface BreakdownItem {
  label: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  get currentRole(): UserRole | null {
    return this.auth.getUserRole();
  }

  get dashboardTitle(): string {
    const titles: Record<UserRole, string> = {
      'Super Admin': 'System Overview',
      'Admin': 'System Overview',
      'Branch Manager': 'Branch Overview',
      'Warehouse Staff': 'Warehouse Overview',
      'Dispatcher': 'Dispatch Overview',
      'Delivery Rider': 'Delivery Overview',
      'Finance Officer': 'Finance Overview',
      'Support Agent': 'Support Overview',
      'Merchant': 'Merchant Overview',
    };

    return this.currentRole
      ? titles[this.currentRole]
      : 'Dashboard Overview';
  }

  get dashboardDescription(): string {
    const descriptions: Record<UserRole, string> = {
      'Super Admin': 'Monitor courier operations across the entire system.',
      'Admin': 'Manage and monitor courier business operations.',
      'Branch Manager': 'Monitor your assigned branch operations and shipment activities.',
      'Warehouse Staff': 'Monitor warehouse activities and shipment handling.',
      'Dispatcher': 'Monitor shipment sorting and dispatch operations.',
      'Delivery Rider': 'View your delivery activities and assigned workload.',
      'Finance Officer': 'Monitor financial and cash-on-delivery activities.',
      'Support Agent': 'Monitor customer support and shipment inquiries.',
      'Merchant': 'Monitor your shipments and business activities.',
    };

    return this.currentRole
      ? descriptions[this.currentRole]
      : 'Here is an overview of your courier business.';
  }

  get stats(): DashboardStat[] {

    const dashboardStats: Record<UserRole, DashboardStat[]> = {

      'Super Admin': [
        { title: 'Total Shipments', value: '12,480', change: '+12.5%', icon: '📦', color: 'blue' },
        { title: 'In Transit', value: '2,845', change: '+8.2%', icon: '🚚', color: 'purple' },
        { title: 'Delivered', value: '8,920', change: '+15.3%', icon: '✓', color: 'green' },
        { title: 'Pending Deliveries', value: '520', change: '-3.4%', icon: '◷', color: 'orange' },
      ],

      'Admin': [
        { title: 'Total Shipments', value: '12,480', change: '+12.5%', icon: '📦', color: 'blue' },
        { title: 'Active Branches', value: '12', change: '+2', icon: '🏢', color: 'purple' },
        { title: 'Active Merchants', value: '340', change: '+8.5%', icon: '🏪', color: 'green' },
        { title: 'Pending Deliveries', value: '520', change: '-3.4%', icon: '◷', color: 'orange' },
      ],

      'Branch Manager': [
        { title: 'Total Shipments', value: '1,250', change: '+10.2%', icon: '📦', color: 'blue' },
        { title: 'In Transit', value: '320', change: '+6.5%', icon: '🚚', color: 'purple' },
        { title: 'Delivered', value: '780', change: '+12.3%', icon: '✓', color: 'green' },
        { title: 'Pending Deliveries', value: '85', change: '-2.4%', icon: '◷', color: 'orange' },
      ],

      'Warehouse Staff': [
        { title: 'Received Shipments', value: '450', change: '+8.2%', icon: '📦', color: 'blue' },
        { title: 'Pending Sorting', value: '65', change: '-3.2%', icon: '◷', color: 'orange' },
        { title: 'Sorted Shipments', value: '320', change: '+12.4%', icon: '✓', color: 'green' },
        { title: 'Ready for Dispatch', value: '85', change: '+5.1%', icon: '🚚', color: 'purple' },
      ],

      'Dispatcher': [
        { title: 'Ready for Dispatch', value: '85', change: '+5.1%', icon: '📦', color: 'blue' },
        { title: 'Dispatched Today', value: '120', change: '+9.2%', icon: '🚚', color: 'purple' },
        { title: 'Active Routes', value: '18', change: '+2', icon: '🛣️', color: 'green' },
        { title: 'Pending Dispatch', value: '24', change: '-4.1%', icon: '◷', color: 'orange' },
      ],

      'Delivery Rider': [
        { title: 'Assigned Deliveries', value: '32', change: '+4', icon: '📦', color: 'blue' },
        { title: 'Delivered Today', value: '18', change: '+12.5%', icon: '✓', color: 'green' },
        { title: 'Pending Deliveries', value: '10', change: '-2', icon: '◷', color: 'orange' },
        { title: 'Failed Deliveries', value: '4', change: '-1', icon: '⚠️', color: 'purple' },
      ],

      'Finance Officer': [
        { title: 'Total COD Amount', value: 'Rs. 850K', change: '+12.5%', icon: '💰', color: 'blue' },
        { title: 'Collected Amount', value: 'Rs. 620K', change: '+8.2%', icon: '✓', color: 'green' },
        { title: 'Pending COD', value: 'Rs. 180K', change: '-3.4%', icon: '◷', color: 'orange' },
        { title: 'Settlements', value: '45', change: '+5', icon: '📊', color: 'purple' },
      ],

      'Support Agent': [
        { title: 'Total Inquiries', value: '125', change: '+8.2%', icon: '📩', color: 'blue' },
        { title: 'Pending Inquiries', value: '28', change: '-5.2%', icon: '◷', color: 'orange' },
        { title: 'Resolved Inquiries', value: '85', change: '+12.3%', icon: '✓', color: 'green' },
        { title: 'Shipment Issues', value: '12', change: '-2', icon: '⚠️', color: 'purple' },
      ],

      'Merchant': [
        { title: 'Total Shipments', value: '150', change: '+12.5%', icon: '📦', color: 'blue' },
        { title: 'In Transit', value: '35', change: '+8.2%', icon: '🚚', color: 'purple' },
        { title: 'Delivered', value: '100', change: '+15.3%', icon: '✓', color: 'green' },
        { title: 'Pending Deliveries', value: '10', change: '-3.4%', icon: '◷', color: 'orange' },
      ],
    };

    return this.currentRole
      ? dashboardStats[this.currentRole]
      : [];
  }

  get shipmentBreakdown(): {
    title: string;
    items: BreakdownItem[];
  } | undefined {

    const breakdown: Record<UserRole, {
      title: string;
      items: BreakdownItem[];
    }> = {

      'Super Admin': {
        title: 'System Shipment Overview',
        items: [
          { label: 'Delivered', count: 8920, percentage: 72 },
          { label: 'In Transit', count: 2845, percentage: 23 },
          { label: 'Pending', count: 520, percentage: 4 },
          { label: 'Failed', count: 195, percentage: 2 },
        ],
      },

      'Admin': {
        title: 'Overall Shipment Overview',
        items: [
          { label: 'Delivered', count: 8920, percentage: 72 },
          { label: 'In Transit', count: 2845, percentage: 23 },
          { label: 'Pending', count: 520, percentage: 4 },
          { label: 'Failed', count: 195, percentage: 2 },
        ],
      },

      'Branch Manager': {
        title: 'Branch Shipment Overview',
        items: [
          { label: 'Delivered', count: 780, percentage: 62 },
          { label: 'In Transit', count: 320, percentage: 26 },
          { label: 'Pending', count: 85, percentage: 7 },
          { label: 'Failed', count: 65, percentage: 5 },
        ],
      },

      'Warehouse Staff': {
        title: 'Warehouse Processing Overview',
        items: [
          { label: 'Received', count: 450, percentage: 100 },
          { label: 'Sorted', count: 320, percentage: 71 },
          { label: 'Pending Sorting', count: 65, percentage: 14 },
          { label: 'Ready for Dispatch', count: 85, percentage: 19 },
        ],
      },

      'Dispatcher': {
        title: 'Dispatch Overview',
        items: [
          { label: 'Dispatched', count: 120, percentage: 80 },
          { label: 'Ready for Dispatch', count: 25, percentage: 17 },
          { label: 'Pending', count: 5, percentage: 3 },
        ],
      },

      'Delivery Rider': {
        title: 'Delivery Progress',
        items: [
          { label: 'Delivered', count: 18, percentage: 56 },
          { label: 'Pending', count: 10, percentage: 31 },
          { label: 'Failed', count: 4, percentage: 13 },
        ],
      },

      'Finance Officer': {
        title: 'COD Collection Overview',
        items: [
          { label: 'Collected', count: 620, percentage: 73 },
          { label: 'Pending', count: 180, percentage: 21 },
          { label: 'Other', count: 50, percentage: 6 },
        ],
      },

      'Support Agent': {
        title: 'Support Inquiry Overview',
        items: [
          { label: 'Resolved', count: 85, percentage: 68 },
          { label: 'Pending', count: 28, percentage: 22 },
          { label: 'Shipment Issues', count: 12, percentage: 10 },
        ],
      },

      'Merchant': {
        title: 'My Shipment Overview',
        items: [
          { label: 'Delivered', count: 100, percentage: 67 },
          { label: 'In Transit', count: 35, percentage: 23 },
          { label: 'Pending', count: 10, percentage: 7 },
          { label: 'Failed', count: 5, percentage: 3 },
        ],
      },
    };

    return this.currentRole
      ? breakdown[this.currentRole]
      : undefined;
  }

  recentShipments = [
    {
      tracking: 'TRK-100245',
      customer: 'Ahmed Khan',
      destination: 'Lahore',
      date: '13 Nov 2026',
      status: 'In Transit',
    },
    {
      tracking: 'TRK-100246',
      customer: 'Sara Ali',
      destination: 'Karachi',
      date: '13 Nov 2026',
      status: 'Delivered',
    },
    {
      tracking: 'TRK-100247',
      customer: 'Usman Malik',
      destination: 'Islamabad',
      date: '12 Nov 2026',
      status: 'Pending',
    },
    {
      tracking: 'TRK-100248',
      customer: 'Ayesha Noor',
      destination: 'Multan',
      date: '12 Nov 2026',
      status: 'Failed',
    },
    {
      tracking: 'TRK-100249',
      customer: 'Bilal Ahmed',
      destination: 'Faisalabad',
      date: '11 Nov 2026',
      status: 'Delivered',
    },
  ];

  recentActivities = [
    {
      title: 'Shipment booked',
      description: 'TRK-100245 was successfully booked.',
      time: '10 minutes ago',
      icon: '📦',
    },
    {
      title: 'Shipment dispatched',
      description: 'TRK-100246 was dispatched from the branch.',
      time: '35 minutes ago',
      icon: '🚚',
    },
    {
      title: 'Shipment delivered',
      description: 'TRK-100247 was marked as delivered.',
      time: '1 hour ago',
      icon: '✓',
    },
    {
      title: 'Shipment received',
      description: 'New shipment received at the warehouse.',
      time: '2 hours ago',
      icon: '🏢',
    },
  ];

  get recentShipmentsTitle(): string {
    return this.currentRole === 'Warehouse Staff'
      ? 'Recent Warehouse Shipments'
      : this.currentRole === 'Dispatcher'
        ? 'Recent Dispatch Shipments'
        : this.currentRole === 'Delivery Rider'
          ? 'Recent Delivery Shipments'
          : 'Recent Shipments';
  }

  get viewAllRoute(): string {
    const routes: Partial<Record<UserRole, string>> = {
      'Super Admin': '/shipments',
      'Admin': '/shipments',
      'Branch Manager': '/shipments',
      'Warehouse Staff': '/warehouse',
      'Dispatcher': '/dispatch',
      'Delivery Rider': '/delivery',
      'Finance Officer': '/reports',
      'Support Agent': '/shipment-tracking',
      'Merchant': '/merchant/shipments',
    };

    return this.currentRole
      ? routes[this.currentRole] ?? '/dashboard'
      : '/dashboard';
  }

  viewAll(): void {
    this.router.navigate([this.viewAllRoute]);
  }
}
