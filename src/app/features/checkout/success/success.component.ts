// src/app/features/checkout/success/success.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html'
})
export class SuccessComponent {

  order: any = null;

  constructor(
    private cart: CartService,
    private orders: OrderService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const shipping = JSON.parse(localStorage.getItem('sv_checkout_shipping') || 'null');
    const payment = localStorage.getItem('sv_checkout_payment');
    const items = this.cart.getItems();

    if (!shipping || !payment || items.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    const total = items.reduce((s, i) => s + (i.product.price || 0) * i.qty, 0);

    const user = this.auth.getCurrentUser();
    const userId = user?.id || 'guest';

    this.orders.createOrder(items, shipping, payment, total, userId)
      .subscribe(order => {
        this.order = order;

        this.cart.clear();
        localStorage.removeItem('sv_checkout_shipping');
        localStorage.removeItem('sv_checkout_payment');
      });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}
