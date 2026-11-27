
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
 imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;

        this.router.navigate([
          this.auth.getDefaultRoute(),
        ]);
      },

      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (error.status === 403) {
          this.errorMessage = 'Your account is inactive.';
        } else {
          this.errorMessage =
            error.error?.message ||
            'Unable to connect to the server. Please try again.';
        }
      },
    });
  }
}
