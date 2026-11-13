
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShipmentService } from '../../core/services/shipment';

@Component({
  selector: 'app-shipments',
  imports: [FormsModule, RouterLink],
  templateUrl: './shipments.html',
  styleUrl: './shipments.css',
})
export class Shipments {

  constructor(private shipmentService: ShipmentService) {
  this.shipments = this.shipmentService.getShipments();
}
  showCreateForm = false;

  shipment = {
    merchant: '',
    customer: '',
    originBranch: '',
    destinationBranch: '',
    description: '',
    weight: '',
    codAmount: '',
    shippingCharges: '',
    expectedDelivery: '',
  };

  // Shared shipment data
shipments: ReturnType<ShipmentService['getShipments']> = [];
  // Search and filter
  searchTerm = '';
  selectedStatus = 'All';

  get filteredShipments() {
    return this.shipments.filter((shipment) => {
      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        shipment.tracking.toLowerCase().includes(search) ||
        shipment.customer.toLowerCase().includes(search) ||
        shipment.merchant.toLowerCase().includes(search) ||
        shipment.origin.toLowerCase().includes(search) ||
        shipment.destination.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        shipment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
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

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  createShipment() {
    console.log('Shipment Form Data:', this.shipment);

    alert('Shipment form submitted! Backend integration will be added later.');

    this.closeCreateForm();
  }
}
