// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirm = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';
    if (!this.name || !this.email || !this.password || !this.confirm) {
      this.error = 'All fields are required.';
      return;
    }
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.auth.register(this.name.trim(), this.email.trim(), this.password).subscribe(ok => {
      if (!ok) {
        this.error = 'Email already registered.';
        return;
      }
      this.success = 'Registration successful — redirecting to login...';
      setTimeout(() => this.router.navigate(['/auth/login']), 900);
    });
  }
}
