import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from 'src/app/core/services/order.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: Order | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/orders']);
      return;
    }

    this.loading = true;
    this.orderService.getAllOrders().subscribe(orders => {
      this.order = orders.find(o => o.id === id) || null;
      this.loading = false;
    });
  }

  repeatOrder() {
    if (!this.order) return;

    this.cart.clear();

    for (const item of this.order.items) {
      this.cart.add(item.product, item.qty);
    }

    this.router.navigate(['/cart']);
  }

  goBack() {
    this.router.navigate(['/orders']);
  }
}
