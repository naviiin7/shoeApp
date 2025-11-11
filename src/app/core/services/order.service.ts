import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';

export interface ShippingInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface PaymentInfo {
  method: 'card' | 'cod' | 'mock';
  cardName?: string;
  cardNumber?: string;
  exp?: string;
  cvv?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  total: number;
  createdAt: string;
}

const ORDERS_KEY = 'shoe_orders_v1';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private draft$ = new BehaviorSubject<{ shipping?: ShippingInfo; payment?: PaymentInfo } | null>(null);

  constructor() {}

  setDraft(draft: { shipping?: ShippingInfo; payment?: PaymentInfo }) {
    this.draft$.next(draft);
  }

  getDraft() {
    return this.draft$.getValue();
  }

  clearDraft() {
    this.draft$.next(null);
  }

  createOrder(items: CartItem[], shipping: ShippingInfo, payment: PaymentInfo): Order {
    const total = items.reduce((s, it) => s + it.qty * (it.product.price || 0), 0);
    const id = 'ORD-' + Date.now();
    const order: Order = {
      id,
      items,
      shipping,
      payment,
      total,
      createdAt: new Date().toISOString()
    };

    // persist (append) in localStorage for demo
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('Could not persist order', e);
    }

    this.clearDraft();
    return order;
  }

  getOrders(): Order[] {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
