
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  stats = [
    {
      title: 'Total Shipments',
      value: '12,480',
      change: '+12.5%',
      icon: '📦',
      color: 'blue',
    },
    {
      title: 'In Transit',
      value: '2,845',
      change: '+8.2%',
      icon: '🚚',
      color: 'purple',
    },
    {
      title: 'Delivered',
      value: '8,920',
      change: '+15.3%',
      icon: '✓',
      color: 'green',
    },
    {
      title: 'Pending Deliveries',
      value: '520',
      change: '-3.4%',
      icon: '◷',
      color: 'orange',
    },
  ];

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

}
