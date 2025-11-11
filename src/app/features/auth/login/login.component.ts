// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password.';
      return;
    }
    this.auth.login(this.email.trim(), this.password).subscribe(ok => {
      if (!ok) {
        this.error = 'Invalid email or password.';
        return;
      }
      const user = this.auth.getCurrentUser();
      if (user?.role === 'admin') this.router.navigate(['/admin']);
      else this.router.navigate(['/']);
    });
  }
}
