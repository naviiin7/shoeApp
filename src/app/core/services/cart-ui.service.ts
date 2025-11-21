// src/app/core/services/cart-ui.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartUiService {
  // public observable other components can subscribe to
  private _open$ = new BehaviorSubject<boolean>(false);
  public readonly open$ = this._open$.asObservable();

  constructor() {}

  // Open the mini-cart
  open(): void {
    this._open$.next(true);
  }

  // Close the mini-cart
  close(): void {
    this._open$.next(false);
  }

  // Toggle open state. If `value` provided, set explicitly.
  toggle(value?: boolean): void {
    if (typeof value === 'boolean') {
      this._open$.next(value);
    } else {
      this._open$.next(!this._open$.value);
    }
  }

  // Immediate sync check
  isOpen(): boolean {
    return this._open$.value;
  }
}
