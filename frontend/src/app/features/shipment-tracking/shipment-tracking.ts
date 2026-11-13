
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ShipmentService,
  type Shipment,
} from '../../core/services/shipment';

@Component({
  selector: 'app-shipment-tracking',
  imports: [FormsModule],
  templateUrl: './shipment-tracking.html',
  styleUrl: './shipment-tracking.css',
})
export class ShipmentTracking implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private shipmentService: ShipmentService
  ) {}

  searchTracking = '';
  searchedTracking = '';

  shipment: Shipment | null = null;
  timeline: any[] = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const trackingNumber = params.get('tracking');

      if (trackingNumber) {
        this.searchTracking = trackingNumber;
        this.searchShipment();
      }
    });
  }

  searchShipment() {
    const trackingNumber = this.searchTracking.trim();

    if (!trackingNumber) {
      alert('Please enter a tracking number.');
      return;
    }

    this.searchedTracking = trackingNumber;

    const foundShipment =
      this.shipmentService.getShipmentByTracking(trackingNumber);

    if (!foundShipment) {
      this.shipment = null;
      this.timeline = [];
      return;
    }

    this.shipment = foundShipment;
    this.setTimeline(foundShipment);
  }

  setTimeline(shipment: Shipment) {

    const stages = [
      'Shipment Booked',
      'Picked Up',
      'Received at Warehouse',
      'In Transit',
      'Out for Delivery',
      'Delivered',
    ];

    const completedStages: Record<string, number> = {
      'Booked': 1,
      'In Transit': 4,
      'Delivered': 6,
      'Failed': 4,
    };

    const completedCount = completedStages[shipment.status] ?? 1;

    this.timeline = stages.map((title, index) => ({
      title,
      location: shipment.origin,
      date: index < completedCount ? shipment.bookingDate : 'Pending',
      time: index < completedCount ? 'Recorded' : 'Pending',
      description: index < completedCount
        ? 'Shipment progress recorded.'
        : 'This stage is pending.',
      completed: index < completedCount,
    }));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-700';
      case 'In Transit':
        return 'bg-purple-100 text-purple-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
