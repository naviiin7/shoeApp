// src/app/features/orders/my-orders/my-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, Order } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (list: Order[]) => {
        // show newest first
        this.orders = (list || []).slice().reverse();
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
      }
    });
  }

  view(order: Order) {
    this.router.navigate(['/orders', order.id]);
  }

  formatTotal(o: Order) {
    return typeof o.total === 'number' ? o.total.toFixed(2) : o.total;
  }
}
