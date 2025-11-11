import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  orderId?: string | null;
  order: any;

  constructor(private router: Router, private orderService: OrderService) {
    // read order id from history state (router.navigate state)
    const st = history.state;
    this.orderId = st?.orderId;
    if (this.orderId) {
      this.order = this.orderService.getOrders().find((o: any) => o.id === this.orderId);
    }
  }

  ngOnInit(): void {
    if (!this.orderId) {
      // if someone lands here directly, go to home
      // small delay so UI shows
      setTimeout(() => this.router.navigateByUrl('/'), 800);
    }
  }

  continueShopping() {
    this.router.navigateByUrl('/shop');
  }
}
