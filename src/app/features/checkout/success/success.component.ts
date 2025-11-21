import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html'
})
export class SuccessComponent implements OnInit {
  order: any = null;
  loading = true;

  constructor(
    private cart: CartService,
    private orders: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const shipping = JSON.parse(localStorage.getItem('sv_checkout_shipping') || 'null');
    const paymentRaw = localStorage.getItem('sv_checkout_payment');
    let payment: any = paymentRaw;
    try { payment = paymentRaw ? JSON.parse(paymentRaw) : paymentRaw; } catch {}
    const items = this.cart.getItems ? this.cart.getItems() : [];

    if (!shipping || !payment || !items || items.length === 0) {
      // fallback: maybe someone landed here; go back to shop
      this.router.navigate(['/']);
      return;
    }

    const total = items.reduce((s: number, it: any) => {
      const price = (it.product && (it.product as any).price) ?? (it as any).price ?? 0;
      const qty = (it.qty ?? 1);
      return s + price * qty;
    }, 0);

    const userId = this.auth.getCurrentUser()?.id ?? 'guest';

    this.orders.createOrder(items, shipping, payment, total, userId).subscribe({
      next: (o) => {
        this.order = o;
        // clear cart & checkout storage
        this.cart.clear();
        localStorage.removeItem('sv_checkout_shipping');
        localStorage.removeItem('sv_checkout_payment');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // still show a simple fallback UI
      }
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
}
