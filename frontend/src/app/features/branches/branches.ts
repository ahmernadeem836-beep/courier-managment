
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  BranchesService,
  ApiBranch,
  BranchPayload,
} from '../../core/services/branches';

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
export class Branches implements OnInit {

  private branchesService = inject(BranchesService);
  private cdr = inject(ChangeDetectorRef);

  branches: Branch[] = [];

  searchTerm = '';
  statusFilter = 'All';

  showForm = false;
  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  newBranch: Branch = this.getEmptyBranch();

  // Load branches when component initializes
  ngOnInit(): void {
    this.loadBranches();
  }

  // Fetch branches from backend
  loadBranches(): void {

    this.loading = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    this.branchesService.getBranches().subscribe({

      next: response => {

        console.log('API RESPONSE:', response);

        this.branches = response.branches.map(
          (branch: ApiBranch): Branch => this.mapBranch(branch)
        );

        console.log('MAPPED BRANCHES:', this.branches);
        console.log('TOTAL:', this.branches.length);

        this.loading = false;

        this.cdr.detectChanges();

        console.log('Loading:', this.loading);

      },

      error: error => {

        console.error('Branches API error:', error);

        this.loading = false;

        this.errorMessage =
          error.error?.message || 'Unable to load branches.';

        this.cdr.detectChanges();

      }

    });

  }

  // Convert backend branch data into frontend format
  private mapBranch(branch: ApiBranch): Branch {

    return {
      branch_id: Number(branch.branch_id),
      name: branch.branch_name,
      code: branch.branch_code,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      is_active: Number(branch.is_active) === 1,
    };

  }

  // Convert frontend data into backend payload
  private toPayload(branch: Branch): BranchPayload {

    return {
      branch_name: branch.name.trim(),
      branch_code: branch.code.trim().toUpperCase(),
      address: branch.address.trim(),
      city: branch.city.trim(),
      phone: branch.phone.trim(),
      is_active: branch.is_active,
    };

  }

  // Total branches
  get totalBranches(): number {
    return this.branches.length;
  }

  // Active branches
  get activeBranches(): number {
    return this.branches.filter(
      branch => branch.is_active
    ).length;
  }

  // Inactive branches
  get inactiveBranches(): number {
    return this.branches.filter(
      branch => !branch.is_active
    ).length;
  }

  // Search and status filtering
  get filteredBranches(): Branch[] {

    return this.branches.filter(branch => {

      const search = this.searchTerm.toLowerCase().trim();

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

  // Empty branch form
  getEmptyBranch(): Branch {

    return {
      branch_id: 0,
      name: '',
      code: '',
      address: '',
      city: '',
      phone: '',
      is_active: true,
    };

  }

  // Open add branch modal
  openForm(): void {

    this.newBranch = this.getEmptyBranch();

    this.errorMessage = '';
    this.showForm = true;

  }

  // Close add branch modal
  closeForm(): void {

    if (this.saving) return;

    this.showForm = false;

  }

  // Create new branch
  addBranch(): void {

    if (this.saving) return;

    if (
      !this.newBranch.name.trim() ||
      !this.newBranch.code.trim() ||
      !this.newBranch.address.trim() ||
      !this.newBranch.city.trim() ||
      !this.newBranch.phone.trim()
    ) {

      this.errorMessage = 'Please fill in all branch fields.';
      return;

    }

    const duplicateCode = this.branches.some(
      branch =>
        branch.code.toLowerCase() ===
        this.newBranch.code.trim().toLowerCase()
    );

    if (duplicateCode) {

      this.errorMessage = 'Branch code already exists.';
      return;

    }

    this.saving = true;
    this.errorMessage = '';

    this.branchesService.createBranch(
      this.toPayload(this.newBranch)
    ).subscribe({

      next: response => {

        this.saving = false;
        this.showForm = false;

        this.successMessage =
          response.message || 'Branch created successfully.';

        this.newBranch = this.getEmptyBranch();

        this.cdr.detectChanges();

        this.loadBranches();

      },

      error: error => {

        console.error('Create branch error:', error);

        this.saving = false;

        this.errorMessage =
          error.error?.message || 'Unable to create branch.';

        this.cdr.detectChanges();

      }

    });

  }

  // Activate / Deactivate branch
  
toggleStatus(branch: Branch): void {

  this.errorMessage = '';
  this.successMessage = '';

  const updatedStatus = !branch.is_active;

  this.branchesService.updateBranch(
    branch.branch_id,
    {
      branch_name: branch.name,
      branch_code: branch.code,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      is_active: updatedStatus
    }
  ).subscribe({

    next: response => {

      this.successMessage =
        response.message ||
        `Branch ${updatedStatus ? 'activated' : 'deactivated'} successfully.`;

      this.loadBranches();

    },

    error: error => {

      console.error('Update branch error:', error);

      this.errorMessage =
        error.error?.message || 'Unable to update branch.';

    }

  });

}


}
