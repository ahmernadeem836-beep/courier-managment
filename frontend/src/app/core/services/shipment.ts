
import { Injectable } from '@angular/core';

export interface Shipment {
  tracking: string;
  customer: string;
  merchant: string;
  origin: string;
  destination: string;
  date: string;
  bookingDate: string;
  expectedDelivery: string;
  weight: string;
  paymentType: string;
  amount: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {

  private shipments: Shipment[] = [
    {
      tracking: 'TRK17945644896841213',
      customer: 'Test User',
      merchant: 'Fast Electronics',
      origin: 'Lahore Main Branch',
      destination: 'Islamabad Branch',
      date: '13 Nov 2026',
      bookingDate: '13 Nov 2026',
      expectedDelivery: '16 Nov 2026',
      weight: '2.5 KG',
      paymentType: 'Cash on Delivery',
      amount: 'Rs. 12,500',
      status: 'Booked',
    },
    {
      tracking: 'TRK10024567890123456',
      customer: 'Ahmed Khan',
      merchant: 'Tech Store',
      origin: 'Karachi',
      destination: 'Lahore',
      date: '12 Nov 2026',
      bookingDate: '12 Nov 2026',
      expectedDelivery: '15 Nov 2026',
      weight: '1.5 KG',
      paymentType: 'Cash on Delivery',
      amount: 'Rs. 8,500',
      status: 'In Transit',
    },
    {
      tracking: 'TRK10024567890123457',
      customer: 'Sara Ali',
      merchant: 'Fashion Hub',
      origin: 'Lahore',
      destination: 'Multan',
      date: '12 Nov 2026',
      bookingDate: '12 Nov 2026',
      expectedDelivery: '15 Nov 2026',
      weight: '1 KG',
      paymentType: 'Prepaid',
      amount: 'Rs. 3,200',
      status: 'Delivered',
    },
    {
      tracking: 'TRK10024567890123458',
      customer: 'Usman Malik',
      merchant: 'Mobile Zone',
      origin: 'Islamabad',
      destination: 'Faisalabad',
      date: '11 Nov 2026',
      bookingDate: '11 Nov 2026',
      expectedDelivery: '14 Nov 2026',
      weight: '3 KG',
      paymentType: 'Cash on Delivery',
      amount: 'Rs. 15,000',
      status: 'Failed',
    },
    {
      tracking: 'TRK10024567890123459',
      customer: 'Ayesha Noor',
      merchant: 'Beauty Store',
      origin: 'Multan',
      destination: 'Karachi',
      date: '10 Nov 2026',
      bookingDate: '10 Nov 2026',
      expectedDelivery: '14 Nov 2026',
      weight: '0.8 KG',
      paymentType: 'Prepaid',
      amount: 'Rs. 2,500',
      status: 'In Transit',
    },
  ];

  getShipments(): Shipment[] {
    return this.shipments;
  }

  getShipmentByTracking(trackingNumber: string): Shipment | undefined {
    return this.shipments.find(
      shipment =>
        shipment.tracking.toLowerCase() === trackingNumber.toLowerCase()
    );
  }

  updateShipmentStatus(trackingNumber: string, status: string): boolean {
    const shipment = this.getShipmentByTracking(trackingNumber);

    if (!shipment) {
      return false;
    }

    shipment.status = status;
    return true;
  }
}
