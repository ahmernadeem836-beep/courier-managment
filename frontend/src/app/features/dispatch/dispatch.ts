
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Dispatch {
  dispatchId: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  vehicle: string;
  rider: string;
  dispatchDate: string;
  status: string;
}

@Component({
  selector: 'app-dispatch',
  imports: [FormsModule],
  templateUrl: './dispatch.html',
  styleUrl: './dispatch.css',
})
export class dispatch {

  searchTerm = '';
  selectedStatus = 'All';
  showDispatchForm = false;

  dispatchForm = {
    trackingNumber: '',
    origin: '',
    destination: '',
    vehicle: '',
    rider: '',
    dispatchDate: '',
  };

  dispatches: Dispatch[] = [
    {
      dispatchId: 'DSP-1001',
      trackingNumber: 'TRK10024567890123458',
      origin: 'Lahore Main Branch',
      destination: 'Islamabad Branch',
      vehicle: 'LEA-1234',
      rider: 'Ali Ahmed',
      dispatchDate: '2026-11-16',
      status: 'Dispatched',
    },
    {
      dispatchId: 'DSP-1002',
      trackingNumber: 'TRK10024567890123460',
      origin: 'Lahore Main Branch',
      destination: 'Islamabad Branch',
      vehicle: 'LEB-5678',
      rider: 'Usman Malik',
      dispatchDate: '2026-11-16',
      status: 'In Transit',
    },
    {
      dispatchId: 'DSP-1003',
      trackingNumber: 'TRK10024567890123461',
      origin: 'Karachi Branch',
      destination: 'Lahore Branch',
      vehicle: 'Not Assigned',
      rider: 'Not Assigned',
      dispatchDate: '2026-11-17',
      status: 'Pending',
    },
  ];

  get filteredDispatches(): Dispatch[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.dispatches.filter(dispatch => {
      const matchesSearch =
        dispatch.dispatchId.toLowerCase().includes(search) ||
        dispatch.trackingNumber.toLowerCase().includes(search) ||
        dispatch.origin.toLowerCase().includes(search) ||
        dispatch.destination.toLowerCase().includes(search) ||
        dispatch.rider.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        dispatch.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalDispatches(): number {
    return this.dispatches.length;
  }

  get pendingDispatches(): number {
    return this.dispatches.filter(d => d.status === 'Pending').length;
  }

  get dispatchedCount(): number {
    return this.dispatches.filter(d => d.status === 'Dispatched').length;
  }

  get inTransitCount(): number {
    return this.dispatches.filter(d => d.status === 'In Transit').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-700';
      case 'In Transit':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  openDispatchForm(): void {
    this.showDispatchForm = true;
  }

  closeDispatchForm(): void {
    this.showDispatchForm = false;
  }

  createDispatch(): void {
    if (
      !this.dispatchForm.trackingNumber.trim() ||
      !this.dispatchForm.origin.trim() ||
      !this.dispatchForm.destination.trim() ||
      !this.dispatchForm.dispatchDate
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newDispatch: Dispatch = {
      dispatchId: `DSP-${1001 + this.dispatches.length}`,
      trackingNumber: this.dispatchForm.trackingNumber,
      origin: this.dispatchForm.origin,
      destination: this.dispatchForm.destination,
      vehicle: this.dispatchForm.vehicle || 'Not Assigned',
      rider: this.dispatchForm.rider || 'Not Assigned',
      dispatchDate: this.dispatchForm.dispatchDate,
      status: 'Pending',
    };

    this.dispatches.unshift(newDispatch);

    this.dispatchForm = {
      trackingNumber: '',
      origin: '',
      destination: '',
      vehicle: '',
      rider: '',
      dispatchDate: '',
    };

    this.closeDispatchForm();
  }

  confirmDispatch(dispatchId: string): void {
    const dispatch = this.dispatches.find(d => d.dispatchId === dispatchId);

    if (!dispatch) return;

    if (dispatch.vehicle === 'Not Assigned' || dispatch.rider === 'Not Assigned') {
      alert('Please assign a vehicle and rider first.');
      return;
    }

    dispatch.status = 'Dispatched';
  }

  markInTransit(dispatchId: string): void {
    const dispatch = this.dispatches.find(d => d.dispatchId === dispatchId);

    if (dispatch && dispatch.status === 'Dispatched') {
      dispatch.status = 'In Transit';
    }
  }
}
