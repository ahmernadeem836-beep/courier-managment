
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SystemUser {
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  status: string;
}

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

  searchTerm = '';
  selectedRole = 'All';
  selectedStatus = 'All';
  showUserForm = false;

  userForm = {
    name: '',
    email: '',
    phone: '',
    role: '',
    branch: '',
  };

  users: SystemUser[] = [
    {
      userId: 1,
      name: 'Ali Ahmed',
      email: 'ali@courier.com',
      phone: '03001234567',
      role: 'Super Admin',
      branch: 'Head Office',
      status: 'Active',
    },
    {
      userId: 2,
      name: 'Usman Malik',
      email: 'usman@courier.com',
      phone: '03011234567',
      role: 'Branch Manager',
      branch: 'Lahore Main Branch',
      status: 'Active',
    },
    {
      userId: 3,
      name: 'Ahmed Khan',
      email: 'ahmed@courier.com',
      phone: '03021234567',
      role: 'Delivery Rider',
      branch: 'Lahore Main Branch',
      status: 'Active',
    },
    {
      userId: 4,
      name: 'Sara Ali',
      email: 'sara@courier.com',
      phone: '03031234567',
      role: 'Warehouse Staff',
      branch: 'Karachi Branch',
      status: 'Inactive',
    },
    {
      userId: 5,
      name: 'Ayesha Noor',
      email: 'ayesha@courier.com',
      phone: '03041234567',
      role: 'Dispatcher',
      branch: 'Islamabad Branch',
      status: 'Active',
    },
  ];

  roles: string[] = [
    'Super Admin',
    'Admin',
    'Branch Manager',
    'Warehouse Staff',
    'Dispatcher',
    'Delivery Rider',
    'Finance Officer',
    'Support Agent',
    'Customer',
  ];

  branches: string[] = [
    'Head Office',
    'Lahore Main Branch',
    'Karachi Branch',
    'Islamabad Branch',
    'Multan Branch',
  ];

  get filteredUsers(): SystemUser[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone.includes(search) ||
        user.role.toLowerCase().includes(search);

      const matchesRole =
        this.selectedRole === 'All' || user.role === this.selectedRole;

      const matchesStatus =
        this.selectedStatus === 'All' || user.status === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(user => user.status === 'Active').length;
  }

  get inactiveUsers(): number {
    return this.users.filter(user => user.status === 'Inactive').length;
  }

  get totalRoles(): number {
    return this.roles.length;
  }

  getStatusClass(status: string): string {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  }

  openUserForm(): void {
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
  }

  createUser(): void {
    if (
      !this.userForm.name.trim() ||
      !this.userForm.email.trim() ||
      !this.userForm.phone.trim() ||
      !this.userForm.role ||
      !this.userForm.branch
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newUser: SystemUser = {
      userId: Math.max(0, ...this.users.map(user => user.userId)) + 1,
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      phone: this.userForm.phone.trim(),
      role: this.userForm.role,
      branch: this.userForm.branch,
      status: 'Active',
    };

    this.users.unshift(newUser);

    this.userForm = {
      name: '',
      email: '',
      phone: '',
      role: '',
      branch: '',
    };

    this.closeUserForm();
  }

  toggleUserStatus(userId: number): void {
    const user = this.users.find(item => item.userId === userId);

    if (!user) return;

    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  }
}
