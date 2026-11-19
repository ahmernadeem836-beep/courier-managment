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

  shipments: ReturnType<ShipmentService['getShipments']> = [];

  // Search and filters
  searchTerm = '';
  selectedStatus = 'All';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  get filteredShipments() {
    const search = this.searchTerm.toLowerCase().trim();

    return this.shipments.filter((shipment) => {
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

  get totalShipments(): number {
    return this.shipments.length;
  }

  get bookedShipments(): number {
    return this.shipments.filter(
      shipment => shipment.status === 'Booked'
    ).length;
  }

  get inTransitShipments(): number {
    return this.shipments.filter(
      shipment => shipment.status === 'In Transit'
    ).length;
  }

  get deliveredShipments(): number {
    return this.shipments.filter(
      shipment => shipment.status === 'Delivered'
    ).length;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredShipments.length / this.pageSize);
  }

  get paginatedShipments() {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredShipments.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get startRecord(): number {
    if (this.filteredShipments.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredShipments.length
    );
  }

  get pageNumbers(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );
  }

  onFiltersChanged(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
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

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createShipment(): void {
    console.log('Shipment Form Data:', this.shipment);

    alert(
      'Shipment form submitted! Backend integration will be added later.'
    );

    this.closeCreateForm();
  }
}