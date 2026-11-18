import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TrackingEvent {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

@Component({
  selector: 'app-merchant-tracking',
  imports: [FormsModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css',
})
export class Tracking {

  trackingNumber = '';
  searched = false;
  shipment: any = null;

  demoShipments = [
    {
      tracking: 'TRK17945644896841213',
      receiver: 'Ali Ahmed',
      origin: 'Lahore',
      destination: 'Islamabad',
      status: 'In Transit',
      expectedDelivery: '20 Nov 2026',
      events: [
        {
          title: 'Booking Confirmed',
          description: 'Shipment booking has been successfully created.',
          date: '18 Nov 2026, 09:30 AM',
          completed: true,
        },
        {
          title: 'Pickup Assigned',
          description: 'Pickup request assigned to the pickup team.',
          date: '18 Nov 2026, 10:15 AM',
          completed: true,
        },
        {
          title: 'Picked Up',
          description: 'Parcel collected from merchant.',
          date: '18 Nov 2026, 12:00 PM',
          completed: true,
        },
        {
          title: 'Received at Warehouse',
          description: 'Parcel received at origin warehouse.',
          date: '18 Nov 2026, 03:30 PM',
          completed: true,
        },
        {
          title: 'Dispatched',
          description: 'Parcel dispatched towards destination city.',
          date: '19 Nov 2026, 08:00 AM',
          completed: true,
        },
        {
          title: 'Out for Delivery',
          description: 'Parcel will be assigned to a delivery rider.',
          date: 'Pending',
          completed: false,
        },
        {
          title: 'Delivered',
          description: 'Shipment delivered to receiver.',
          date: 'Pending',
          completed: false,
        },
      ] as TrackingEvent[],
    },
  ];

  searchShipment(): void {
    this.searched = true;

    const tracking = this.trackingNumber.trim().toLowerCase();

    this.shipment = this.demoShipments.find(
      item => item.tracking.toLowerCase() === tracking
    ) ?? null;
  }
}