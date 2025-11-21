import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit, OnDestroy {

  items: CartItem[] = [];
  sub: Subscription | null = null;
  submitting = false;

  constructor(
    public cart: CartService,
    private orders: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.cart.cart$.subscribe(v => this.items = v || []);
  }

  updateQty(item: CartItem, delta: number) {
    const newQty = item.qty + delta;
    if (newQty <= 0) this.cart.remove(item.product.id);
    else this.cart.updateQty(item.product.id, newQty);
  }

  remove(item: CartItem) {
    this.cart.remove(item.product.id);
  }

  clear() {
    this.cart.clear();
  }

  checkout() {
    const shipping = JSON.parse(localStorage.getItem('sv_checkout_shipping') || 'null');
    const payment = JSON.parse(localStorage.getItem('sv_checkout_payment') || 'null');

    if (!shipping || !payment) {
      this.router.navigate(['/checkout/shipping']);
      return;
    }

    if (!this.items.length) return;

    const total = this.cart.getTotalPrice();
    this.submitting = true;

    this.orders.createOrder(this.items, shipping, payment, total).subscribe({
      next: (o) => {
        this.cart.clear();
        this.router.navigate(['/checkout/success'], { state: { orderId: o.id } });
      },
      complete: () => this.submitting = false
    });
  }

  continueShopping() {
    this.router.navigateByUrl('/shop');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
