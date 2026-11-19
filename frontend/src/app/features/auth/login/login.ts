
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';

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

  const user = this.auth.login(this.email, this.password);

  if (!user) {
    this.errorMessage = 'Invalid email or password.';
    return;
  }

  this.router.navigate([this.auth.getDefaultRoute()]);
}
}
