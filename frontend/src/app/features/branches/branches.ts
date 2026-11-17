
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Branch {
  branch_id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  is_active: boolean;
}

@Component({
  selector: 'app-branches',
  imports: [FormsModule],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches {

  branches: Branch[] = [
    {
      branch_id: 1,
      name: 'Lahore Head Office',
      code: 'LHR-001',
      address: 'Main Boulevard, Gulberg',
      city: 'Lahore',
      phone: '03001234567',
      is_active: false
    },
    {
      branch_id: 2,
      name: 'Lahore Main Branch',
      code: 'LHR-002',
      address: 'Ferozepur Road',
      city: 'Lahore',
      phone: '03007654321',
      is_active: true
    }
  ];

  searchTerm = '';
  statusFilter = 'All';
  showForm = false;

  newBranch: Branch = this.getEmptyBranch();

  get totalBranches(): number {
    return this.branches.length;
  }

  get activeBranches(): number {
    return this.branches.filter(branch => branch.is_active).length;
  }

  get inactiveBranches(): number {
    return this.branches.filter(branch => !branch.is_active).length;
  }

  get filteredBranches(): Branch[] {
    return this.branches.filter(branch => {
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
        branch.name.toLowerCase().includes(search) ||
        branch.code.toLowerCase().includes(search) ||
        branch.city.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'Active' && branch.is_active) ||
        (this.statusFilter === 'Inactive' && !branch.is_active);

      return matchesSearch && matchesStatus;
    });
  }

  getEmptyBranch(): Branch {
    return {
      branch_id: 0,
      name: '',
      code: '',
      address: '',
      city: '',
      phone: '',
      is_active: true
    };
  }

  openForm(): void {
    this.newBranch = this.getEmptyBranch();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  addBranch(): void {
    if (
      !this.newBranch.name.trim() ||
      !this.newBranch.code.trim() ||
      !this.newBranch.address.trim() ||
      !this.newBranch.city.trim() ||
      !this.newBranch.phone.trim()
    ) {
      return;
    }

    const duplicateCode = this.branches.some(
      branch => branch.code.toLowerCase() === this.newBranch.code.trim().toLowerCase()
    );

    if (duplicateCode) {
      alert('Branch code already exists.');
      return;
    }

    const branch: Branch = {
      ...this.newBranch,
      branch_id: Math.max(0, ...this.branches.map(b => b.branch_id)) + 1,
      name: this.newBranch.name.trim(),
      code: this.newBranch.code.trim().toUpperCase(),
      address: this.newBranch.address.trim(),
      city: this.newBranch.city.trim(),
      phone: this.newBranch.phone.trim()
    };

    this.branches.unshift(branch);
    this.closeForm();
  }

  toggleStatus(branch: Branch): void {
    branch.is_active = !branch.is_active;
  }
}
