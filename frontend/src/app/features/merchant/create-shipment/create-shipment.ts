
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-shipment',
  imports: [FormsModule],
  templateUrl: './create-shipment.html',
  styleUrl: './create-shipment.css',
})
export class CreateShipment {

  shipment = {
    customerName: '',
    customerPhone: '',
    pickupAddress: '',
    pickupCity: '',
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    parcelDescription: '',
    weight: '',
    paymentType: 'COD',
    codAmount: '',
    specialInstructions: '',
  };

  submitted = false;
  bookingSuccess = false;

  onSubmit(): void {
    this.submitted = true;
    this.bookingSuccess = false;

    if (!this.isFormValid()) {
      return;
    }

    this.bookingSuccess = true;

    console.log('Validated shipment details:', this.shipment);
  }

  isFormValid(): boolean {

    const phonePattern = /^03\d{9}$/;

    const requiredFields = [
      this.shipment.customerName,
      this.shipment.pickupAddress,
      this.shipment.pickupCity,
      this.shipment.receiverName,
      this.shipment.deliveryAddress,
      this.shipment.deliveryCity,
      this.shipment.parcelDescription,
    ];

    const fieldsFilled = requiredFields.every(
      field => field.trim().length > 0
    );

    const phonesValid =
      phonePattern.test(this.shipment.customerPhone) &&
      phonePattern.test(this.shipment.receiverPhone);

    const weightValid =
      this.shipment.weight.trim() !== '' &&
      Number.isFinite(Number(this.shipment.weight)) &&
      Number(this.shipment.weight) > 0;

    const codValid =
      this.shipment.paymentType !== 'COD' ||
      (
        this.shipment.codAmount.trim() !== '' &&
        Number.isFinite(Number(this.shipment.codAmount)) &&
        Number(this.shipment.codAmount) > 0
      );

    return fieldsFilled && phonesValid && weightValid && codValid;
  }

  isPhoneValid(phone: string): boolean {
    return /^03\d{9}$/.test(phone);
  }

  isWeightValid(): boolean {
    return (
      this.shipment.weight.trim() !== '' &&
      Number.isFinite(Number(this.shipment.weight)) &&
      Number(this.shipment.weight) > 0
    );
  }

  isCODValid(): boolean {
    return (
      this.shipment.codAmount.trim() !== '' &&
      Number.isFinite(Number(this.shipment.codAmount)) &&
      Number(this.shipment.codAmount) > 0
    );
  }

  resetForm(): void {
    this.shipment = {
      customerName: '',
      customerPhone: '',
      pickupAddress: '',
      pickupCity: '',
      receiverName: '',
      receiverPhone: '',
      deliveryAddress: '',
      deliveryCity: '',
      parcelDescription: '',
      weight: '',
      paymentType: 'COD',
      codAmount: '',
      specialInstructions: '',
    };

    this.submitted = false;
    this.bookingSuccess = false;
  }

}
