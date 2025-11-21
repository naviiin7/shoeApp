import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, Order } from 'src/app/core/services/order.service';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  orders: Order[] = [];
  loading = false;
  userId: string = 'guest';

  constructor(
    private orderService: OrderService,
    private cart: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    this.userId = user?.id || 'guest';
    this.load();
  }

  load() {
    this.loading = true;

    this.orderService.getOrdersForUser(this.userId).subscribe({
      next: (list: Order[]) => {
        this.orders = list || [];
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
      }
    });
  }

  repeatOrder(o: Order) {
    if (!o || !o.items) return;

    this.cart.clear();

    for (const it of o.items) {
      const p = it.product;
      const q = it.qty || 1;
      if (p) this.cart.add(p, q);
    }

    this.router.navigate(['/cart']);
  }
}
