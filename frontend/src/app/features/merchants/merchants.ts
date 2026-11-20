import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface Merchant {
  merchant_id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  is_active: boolean;
}

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
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  submittedAt: string;
}

@Component({
  selector: 'app-merchants',
  imports: [FormsModule, DatePipe],
  templateUrl: './merchants.html',
  styleUrl: './merchants.css',
})
export class Merchants implements OnInit {

  merchants: Merchant[] = [
    {
      merchant_id: 1,
      name: 'Tech Store',
      contact_person: 'Ahmed Khan',
      email: 'ahmed@techstore.com',
      phone: '03001234567',
      address: 'Gulberg Main Boulevard',
      city: 'Lahore',
      is_active: true
    },
    {
      merchant_id: 2,
      name: 'Fashion Hub',
      contact_person: 'Usman Ali',
      email: 'usman@fashionhub.com',
      phone: '03007654321',
      address: 'DHA Phase 5',
      city: 'Lahore',
      is_active: true
    },
    {
      merchant_id: 3,
      name: 'Electro World',
      contact_person: 'Hassan Raza',
      email: 'hassan@electroworld.com',
      phone: '03111234567',
      address: 'Blue Area',
      city: 'Islamabad',
      is_active: false
    }
  ];

  applications: MerchantApplication[] = [];

  searchTerm = '';
  statusFilter = 'All';
  showForm = false;

  showApplicationDetails = false;
  selectedApplication: MerchantApplication | null = null;

  newMerchant: Merchant = this.getEmptyMerchant();

  ngOnInit(): void {
    this.loadMerchants();
    this.loadApplications();
  }

  loadMerchants(): void {
    try {
      const saved = localStorage.getItem('admin_merchants');

      if (saved) {
        this.merchants = JSON.parse(saved);
      }
    } catch {
      console.error('Unable to load merchants.');
    }
  }

  loadApplications(): void {
    try {
      this.applications = JSON.parse(
        localStorage.getItem('merchant_applications') || '[]'
      );
    } catch {
      this.applications = [];
      console.error('Unable to load merchant applications.');
    }
  }

  saveApplications(): void {
    localStorage.setItem(
      'merchant_applications',
      JSON.stringify(this.applications)
    );
  }

  saveMerchants(): void {
    localStorage.setItem(
      'admin_merchants',
      JSON.stringify(this.merchants)
    );
  }

  get pendingApplications(): MerchantApplication[] {
    return this.applications.filter(
      application => application.status === 'Pending Approval'
    );
  }

  get pendingCount(): number {
    return this.pendingApplications.length;
  }

  get totalMerchants(): number {
    return this.merchants.length;
  }

  get activeMerchants(): number {
    return this.merchants.filter(m => m.is_active).length;
  }

  get inactiveMerchants(): number {
    return this.merchants.filter(m => !m.is_active).length;
  }

  get filteredMerchants(): Merchant[] {
    return this.merchants.filter(merchant => {
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
        merchant.name.toLowerCase().includes(search) ||
        merchant.contact_person.toLowerCase().includes(search) ||
        merchant.email.toLowerCase().includes(search) ||
        merchant.city.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'Active' && merchant.is_active) ||
        (this.statusFilter === 'Inactive' && !merchant.is_active);

      return matchesSearch && matchesStatus;
    });
  }

  viewApplication(application: MerchantApplication): void {
    this.selectedApplication = application;
    this.showApplicationDetails = true;
  }

  closeApplicationDetails(): void {
    this.selectedApplication = null;
    this.showApplicationDetails = false;
  }

  approveApplication(application: MerchantApplication): void {
    const alreadyExists = this.merchants.some(
      merchant =>
        merchant.email.toLowerCase() ===
        application.email.toLowerCase()
    );

    if (alreadyExists) {
      alert('A merchant with this email already exists.');
      return;
    }

    const merchant: Merchant = {
      merchant_id:
        Math.max(0, ...this.merchants.map(m => m.merchant_id)) + 1,

      name: application.businessName,
      contact_person: application.contactPerson,
      email: application.email,
      phone: application.phone,
      address: application.businessAddress,
      city: application.businessCity,
      is_active: true
    };

    this.merchants.unshift(merchant);

    application.status = 'Approved';

    this.saveMerchants();
    this.saveApplications();

    this.closeApplicationDetails();

    alert('Merchant application approved successfully.');
  }

  rejectApplication(application: MerchantApplication): void {
    const confirmed = confirm(
      `Are you sure you want to reject ${application.businessName}?`
    );

    if (!confirmed) {
      return;
    }

    application.status = 'Rejected';

    this.saveApplications();

    this.closeApplicationDetails();

    alert('Merchant application rejected.');
  }

  getEmptyMerchant(): Merchant {
    return {
      merchant_id: 0,
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      is_active: true
    };
  }

  openForm(): void {
    this.newMerchant = this.getEmptyMerchant();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  addMerchant(): void {
    if (
      !this.newMerchant.name.trim() ||
      !this.newMerchant.contact_person.trim() ||
      !this.newMerchant.email.trim() ||
      !this.newMerchant.phone.trim() ||
      !this.newMerchant.address.trim() ||
      !this.newMerchant.city.trim()
    ) {
      return;
    }

    const duplicateEmail = this.merchants.some(
      merchant =>
        merchant.email.toLowerCase() ===
        this.newMerchant.email.trim().toLowerCase()
    );

    if (duplicateEmail) {
      alert('This email is already registered.');
      return;
    }

    const merchant: Merchant = {
      ...this.newMerchant,
      merchant_id:
        Math.max(0, ...this.merchants.map(m => m.merchant_id)) + 1
    };

    this.merchants.unshift(merchant);

    this.saveMerchants();
    this.closeForm();
  }

  toggleStatus(merchant: Merchant): void {
    merchant.is_active = !merchant.is_active;
    this.saveMerchants();
  }
}
