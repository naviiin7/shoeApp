// src/app/features/products/list/product-list.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayed: Product[] = [];
  loading = false;

  q = '';
  category?: string;
  sort?: string;

  private subs = new Subscription();

  constructor(
    private ps: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    // If there's a route param 'category' (e.g. /products/category/Running), push it into query params
    const paramSub = this.route.paramMap.subscribe(pm => {
      const cat = pm.get('category');
      if (cat) {
        // merge category into query params (won't reload component, just update URL)
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { category: cat },
          queryParamsHandling: 'merge'
        });
      }
    });
    this.subs.add(paramSub);

    // Listen for query param changes and reload
    const qSub = this.route.queryParamMap.subscribe(params => {
      this.q = params.get('q') || '';
      this.category = params.get('category') || undefined;
      this.sort = params.get('sort') || undefined;
      this.load();
    });
    this.subs.add(qSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private load(): void {
    this.loading = true;
    // get all products from service then apply filters/sort client-side
    const svcSub = this.ps.getAllProducts().subscribe({
      next: all => {
        this.products = all || [];
        // filter
        let filtered = this.products.slice();

        if (this.q && this.q.trim().length > 0) {
          const qlow = this.q.trim().toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(qlow) ||
            (p.brand && p.brand.toLowerCase().includes(qlow)) ||
            (p.description && p.description.toLowerCase().includes(qlow))
          );
        }

        if (this.category) {
          const catLower = this.category.toLowerCase();
          filtered = filtered.filter(p => p.category && p.category.toLowerCase() === catLower);
        }

        // sort
        if (this.sort === 'price-asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (this.sort === 'price-desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (this.sort === 'rating') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        this.displayed = filtered;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.displayed = [];
        this.loading = false;
      }
    });

    this.subs.add(svcSub);
  }

  onSearch(q: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q },
      queryParamsHandling: 'merge'
    });
  }

  onFilterCategory(cat?: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: cat },
      queryParamsHandling: 'merge'
    });
  }

  onSort(sort?: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort },
      queryParamsHandling: 'merge'
    });
  }

  addToCart(p: Product) {
    this.cart.add(p, 1);
  }
}
