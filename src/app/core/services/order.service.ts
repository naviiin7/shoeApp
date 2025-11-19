// src/app/core/services/order.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from './cart.service';

export interface Order {
  id: string;
  items: CartItem[];
  shipping: any;
  payment: string;
  total: number;
  date: string;
  userId: string;   // ← ADDED
}

const ORDERS_KEY = 'sv_orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() {}

  private loadOrders(): Order[] {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private saveOrders(list: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  }

  /** Create a new order */
  createOrder(
    items: CartItem[],
    shipping: any,
    payment: string,
    total: number,
    userId: string
  ): Observable<Order> {

    const orders = this.loadOrders();

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      items,
      shipping,
      payment,
      total,
      date: new Date().toISOString(),
      userId: userId || 'guest'   // ← VERY IMPORTANT
    };

    orders.push(newOrder);
    this.saveOrders(orders);

    return of(newOrder);
  }

  /** Get all orders */
  getAllOrders(): Observable<Order[]> {
    return of(this.loadOrders());
  }

  /** Get one order by ID */
  getOrderById(id: string): Order | undefined {
    return this.loadOrders().find(o => o.id === id);
  }
}
