// src/app/shared/components/mini-cart/mini-cart.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { CartUiService } from 'src/app/core/services/cart-ui.service';
import { OrderService } from 'src/app/core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-cart',
  templateUrl: './mini-cart.component.html',
  styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit, OnDestroy {
  open = false;
  items: { product: any; qty: number }[] = [];
  subs: Subscription[] = [];
  submitting = false;

  constructor(
    private cart: CartService,
    private ui: CartUiService,
    private orders: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    // subscribe to UI open observable
    this.subs.push(this.ui.open$.subscribe((v) => {
      this.open = !!v;
      // helpful debug log
      // console.log('[MiniCart] open$', v);
    }));

    // subscribe to cart items
    this.subs.push(this.cart.cart$.subscribe(items => {
      this.items = Array.isArray(items) ? items : [];
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }

  close() {
    this.ui.close();
  }

  openCart() {
    this.ui.open();
  }

  getTotal(): number {
    return this.items.reduce((sum, it) => sum + ((it.product?.price ?? 0) * (it.qty ?? 1)), 0);
  }

  checkoutFromMiniCart() {
    const shipping = JSON.parse(localStorage.getItem('sv_checkout_shipping') || 'null');
    const paymentRaw = localStorage.getItem('sv_checkout_payment');
    let payment: any = paymentRaw;
    try { payment = paymentRaw ? JSON.parse(paymentRaw) : paymentRaw; } catch {}

    if (!shipping || !payment) {
      this.close();
      this.router.navigate(['/checkout/shipping']);
      return;
    }

    if (!this.items || this.items.length === 0) return;

    const total = this.getTotal();

    this.submitting = true;
    this.orders.createOrder(this.items, shipping, payment, total).subscribe({
      next: (order) => {
        this.cart.clear();
        this.close();
        this.router.navigate(['/checkout/success'], { state: { orderId: order.id }});
      },
      error: (err) => {
        console.error('Mini-cart checkout failed', err);
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}
