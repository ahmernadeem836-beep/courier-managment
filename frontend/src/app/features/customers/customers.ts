
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Customer {
  customer_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  is_active: boolean;
}

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {

  customers: Customer[] = [
    {
      customer_id: 1,
      full_name: 'Ali Ahmed',
      email: 'ali@example.com',
      phone: '03001234567',
      address: 'Model Town',
      city: 'Lahore',
      is_active: true
    },
    {
      customer_id: 2,
      full_name: 'Usman Khan',
      email: 'usman@example.com',
      phone: '03007654321',
      address: 'Gulberg',
      city: 'Lahore',
      is_active: true
    },
    {
      customer_id: 3,
      full_name: 'Hassan Raza',
      email: 'hassan@example.com',
      phone: '03111234567',
      address: 'Blue Area',
      city: 'Islamabad',
      is_active: false
    }
  ];

  searchTerm = '';
  statusFilter = 'All';
  showForm = false;

  newCustomer: Customer = this.getEmptyCustomer();

  get totalCustomers(): number {
    return this.customers.length;
  }

  get activeCustomers(): number {
    return this.customers.filter(c => c.is_active).length;
  }

  get inactiveCustomers(): number {
    return this.customers.filter(c => !c.is_active).length;
  }

  get filteredCustomers(): Customer[] {
    return this.customers.filter(customer => {
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
        customer.full_name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search) ||
        customer.city.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'Active' && customer.is_active) ||
        (this.statusFilter === 'Inactive' && !customer.is_active);

      return matchesSearch && matchesStatus;
    });
  }

  getEmptyCustomer(): Customer {
    return {
      customer_id: 0,
      full_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      is_active: true
    };
  }

  openForm(): void {
    this.newCustomer = this.getEmptyCustomer();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  addCustomer(): void {
    if (
      !this.newCustomer.full_name.trim() ||
      !this.newCustomer.phone.trim() ||
      !this.newCustomer.address.trim() ||
      !this.newCustomer.city.trim()
    ) {
      return;
    }

    const duplicatePhone = this.customers.some(
      customer => customer.phone.trim() === this.newCustomer.phone.trim()
    );

    if (duplicatePhone) {
      alert('This phone number is already registered.');
      return;
    }

    const customer: Customer = {
      ...this.newCustomer,
      customer_id: Math.max(0, ...this.customers.map(c => c.customer_id)) + 1,
      full_name: this.newCustomer.full_name.trim(),
      email: this.newCustomer.email.trim(),
      phone: this.newCustomer.phone.trim(),
      address: this.newCustomer.address.trim(),
      city: this.newCustomer.city.trim()
    };

    this.customers.unshift(customer);
    this.closeForm();
  }

  toggleStatus(customer: Customer): void {
    customer.is_active = !customer.is_active;
  }
}
