import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from '../services/auth.service'; // adjust path if needed

export interface CartItem {
  product: Product;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private subject = new BehaviorSubject<CartItem[]>([]);
  readonly cart$ = this.subject.asObservable();

  private readonly STORAGE_PREFIX = 'sv_cart_';
  private userId: string = 'guest';

  constructor(private auth: AuthService) {
    // ✅ Load cart on init
    this.setUserId();
    this.load();

    // ✅ Reactively handle login/logout changes
    this.auth.currentUser$.subscribe(() => {
      const prevUser = this.userId;
      this.setUserId();

      // 🧩 Merge guest cart into logged-in user cart (safe)
      if (prevUser === 'guest' && this.userId !== 'guest') {
        this.mergeGuestCartIntoUserCart();
      }

      this.load();
    });
  }

  /** ✅ Determine which cart key to use */
  private setUserId(): void {
    const user = this.auth.getCurrentUser();
    this.userId = user?.id || user?.email || 'guest';
  }

  /** ✅ Load cart from localStorage */
  private load(): void {
    try {
      const key = this.STORAGE_PREFIX + this.userId;
      const data = localStorage.getItem(key);
      this.items = data ? JSON.parse(data) : [];
    } catch {
      this.items = [];
    }
    this.emit();
  }

  /** ✅ Save cart for current user */
  private save(): void {
    const key = this.STORAGE_PREFIX + this.userId;
    localStorage.setItem(key, JSON.stringify(this.items));
    this.emit();
  }

  /** ✅ Merge guest cart into the logged-in user cart (no side effects) */
  private mergeGuestCartIntoUserCart(): void {
    try {
      const guestKey = this.STORAGE_PREFIX + 'guest';
      const userKey = this.STORAGE_PREFIX + this.userId;

      const guestData = localStorage.getItem(guestKey);
      const userData = localStorage.getItem(userKey);

      const guestItems: CartItem[] = guestData ? JSON.parse(guestData) : [];
      const userItems: CartItem[] = userData ? JSON.parse(userData) : [];

      if (guestItems.length === 0) return; // nothing to merge

      // Combine carts safely
      const merged = [...userItems];
      for (const g of guestItems) {
        const idx = merged.findIndex(u => u.product.id === g.product.id);
        if (idx >= 0) merged[idx].qty += g.qty;
        else merged.push(g);
      }

      localStorage.setItem(userKey, JSON.stringify(merged));
      localStorage.removeItem(guestKey); // clear guest cart after merge

      console.info(
        `[CartService] Merged ${guestItems.length} guest item(s) into ${this.userId}'s cart`
      );
    } catch (err) {
      console.warn('[CartService] mergeGuestCartIntoUserCart failed:', err);
    }
  }

  /** Return clone of items */
  getItems(): CartItem[] {
    return this.items.slice();
  }

  /** Find item index */
  private findIndex(productId: number): number {
    return this.items.findIndex(i => i.product.id === productId);
  }

  /** Add product; qty may be negative */
  add(product: Product, qty: number = 1): void {
    if (!product) return;
    const idx = this.findIndex(product.id);
    if (idx >= 0) {
      this.items[idx].qty += qty;
      if (this.items[idx].qty <= 0) {
        this.items.splice(idx, 1);
      }
    } else if (qty > 0) {
      this.items.push({ product, qty });
    }
    this.save();
  }

  /** Update quantity manually */
  updateQty(productId: number, qty: number): void {
    const idx = this.findIndex(productId);
    if (idx === -1) return;
    if (qty <= 0) this.items.splice(idx, 1);
    else this.items[idx].qty = qty;
    this.save();
  }

  /** Remove item */
  remove(productId: number): void {
    const idx = this.findIndex(productId);
    if (idx >= 0) {
      this.items.splice(idx, 1);
      this.save();
    }
  }

  /** Clear user’s cart */
  clear(): void {
    this.items = [];
    this.save();
  }

  /** Get total price */
  getTotalPrice(): number {
    return this.items.reduce((sum, it) => sum + (it.product.price ?? 0) * it.qty, 0);
  }

  /** Total count */
  getTotalCount(): number {
    return this.items.reduce((s, it) => s + it.qty, 0);
  }

  /** Emit cloned list */
  private emit(): void {
    this.subject.next(this.items.slice());
  }
}
