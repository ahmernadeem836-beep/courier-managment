
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ReturnRequest {
  returnId: string;
  trackingNumber: string;
  customer: string;
  merchant: string;
  reason: string;
  requestDate: string;
  status: string;
}

@Component({
  selector: 'app-returns',
  imports: [FormsModule],
  templateUrl: './returns.html',
  styleUrl: './returns.css',
})
export class Returns {

  searchTerm = '';
  selectedStatus = 'All';
  showReturnForm = false;

  returnForm = {
    trackingNumber: '',
    customer: '',
    merchant: '',
    reason: '',
  };

  returns: ReturnRequest[] = [
    {
      returnId: 'RET-1001',
      trackingNumber: 'TRK10024567890123456',
      customer: 'Ahmed Khan',
      merchant: 'Tech Store',
      reason: 'Customer Refused',
      requestDate: '2026-11-15',
      status: 'Requested',
    },
    {
      returnId: 'RET-1002',
      trackingNumber: 'TRK10024567890123457',
      customer: 'Sara Ali',
      merchant: 'Fashion Hub',
      reason: 'Wrong Item',
      requestDate: '2026-11-14',
      status: 'Approved',
    },
    {
      returnId: 'RET-1003',
      trackingNumber: 'TRK10024567890123458',
      customer: 'Usman Malik',
      merchant: 'Mobile Zone',
      reason: 'Damaged Item',
      requestDate: '2026-11-13',
      status: 'In Transit',
    },
    {
      returnId: 'RET-1004',
      trackingNumber: 'TRK10024567890123459',
      customer: 'Ayesha Noor',
      merchant: 'Beauty Store',
      reason: 'Customer Changed Mind',
      requestDate: '2026-11-12',
      status: 'Received',
    },
  ];

  get filteredReturns(): ReturnRequest[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.returns.filter(item => {
      const matchesSearch =
        item.returnId.toLowerCase().includes(search) ||
        item.trackingNumber.toLowerCase().includes(search) ||
        item.customer.toLowerCase().includes(search) ||
        item.merchant.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        item.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalReturns(): number {
    return this.returns.length;
  }

  get requestedReturns(): number {
    return this.returns.filter(r => r.status === 'Requested').length;
  }

  get approvedReturns(): number {
    return this.returns.filter(r => r.status === 'Approved').length;
  }

  get inTransitReturns(): number {
    return this.returns.filter(r => r.status === 'In Transit').length;
  }

  get receivedReturns(): number {
    return this.returns.filter(r => r.status === 'Received').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Requested':
        return 'bg-amber-100 text-amber-700';
      case 'Approved':
        return 'bg-blue-100 text-blue-700';
      case 'In Transit':
        return 'bg-purple-100 text-purple-700';
      case 'Received':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  openReturnForm(): void {
    this.showReturnForm = true;
  }

  closeReturnForm(): void {
    this.showReturnForm = false;
  }

  createReturn(): void {
    if (
      !this.returnForm.trackingNumber.trim() ||
      !this.returnForm.customer.trim() ||
      !this.returnForm.merchant.trim() ||
      !this.returnForm.reason
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newReturn: ReturnRequest = {
      returnId: `RET-${1001 + this.returns.length}`,
      trackingNumber: this.returnForm.trackingNumber,
      customer: this.returnForm.customer,
      merchant: this.returnForm.merchant,
      reason: this.returnForm.reason,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
    };

    this.returns.unshift(newReturn);

    this.returnForm = {
      trackingNumber: '',
      customer: '',
      merchant: '',
      reason: '',
    };

    this.closeReturnForm();
  }

  approveReturn(returnId: string): void {
    const item = this.returns.find(r => r.returnId === returnId);
    if (item && item.status === 'Requested') {
      item.status = 'Approved';
    }
  }

  rejectReturn(returnId: string): void {
    const item = this.returns.find(r => r.returnId === returnId);
    if (item && item.status === 'Requested') {
      item.status = 'Rejected';
    }
  }

  markInTransit(returnId: string): void {
    const item = this.returns.find(r => r.returnId === returnId);
    if (item && item.status === 'Approved') {
      item.status = 'In Transit';
    }
  }

  markReceived(returnId: string): void {
    const item = this.returns.find(r => r.returnId === returnId);
    if (item && item.status === 'In Transit') {
      item.status = 'Received';
    }
  }
}
