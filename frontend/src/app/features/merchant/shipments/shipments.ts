import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-merchant-shipments',
  imports: [FormsModule, RouterLink],
  templateUrl: './shipments.html',
  styleUrl: './shipments.css',
})
export class Shipments {

  searchTerm = '';
  selectedStatus = 'All';

  shipments = [
    {
      tracking: 'TRK17945644896841213',
      receiver: 'Ali Ahmed',
      destination: 'Islamabad',
      date: '18 Nov 2026',
      amount: 12500,
      status: 'Booked',
    },
    {
      tracking: 'TRK10024567890123456',
      receiver: 'Sara Khan',
      destination: 'Karachi',
      date: '17 Nov 2026',
      amount: 8500,
      status: 'In Transit',
    },
    {
      tracking: 'TRK10024567890123457',
      receiver: 'Usman Malik',
      destination: 'Multan',
      date: '16 Nov 2026',
      amount: 3200,
      status: 'Delivered',
    },
    {
      tracking: 'TRK10024567890123458',
      receiver: 'Ayesha Noor',
      destination: 'Faisalabad',
      date: '15 Nov 2026',
      amount: 5000,
      status: 'Pending Pickup',
    },
    {
      tracking: 'TRK10024567890123459',
      receiver: 'Hamza Ali',
      destination: 'Lahore',
      date: '14 Nov 2026',
      amount: 7200,
      status: 'Cancelled',
    },
  ];

  get filteredShipments() {
    return this.shipments.filter(shipment => {
      const matchesSearch =
        shipment.tracking.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        shipment.receiver.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' ||
        shipment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }
}