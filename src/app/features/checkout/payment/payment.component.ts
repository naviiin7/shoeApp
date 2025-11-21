import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  submitting = false;
  method: string = 'card';

  card = {
    number: '',
    exp: '',
    cvv: ''
  };

  constructor(private router: Router) {}

  pay() {
    this.submitting = true;
    setTimeout(() => {
      // store payment as simple string — you can expand this later
      localStorage.setItem('sv_checkout_payment', JSON.stringify({ method: this.method }));
      this.router.navigate(['/checkout/success']);
    }, 900);
  }

  goBack() {
    this.router.navigate(['/checkout/shipping']);
  }
}
