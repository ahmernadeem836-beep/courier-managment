
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  UsersService,
  ApiUser,
  ApiRole,
  ApiBranch
} from '../../core/services/users';

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
export class Users implements OnInit {

  private usersService = inject(UsersService);

  searchTerm = '';
  selectedRole = 'All';
  selectedStatus = 'All';

  showUserForm = false;
  loading = false;
  saving = false;
  errorMessage = '';

  users: SystemUser[] = [];
  roles: ApiRole[] = [];
  branches: ApiBranch[] = [];

  userForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    branch: '',
  };

  ngOnInit(): void {
    this.loadUsersModule();
  }

  loadUsersModule(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadBranches();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.usersService.getUsers().subscribe({
      next: response => {
        this.users = response.users.map((user: ApiUser) => ({
          userId: user.user_id,
          name: user.full_name,
          email: user.email,
          phone: user.phone || '-',
          role: user.roles?.map(role => role.role_name).join(', ') || 'No Role',
          branch: user.branch_name || 'Not Assigned',
          status: Number(user.is_active) === 1 ? 'Active' : 'Inactive',
        }));

        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Unable to load users.';
        console.error(error);
      },
    });
  }

  loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: response => {
        this.roles = response.roles;
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to load roles.';
        console.error(error);
      },
    });
  }

  loadBranches(): void {
    this.usersService.getBranches().subscribe({
      next: response => {
        this.branches = response.branches.filter(
          branch => Number(branch.is_active) === 1
        );
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to load branches.';
        console.error(error);
      },
    });
  }

  get filteredUsers(): SystemUser[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone.includes(search) ||
        user.role.toLowerCase().includes(search);

      const matchesRole =
        this.selectedRole === 'All' ||
        user.role.split(', ').includes(this.selectedRole);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        user.status === this.selectedStatus;

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
    this.errorMessage = '';
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.userForm = {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      branch: '',
    };
  }

  createUser(): void {
    if (
      !this.userForm.name.trim() ||
      !this.userForm.email.trim() ||
      !this.userForm.phone.trim() ||
      !this.userForm.password ||
      !this.userForm.role ||
      !this.userForm.branch
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.userForm.password.length < 8) {
      alert('Password must contain at least 8 characters.');
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const payload = {
      full_name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      password: this.userForm.password,
      phone: this.userForm.phone.trim(),
      role_id: Number(this.userForm.role),
      branch_id: Number(this.userForm.branch),
    };

    this.usersService.createUser(payload).subscribe({
      next: () => {
        this.saving = false;
        this.closeUserForm();
        this.loadUsers();
      },
      error: error => {
        this.saving = false;
        this.errorMessage =
          error.error?.message || 'Unable to create user.';
        console.error(error);
      },
    });
  }

  toggleUserStatus(userId: number): void {
    const user = this.users.find(item => item.userId === userId);

    if (!user) return;

    const request =
      user.status === 'Active'
        ? this.usersService.deactivateUser(userId)
        : this.usersService.activateUser(userId);

    request.subscribe({
      next: () => {
        this.loadUsers();
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to update user status.';
        console.error(error);
      },
    });
  }
}
