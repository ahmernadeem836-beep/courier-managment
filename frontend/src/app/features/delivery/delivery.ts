
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Delivery {
  deliveryId: string;
  trackingNumber: string;
  customer: string;
  destination: string;
  rider: string;
  assignedDate: string;
  attempts: number;
  status: string;
}

@Component({
  selector: 'app-delivery',
  imports: [FormsModule],
  templateUrl: './delivery.html',
  styleUrl: './delivery.css',
})
export class delivery {

  searchTerm = '';
  selectedStatus = 'All';
  showDeliveryForm = false;

  deliveryForm = {
    trackingNumber: '',
    customer: '',
    destination: '',
    rider: '',
    assignedDate: '',
  };

  deliveries: Delivery[] = [
    {
      deliveryId: 'DLV-1001',
      trackingNumber: 'TRK10024567890123456',
      customer: 'Ahmed Khan',
      destination: 'DHA Phase 5, Lahore',
      rider: 'Ali Ahmed',
      assignedDate: '2026-11-16',
      attempts: 0,
      status: 'Assigned',
    },
    {
      deliveryId: 'DLV-1002',
      trackingNumber: 'TRK10024567890123457',
      customer: 'Sara Ali',
      destination: 'Johar Town, Lahore',
      rider: 'Usman Malik',
      assignedDate: '2026-11-16',
      attempts: 1,
      status: 'Out for Delivery',
    },
    {
      deliveryId: 'DLV-1003',
      trackingNumber: 'TRK10024567890123458',
      customer: 'Usman Malik',
      destination: 'Gulberg, Lahore',
      rider: 'Not Assigned',
      assignedDate: '2026-11-17',
      attempts: 0,
      status: 'Pending',
    },
    {
      deliveryId: 'DLV-1004',
      trackingNumber: 'TRK10024567890123459',
      customer: 'Ayesha Noor',
      destination: 'Model Town, Lahore',
      rider: 'Ahmed Khan',
      assignedDate: '2026-11-15',
      attempts: 2,
      status: 'Failed',
    },
  ];

  get filteredDeliveries(): Delivery[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.deliveries.filter(delivery => {
      const matchesSearch =
        delivery.deliveryId.toLowerCase().includes(search) ||
        delivery.trackingNumber.toLowerCase().includes(search) ||
        delivery.customer.toLowerCase().includes(search) ||
        delivery.destination.toLowerCase().includes(search) ||
        delivery.rider.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        delivery.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalDeliveries(): number {
    return this.deliveries.length;
  }

  get pendingDeliveries(): number {
    return this.deliveries.filter(d => d.status === 'Pending').length;
  }

  get activeDeliveries(): number {
    return this.deliveries.filter(
      d => d.status === 'Assigned' || d.status === 'Out for Delivery'
    ).length;
  }

  get completedDeliveries(): number {
    return this.deliveries.filter(d => d.status === 'Delivered').length;
  }

  get failedDeliveries(): number {
    return this.deliveries.filter(d => d.status === 'Failed').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  openDeliveryForm(): void {
    this.showDeliveryForm = true;
  }

  closeDeliveryForm(): void {
    this.showDeliveryForm = false;
  }

  createDelivery(): void {
    if (
      !this.deliveryForm.trackingNumber.trim() ||
      !this.deliveryForm.customer.trim() ||
      !this.deliveryForm.destination.trim() ||
      !this.deliveryForm.assignedDate
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newDelivery: Delivery = {
      deliveryId: `DLV-${1001 + this.deliveries.length}`,
      trackingNumber: this.deliveryForm.trackingNumber,
      customer: this.deliveryForm.customer,
      destination: this.deliveryForm.destination,
      rider: this.deliveryForm.rider || 'Not Assigned',
      assignedDate: this.deliveryForm.assignedDate,
      attempts: 0,
      status: this.deliveryForm.rider ? 'Assigned' : 'Pending',
    };

    this.deliveries.unshift(newDelivery);

    this.deliveryForm = {
      trackingNumber: '',
      customer: '',
      destination: '',
      rider: '',
      assignedDate: '',
    };

    this.closeDeliveryForm();
  }

  assignRider(deliveryId: string, rider: string): void {
    const delivery = this.deliveries.find(d => d.deliveryId === deliveryId);

    if (!delivery || delivery.status === 'Delivered') return;

    delivery.rider = rider;

    if (rider !== 'Not Assigned' && delivery.status === 'Pending') {
      delivery.status = 'Assigned';
    }

    if (rider === 'Not Assigned' && delivery.status === 'Assigned') {
      delivery.status = 'Pending';
    }
  }

  startDelivery(deliveryId: string): void {
    const delivery = this.deliveries.find(d => d.deliveryId === deliveryId);

    if (!delivery || delivery.status !== 'Assigned') return;

    if (delivery.rider === 'Not Assigned') {
      alert('Please assign a rider first.');
      return;
    }

    delivery.status = 'Out for Delivery';
  }

  markDelivered(deliveryId: string): void {
    const delivery = this.deliveries.find(d => d.deliveryId === deliveryId);

    if (delivery && delivery.status === 'Out for Delivery') {
      delivery.status = 'Delivered';
    }
  }

  markFailed(deliveryId: string): void {
    const delivery = this.deliveries.find(d => d.deliveryId === deliveryId);

    if (delivery && delivery.status === 'Out for Delivery') {
      delivery.attempts++;
      delivery.status = 'Failed';
    }
  }

  retryDelivery(deliveryId: string): void {
    const delivery = this.deliveries.find(d => d.deliveryId === deliveryId);

    if (!delivery || delivery.status !== 'Failed') return;

    if (delivery.rider === 'Not Assigned') {
      alert('Please assign a rider before retrying.');
      return;
    }

    delivery.status = 'Assigned';
  }
}
