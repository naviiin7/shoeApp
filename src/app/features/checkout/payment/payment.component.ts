import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, PaymentInfo } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  // draft may be null, keep type nullable
  draft: { shipping?: any; payment?: any } | null = null;
  loading = false;
  payment: PaymentInfo = { method: 'mock' };
  acceptTerms = false;

  constructor(private orderService: OrderService, private cart: CartService, private router: Router) {
    this.draft = this.orderService.getDraft();
  }

  ngOnInit(): void {
    // if user jumps here without shipping, redirect back
    if (!this.draft || !this.draft.shipping) {
      this.router.navigate(['/checkout/shipping']);
    }
  }

  // explicitly declare void so TS knows there is no return value
  placeOrder(): void {
    if (!this.draft?.shipping) {
      this.router.navigate(['/checkout/shipping']);
      return;
    }
    if (!this.acceptTerms) {
      alert('Please accept terms before placing the order.');
      return;
    }

    // simple mock payment processing
    this.loading = true;
    setTimeout(() => {
      const items = this.cart.getItems();
      const order = this.orderService.createOrder(items, this.draft!.shipping!, this.payment);
      // clear cart
      this.cart.clear();
      // navigate to success with order id
      this.router.navigate(['/checkout/success'], { state: { orderId: order.id } });
      this.loading = false;
    }, 900);
  }
}
