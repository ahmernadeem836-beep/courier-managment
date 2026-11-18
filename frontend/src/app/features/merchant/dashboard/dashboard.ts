import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-merchant-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  stats = [
    {
      title: 'Total Shipments',
      value: '248',
      change: '+12 this month',
      icon: '📦',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Pending Pickups',
      value: '18',
      change: 'Awaiting collection',
      icon: '🕒',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'In Transit',
      value: '64',
      change: 'Currently moving',
      icon: '🚚',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Delivered',
      value: '156',
      change: 'Successfully delivered',
      icon: '✓',
      color: 'bg-green-100 text-green-700',
    },
  ];

  recentShipments = [
    {
      tracking: 'TRK17945644896841213',
      customer: 'Ali Ahmed',
      destination: 'Islamabad',
      date: '18 Nov 2026',
      amount: 'Rs. 12,500',
      status: 'Booked',
    },
    {
      tracking: 'TRK10024567890123456',
      customer: 'Sara Khan',
      destination: 'Karachi',
      date: '17 Nov 2026',
      amount: 'Rs. 8,500',
      status: 'In Transit',
    },
    {
      tracking: 'TRK10024567890123457',
      customer: 'Usman Malik',
      destination: 'Multan',
      date: '16 Nov 2026',
      amount: 'Rs. 3,200',
      status: 'Delivered',
    },
    {
      tracking: 'TRK10024567890123458',
      customer: 'Ayesha Noor',
      destination: 'Faisalabad',
      date: '15 Nov 2026',
      amount: 'Rs. 5,000',
      status: 'Pending Pickup',
    },
  ];
}