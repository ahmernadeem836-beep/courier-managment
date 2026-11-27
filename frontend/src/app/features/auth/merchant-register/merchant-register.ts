
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
interface MerchantApplicationResponse {
  message: string;
  status?: string;
}

@Component({
  selector: 'app-merchant-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './merchant-register.html',
  styleUrl: './merchant-register.css',
})
export class MerchantRegister {

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  private readonly apiUrl =
    'http://localhost:5000/api/merchant-applications';

  form = this.getEmptyForm();

  constructor(private http: HttpClient) {}

  private getEmptyForm() {
    return {
      businessName: '',
      businessType: '',
      businessCategory: '',
      website: '',
      socialMedia: '',
      registrationNumber: '',
      businessDescription: '',

      averageShipmentsPerDay: '',
      averageShipmentsPerMonth: '',
      currentCourierPartner: '',
      shippingCoverage: '',
      shippingCities: '',
      pickupRequired: '',
      pickupAddress: '',

      paymentMethod: '',
      expectedCodVolume: '',

      contactPerson: '',
      email: '',
      phone: '',
      alternatePhone: '',
      businessAddress: '',
      businessCity: '',

      returnAddress: '',
      returnCity: '',
      returnArea: '',
      returnContactPerson: '',
      returnContactNumber: '',

      password: '',
    };
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.form.shippingCoverage === 'Selected Cities' &&
      !this.form.shippingCities.trim()
    ) {
      this.errorMessage =
        'Please enter the cities where you want to ship.';
      return;
    }

    if (
      this.form.pickupRequired === 'Yes' &&
      !this.form.pickupAddress.trim()
    ) {
      this.errorMessage =
        'Please enter your pickup address.';
      return;
    }

    if (this.form.password.length < 8) {
      this.errorMessage =
        'Password must be at least 8 characters long.';
      return;
    }

    const payload = {
      ...this.form,

      businessName: this.form.businessName.trim(),
      businessType: this.form.businessType.trim(),
      businessCategory: this.form.businessCategory.trim(),

      website: this.form.website.trim(),
      socialMediaLink: this.form.socialMedia.trim(),
      registrationNumber: this.form.registrationNumber.trim(),
      businessDescription: this.form.businessDescription.trim(),

      averageShipmentsPerDay:
        this.form.averageShipmentsPerDay.trim(),

      averageShipmentsPerMonth:
        this.form.averageShipmentsPerMonth.trim(),

      currentCourierPartner:
        this.form.currentCourierPartner.trim(),

      shippingCoverage: this.form.shippingCoverage.trim(),

      shippingCities: this.form.shippingCities
        .split(',')
        .map(city => city.trim())
        .filter(city => city.length > 0),

      pickupRequired: this.form.pickupRequired === 'Yes',

      pickupAddress:
        this.form.pickupRequired === 'Yes'
          ? this.form.pickupAddress.trim()
          : '',

      paymentMethod: this.form.paymentMethod.trim(),
      expectedCodVolume: this.form.expectedCodVolume.trim(),

      contactPerson: this.form.contactPerson.trim(),
      email: this.form.email.trim().toLowerCase(),
      phone: this.form.phone.trim(),
      alternatePhone: this.form.alternatePhone.trim(),

      businessAddress: this.form.businessAddress.trim(),
      businessCity: this.form.businessCity.trim(),

      returnAddress: this.form.returnAddress.trim(),
      returnCity: this.form.returnCity.trim(),
      returnArea: this.form.returnArea.trim(),
      returnContactPerson:
        this.form.returnContactPerson.trim(),

      returnContactNumber:
        this.form.returnContactNumber.trim(),

      password: this.form.password,
    };

    
this.isSubmitting = true;

this.http
  .post<MerchantApplicationResponse>(this.apiUrl, payload)
  .pipe(
    finalize(() => {
      this.isSubmitting = false;
    })
  )
  .subscribe({
    next: (response) => {
      this.successMessage = response.message;
      this.form = this.getEmptyForm();
    },

    error: (error) => {
      this.errorMessage =
        error.error?.message ||
        'Unable to submit your application. Please try again.';
    },
  });

  }
}
