
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MerchantApplication {
  id: number;
  businessName: string;
  businessType: string;
  businessCategory: string;
  website: string;
  socialMedia: string;
  registrationNumber: string;
  businessDescription: string;

  averageShipmentsPerDay: string;
  averageShipmentsPerMonth: string;
  currentCourierPartner: string;
  shippingCoverage: string;
  shippingCities: string;
  pickupRequired: string;
  pickupAddress: string;

  paymentMethod: string;
  expectedCodVolume: string;

  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone: string;
  businessAddress: string;
  businessCity: string;

  returnAddress: string;
  returnCity: string;
  returnArea: string;
  returnContactPerson: string;
  returnContactNumber: string;

  status: 'Pending Approval';
  submittedAt: string;
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

  form = this.getEmptyForm();

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
      this.errorMessage = 'Please enter your pickup address.';
      return;
    }

    let applications: MerchantApplication[] = [];

    try {
      applications = JSON.parse(
        localStorage.getItem('merchant_applications') || '[]'
      );
    } catch {
      this.errorMessage =
        'Unable to read saved applications. Please try again.';
      return;
    }

    const email = this.form.email.trim().toLowerCase();

    const emailExists = applications.some(
      application => application.email.toLowerCase() === email
    );

    if (emailExists) {
      this.errorMessage =
        'An application with this email already exists.';
      return;
    }

    const application: MerchantApplication = {
      ...this.form,
      businessName: this.form.businessName.trim(),
      businessDescription: this.form.businessDescription.trim(),
      contactPerson: this.form.contactPerson.trim(),
      email,
      phone: this.form.phone.trim(),
      businessAddress: this.form.businessAddress.trim(),
      businessCity: this.form.businessCity.trim(),
      returnAddress: this.form.returnAddress.trim(),
      returnCity: this.form.returnCity.trim(),
      returnArea: this.form.returnArea.trim(),
      returnContactPerson: this.form.returnContactPerson.trim(),
      returnContactNumber: this.form.returnContactNumber.trim(),
      status: 'Pending Approval',
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };

    try {
      applications.push(application);

      localStorage.setItem(
        'merchant_applications',
        JSON.stringify(applications)
      );

      this.successMessage =
        'Your merchant application has been submitted successfully. It is now pending admin approval.';

      this.form = this.getEmptyForm();

    } catch {
      this.errorMessage =
        'Your application could not be saved. Please try again.';
    }
  }
}
