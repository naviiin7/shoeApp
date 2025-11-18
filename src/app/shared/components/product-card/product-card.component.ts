import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<Product>();

  /**
   * ✅ Safe fallback for broken images
   * Prevents infinite reload loops by only swapping once.
   */
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;

    // prevent infinite loop if the placeholder also fails
    if (!img || img.src.includes('image-placeholder.png')) {
      return;
    }

    img.src = 'assets/images/image-placeholder.png';
  }

  addToCart() {
    this.addToCartEvent.emit(this.product);
  }
}
