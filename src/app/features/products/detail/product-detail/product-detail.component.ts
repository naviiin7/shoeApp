// src/app/features/products/detail/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  loading = false;
  defaultImage = 'assets/images/placeholder.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ps: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      // no id -> go back to list
      this.router.navigate(['/shop']);
      return;
    }
    this.loadProduct(id);
  }

  private loadProduct(id: string) {
    this.loading = true;

    // Prefer a dedicated endpoint if available
    if (typeof (this.ps as any).getProductById === 'function') {
      // ps.getProductById might return Observable<Product>
      (this.ps as any).getProductById(id).subscribe({
        next: (p: Product) => {
          this.product = p;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/shop']);
        }
      });
      return;
    }

    // Fallback: getAllProducts and find
    this.ps.getAllProducts().subscribe({
      next: (list: Product[]) => {
        this.product = (list || []).find(x => String(x.id) === String(id));
        this.loading = false;
        if (!this.product) {
          // not found -> go back to list
          this.router.navigate(['/shop']);
        }
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/shop']);
      }
    });
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    if (img) img.src = this.defaultImage;
  }
}
