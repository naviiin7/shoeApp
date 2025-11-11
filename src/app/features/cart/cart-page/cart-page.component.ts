import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  sub: Subscription | null = null;

  constructor(public cart: CartService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.cart.cart$.subscribe(v => this.items = v);
  }

  updateQty(item: CartItem, delta: number) {
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      this.cart.remove(item.product.id);
    } else {
      this.cart.updateQty(item.product.id, newQty);
    }
  }

  remove(item: CartItem) {
    this.cart.remove(item.product.id);
  }

  clear() {
    this.cart.clear();
  }

  checkout() {
    alert(`Checkout stub — total: $${this.cart.getTotalPrice().toFixed(2)}`);
  }

  continueShopping() {
    this.router.navigateByUrl('/shop');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
