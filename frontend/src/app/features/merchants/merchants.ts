
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-merchants',
  imports: [FormsModule],
  templateUrl: './merchants.html',
  styleUrl: './merchants.css',
})
export class Merchants {

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

  searchTerm = '';
  statusFilter = 'All';
  showForm = false;

  newMerchant: Merchant = this.getEmptyMerchant();

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
        merchant.email.toLowerCase() === this.newMerchant.email.trim().toLowerCase()
    );

    if (duplicateEmail) {
      alert('This email is already registered.');
      return;
    }

    const merchant: Merchant = {
      ...this.newMerchant,
      merchant_id: Math.max(0, ...this.merchants.map(m => m.merchant_id)) + 1,
      name: this.newMerchant.name.trim(),
      contact_person: this.newMerchant.contact_person.trim(),
      email: this.newMerchant.email.trim(),
      phone: this.newMerchant.phone.trim(),
      address: this.newMerchant.address.trim(),
      city: this.newMerchant.city.trim()
    };

    this.merchants.unshift(merchant);
    this.closeForm();
  }

  toggleStatus(merchant: Merchant): void {
    merchant.is_active = !merchant.is_active;
  }
}
