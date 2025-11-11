import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  qty = 1;
  loading = true;

  constructor(private route: ActivatedRoute, private ps: ProductService, private cart: CartService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ps.getProduct(id).subscribe(p => {
      this.product = p;
      this.loading = false;
    });
  }

  addToCart() {
    if (!this.product) return;
    this.cart.add(this.product, this.qty);
  }

  increase() { this.qty++; }
  decrease() { if (this.qty > 1) this.qty--; }
}
