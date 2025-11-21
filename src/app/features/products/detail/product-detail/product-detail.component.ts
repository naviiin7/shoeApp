import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/core/models/product.model';
import { Observable, Subscription, of } from 'rxjs';
import { filter, map, switchMap, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  // Observables
  product$!: Observable<Product | undefined>;
  similarProducts$!: Observable<Product[]>;

  // local props for imperative APIs & template fallback
  product?: Product;
  activeImage?: string | null;
  loading = false;

  defaultImage = 'assets/images/placeholder.png';

  qty = 1;
  selectedSize: number | string | null = null;
  sizeError = false;

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ps: ProductService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    // product$ driven entirely by route paramMap (no nested subscribes).
    this.loading = true;

    this.product$ = this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter(id => !!id),
      switchMap(id => this.ps.getProductById(id as string | number)),
      tap(p => {
        // imperative copies for imperative functions (addToCart, buyNow)
        this.product = p;
        this.activeImage = p?.image || this.defaultImage;
        this.loading = false;

        // redirect if product not found
        if (!p) {
          this.router.navigate(['/shop']);
        }
      }),
      shareReplay(1)
    );

    // similarProducts$ derived from product$
    this.similarProducts$ = this.product$.pipe(
      filter((p): p is Product => !!p),
      switchMap(p =>
        this.ps.getProductsByCategory(p.category || '').pipe(
          map(list =>
            (list || [])
              .filter(item => String(item.id) !== String(p.id))
              .slice(0, 4)
          )
        )
      )
      ,
      shareReplay(1)
    );

    // keep a small subscription so the async streams kick off while the template can also use async pipe
    this.subs.add(this.product$.subscribe());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    if (img) img.src = this.defaultImage;
  }

  selectSize(size: string | number) {
    this.selectedSize = size;
    this.sizeError = false;
  }

  addToCart() {
    if (!this.product) return;
    if (this.product.sizes?.length && !this.selectedSize) {
      this.sizeError = true;
      return;
    }
    this.cart.add(this.product, this.qty);
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  gotoSuggestion(p: Product) {
    if (!p || p.id == null) return;
    const url = `/shop/${encodeURIComponent(String(p.id))}`;
    this.router.navigateByUrl(url).catch(err => console.error('Navigation to suggestion failed', err));
  }

  trackById(_: number, item: Product) {
    return item?.id ?? _;
  }
}
