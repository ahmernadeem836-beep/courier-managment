
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Pickup {
  requestId: string;
  merchant: string;
  contact: string;
  address: string;
  scheduledDate: string;
  rider: string;
  status: string;
}

@Component({
  selector: 'app-pickups',
  imports: [FormsModule],
  templateUrl: './pickups.html',
  styleUrl: './pickups.css',
})
export class Pickups {

  searchTerm = '';
  selectedStatus = 'All';
  showCreateForm = false;

  pickup = {
    merchant: '',
    contact: '',
    address: '',
    scheduledDate: '',
    rider: '',
  };

  pickups: Pickup[] = [
    {
      requestId: 'PCK-1001',
      merchant: 'Fast Electronics',
      contact: '03001234567',
      address: 'Gulberg, Lahore',
      scheduledDate: '2026-11-16',
      rider: 'Ali Ahmed',
      status: 'Pending',
    },
    {
      requestId: 'PCK-1002',
      merchant: 'Tech Store',
      contact: '03111234567',
      address: 'DHA Phase 5, Lahore',
      scheduledDate: '2026-11-16',
      rider: 'Usman Malik',
      status: 'Scheduled',
    },
    {
      requestId: 'PCK-1003',
      merchant: 'Fashion Hub',
      contact: '03221234567',
      address: 'Johar Town, Lahore',
      scheduledDate: '2026-11-15',
      rider: 'Ahmed Khan',
      status: 'Picked Up',
    },
    {
      requestId: 'PCK-1004',
      merchant: 'Beauty Store',
      contact: '03331234567',
      address: 'Model Town, Lahore',
      scheduledDate: '2026-11-17',
      rider: 'Not Assigned',
      status: 'Pending',
    },
  ];

  get filteredPickups(): Pickup[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.pickups.filter(pickup => {
      const matchesSearch =
        pickup.requestId.toLowerCase().includes(search) ||
        pickup.merchant.toLowerCase().includes(search) ||
        pickup.contact.includes(search) ||
        pickup.address.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        pickup.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalPickups(): number {
    return this.pickups.length;
  }

  get pendingPickups(): number {
    return this.pickups.filter(p => p.status === 'Pending').length;
  }

  get scheduledPickups(): number {
    return this.pickups.filter(p => p.status === 'Scheduled').length;
  }

  get completedPickups(): number {
    return this.pickups.filter(p => p.status === 'Picked Up').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Picked Up':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
  markAsPickedUp(requestId: string): void {
  const pickup = this.pickups.find(
    item => item.requestId === requestId
  );

  if (pickup) {
    pickup.status = 'Picked Up';
  }

  
}

schedulePickup(requestId: string): void {
  const pickup = this.pickups.find(
    item => item.requestId === requestId
  );

  if (!pickup) {
    return;
  }

  if (pickup.rider === 'Not Assigned') {
    alert('Please assign a rider first.');
    return;
  }

  if (!pickup.scheduledDate) {
    alert('Please select a pickup date first.');
    return;
  }

  pickup.status = 'Scheduled';
}

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createPickup(): void {
    if (
      !this.pickup.merchant.trim() ||
      !this.pickup.contact.trim() ||
      !this.pickup.address.trim() ||
      !this.pickup.scheduledDate
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newPickup: Pickup = {
      requestId: `PCK-${1001 + this.pickups.length}`,
      merchant: this.pickup.merchant,
      contact: this.pickup.contact,
      address: this.pickup.address,
      scheduledDate: this.pickup.scheduledDate,
      rider: this.pickup.rider || 'Not Assigned',
      status: 'Pending',
    };

    this.pickups.unshift(newPickup);

    this.pickup = {
      merchant: '',
      contact: '',
      address: '',
      scheduledDate: '',
      rider: '',
    };

    this.closeCreateForm();
  }
}
