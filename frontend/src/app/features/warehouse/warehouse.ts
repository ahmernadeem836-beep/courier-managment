
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface WarehouseShipment {
  trackingNumber: string;
  merchant: string;
  origin: string;
  destination: string;
  receivedDate: string;
  warehouseLocation: string;
  status: string;
}

@Component({
  selector: 'app-warehouse',
  imports: [FormsModule],
  templateUrl: './warehouse.html',
  styleUrl: './warehouse.css',
})
export class Warehouse {

  searchTerm = '';
  selectedStatus = 'All';

  shipments: WarehouseShipment[] = [
    {
      trackingNumber: 'TRK10024567890123456',
      merchant: 'Tech Store',
      origin: 'Karachi',
      destination: 'Lahore',
      receivedDate: '2026-11-15',
      warehouseLocation: 'Shelf A-01',
      status: 'Received',
    },
    {
      trackingNumber: 'TRK10024567890123457',
      merchant: 'Fashion Hub',
      origin: 'Lahore',
      destination: 'Multan',
      receivedDate: '2026-11-15',
      warehouseLocation: 'Shelf B-02',
      status: 'Stored',
    },
    {
      trackingNumber: 'TRK10024567890123458',
      merchant: 'Mobile Zone',
      origin: 'Islamabad',
      destination: 'Faisalabad',
      receivedDate: '2026-11-16',
      warehouseLocation: 'Shelf C-01',
      status: 'Ready for Dispatch',
    },
    {
      trackingNumber: 'TRK10024567890123459',
      merchant: 'Beauty Store',
      origin: 'Multan',
      destination: 'Karachi',
      receivedDate: '2026-11-16',
      warehouseLocation: 'Not Assigned',
      status: 'In Transit',
    },
    {
      trackingNumber: 'TRK10024567890123460',
      merchant: 'Fast Electronics',
      origin: 'Lahore',
      destination: 'Islamabad',
      receivedDate: '2026-11-14',
      warehouseLocation: 'Dispatched',
      status: 'Dispatched',
    },
  ];

  get filteredShipments(): WarehouseShipment[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.shipments.filter(shipment => {

      const matchesSearch =
        shipment.trackingNumber.toLowerCase().includes(search) ||
        shipment.merchant.toLowerCase().includes(search) ||
        shipment.origin.toLowerCase().includes(search) ||
        shipment.destination.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        shipment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalShipments(): number {
    return this.shipments.length;
  }

  get incomingShipments(): number {
    return this.shipments.filter(
      shipment => shipment.status === 'In Transit'
    ).length;
  }

  get receivedShipments(): number {
    return this.shipments.filter(
      shipment => shipment.status === 'Received'
    ).length;
  }

  get storedShipments(): number {
    return this.shipments.filter(
      shipment =>
        shipment.status === 'Stored' ||
        shipment.status === 'Ready for Dispatch'
    ).length;
  }

  get dispatchedShipments(): number {
    return this.shipments.filter(
      shipment => shipment.status === 'Dispatched'
    ).length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Transit':
        return 'bg-amber-100 text-amber-700';

      case 'Received':
        return 'bg-blue-100 text-blue-700';

      case 'Stored':
        return 'bg-purple-100 text-purple-700';

      case 'Ready for Dispatch':
        return 'bg-indigo-100 text-indigo-700';

      case 'Dispatched':
        return 'bg-green-100 text-green-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  markAsReceived(trackingNumber: string): void {
    const shipment = this.findShipment(trackingNumber);

    if (shipment && shipment.status === 'In Transit') {
      shipment.status = 'Received';
      shipment.warehouseLocation = 'Not Assigned';
    }
  }

  storeShipment(trackingNumber: string): void {
    const shipment = this.findShipment(trackingNumber);

    if (!shipment || shipment.status !== 'Received') {
      return;
    }

    shipment.status = 'Stored';

    if (shipment.warehouseLocation === 'Not Assigned') {
      shipment.warehouseLocation = 'Shelf A-01';
    }
  }

  prepareForDispatch(trackingNumber: string): void {
    const shipment = this.findShipment(trackingNumber);

    if (shipment && shipment.status === 'Stored') {
      shipment.status = 'Ready for Dispatch';
    }
  }

  dispatchShipment(trackingNumber: string): void {
    const shipment = this.findShipment(trackingNumber);

    if (shipment && shipment.status === 'Ready for Dispatch') {
      shipment.status = 'Dispatched';
      shipment.warehouseLocation = 'Dispatched';
    }
  }

  private findShipment(
    trackingNumber: string
  ): WarehouseShipment | undefined {
    return this.shipments.find(
      shipment => shipment.trackingNumber === trackingNumber
    );
  }
}
