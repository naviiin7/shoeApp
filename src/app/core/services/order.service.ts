// src/app/core/services/order.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from './cart.service';

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shipping: any;
  payment: any;
  total: number;
  date: string;
  status?: string;
}

const ORDERS_KEY = 'sv_orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor() {}

  private loadOrders(): Order[] {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') as Order[];
    } catch {
      return [];
    }
  }

  private saveOrders(list: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  }

  /** Create an order. userId optional; if omitted, stores 'guest' */
  createOrder(
    items: CartItem[],
    shipping: any,
    payment: any,
    total?: number,
    userId?: string
  ): Observable<Order> {
    const orders = this.loadOrders();

    // compute total if not provided
    const calc = (items || []).reduce((s, it) => {
      const price = (it.product && (it.product as any).price) ?? (it as any).price ?? 0;
      const qty = (it.qty ?? 1);
      return s + (price * qty);
    }, 0);

    const newTotal = Number(total ?? calc ?? 0);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      userId: userId || 'guest',
      items: items || [],
      shipping: shipping || {},
      payment: payment || {},
      total: newTotal,
      date: new Date().toISOString(),
      status: 'Placed'
    };

    orders.push(newOrder);
    this.saveOrders(orders);

    return of(newOrder);
  }

  getAllOrders(): Observable<Order[]> {
    return of(this.loadOrders());
  }

  getOrdersForUser(userId: string): Observable<Order[]> {
    const list = this.loadOrders().filter(o => String(o.userId) === String(userId));
    return of(list);
  }

  getOrderById(id: string): Order | undefined {
    return this.loadOrders().find(o => String(o.id) === String(id));
  }
}
