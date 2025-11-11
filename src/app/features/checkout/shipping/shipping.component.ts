import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, ShippingInfo } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent {
  shipping: ShippingInfo = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  };

  submitting = false;
  cartEmpty = false;

  constructor(private orderService: OrderService, private cart: CartService, private router: Router) {
    this.cartEmpty = this.cart.getItems().length === 0;
  }

  proceed() {
    if (this.cartEmpty) {
      alert('Your cart is empty. Add items before checkout.');
      return;
    }

    // very basic validation
    if (!this.shipping.name || !this.shipping.email || !this.shipping.address || !this.shipping.city) {
      alert('Please fill name, email, address and city.');
      return;
    }

    this.submitting = true;
    // store draft in OrderService then navigate to payment
    this.orderService.setDraft({ shipping: this.shipping });
    setTimeout(() => {
      this.submitting = false;
      this.router.navigate(['/checkout/payment']);
    }, 400);
    
  }
}
