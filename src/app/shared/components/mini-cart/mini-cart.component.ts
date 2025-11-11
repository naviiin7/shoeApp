import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { CartUiService } from '../../../core/services/cart-ui.service';

@Component({
  selector: 'app-mini-cart',
  templateUrl: './mini-cart.component.html',
  styleUrls: ['./mini-cart.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(.16,1,.3,1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class MiniCartComponent implements OnInit, OnDestroy {
  visible = false;
  items: CartItem[] = [];
  subtotal = 0;

  private subs: Subscription[] = [];

  constructor(
    private cart: CartService,
    private ui: CartUiService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 👁 Listen for visibility state
    const subUi = this.ui.visible$.subscribe((v: boolean) => {
      this.zone.run(() => {
        this.visible = v;
        this.cdr.detectChanges();
      });
    });
    this.subs.push(subUi);

    // 🛒 Listen for cart updates
    const subCart = this.cart.cart$.subscribe((items: CartItem[]) => {
      this.zone.run(() => {
        this.items = items || [];
        this.subtotal = this.cart.getTotalPrice();
        this.cdr.detectChanges();
      });
    });
    this.subs.push(subCart);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  increase(it: CartItem): void {
    this.cart.add(it.product, 1);
  }

  decrease(it: CartItem): void {
    if (it.qty <= 1) this.remove(it);
    else this.cart.add(it.product, -1);
  }

  remove(it: CartItem): void {
    this.cart.remove(it.product.id);
  }

  // ✅ Checkout button stays the same
  checkout(): void {
    this.ui.close();
    this.router.navigate(['/checkout']);
  }

  // ✅ NEW: Continue button → goes to main cart page
  continue(): void {
    this.ui.close();
    this.router.navigate(['/cart']);
  }

  close(): void {
    this.ui.close();
  }
}
