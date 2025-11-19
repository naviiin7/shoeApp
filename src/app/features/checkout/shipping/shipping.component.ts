import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html'
})
export class ShippingComponent {
  model: any = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  };

  submitting = false;
  cartEmpty = false;

  constructor(private cart: CartService, private router: Router) {}

  ngOnInit() {
    const saved = JSON.parse(localStorage.getItem('sv_checkout_shipping') || 'null');
    if (saved) this.model = saved;

    this.cartEmpty = this.cart.getItems().length === 0;
  }

  proceed() {
    if (this.cartEmpty) return;

    this.submitting = true;

    setTimeout(() => {
      localStorage.setItem('sv_checkout_shipping', JSON.stringify(this.model));
      this.router.navigate(['/checkout/payment']);
    }, 800);
  }
}
