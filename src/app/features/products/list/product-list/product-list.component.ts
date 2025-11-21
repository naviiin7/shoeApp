import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filtered: Product[] = [];
  paginated: Product[] = [];

  categories: string[] = [];
  sizes: number[] = [];

  category: string = 'all';
  sort: string = '';
  search: string = '';
  selectedSize: string = 'all'; // 'all' or numeric string

  loading = false;

  // Pagination — fixed to 20
  currentPage = 1;
  pageSize = 20;

  // UI state
  showSearch = false;
  searchQuery = '';

  constructor(
    private ps: ProductService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  // -----------------------------
  // LOAD PRODUCTS
  // -----------------------------
  private load() {
    this.loading = true;

    this.ps.getAllProducts().subscribe({
      next: (res) => {
        this.products = Array.isArray(res) ? res : [];

        // Ensure image exists
        this.products = this.products.map((p, i) => ({
          ...p,
          image: (p as any).image || this.defaultImageFor(i)
        }));

        this.categories = Array.from(new Set(this.products.map(p => p.category || 'Other')));

        // derive size options (unique numeric sizes)
        const sizeSet = new Set<number>();
        this.products.forEach(p => (p.sizes || []).forEach((s: any) => {
          const n = Number(s);
          if (!Number.isNaN(n)) sizeSet.add(n);
        }));
        this.sizes = Array.from(sizeSet).sort((a,b)=>a-b);

        this.filtered = [...this.products];
        this.paginate(); // initial pagination

        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.filtered = [];
        this.paginated = [];
        this.categories = [];
        this.sizes = [];
        this.loading = false;
      }
    });
  }

  // Default fallback images cycle
  defaultImageFor(i: number) {
    const defaults = [
      'assets/images/stridex-runner-22.png',
      'assets/images/citywalk-casual-40.png',
      'assets/images/aeroflex-trainer-62.png',
      'assets/images/mountaingrip-boot-31.png',
      'assets/images/comfortease-slipon-21.png',
      'assets/images/urbansprint-sneaker-18.png',
      'assets/images/flexlite-runner-37.png',
      'assets/images/waveform-sandal-10.png',
      'assets/images/placeholder.png'
    ];
    return defaults[i % defaults.length];
  }

  trackById(_: number, item: Product) {
    return item.id;
  }

  // -----------------------------
  // FILTERING + SORTING + SEARCH
  // -----------------------------
  onFilterCategory(value: string) {
    this.category = value;
    this.applyFilters();
  }

  onSort(value: string) {
    this.sort = value;
    this.applyFilters();
  }

  onSearch(value: string) {
    this.search = value || '';
    this.applyFilters();
  }

  onFilterSize(value: string) {
    this.selectedSize = value || 'all';
    this.applyFilters();
  }

  applyFilters() {
    const term = (this.search || '').toLowerCase().trim();

    this.filtered = this.products.filter(p => {
      const matchCategory = this.category === 'all' || !this.category || (p.category === this.category);

      const matchTerm = !term ||
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term));

      const matchesSize = this.selectedSize === 'all' ||
        (p.sizes && p.sizes.some(s => String(s) === String(this.selectedSize)));

      return matchCategory && matchTerm && matchesSize;
    });

    // Sorting
    if (this.sort === 'price-asc') {
      this.filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (this.sort === 'price-desc') {
      this.filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (this.sort === 'name-asc') {
      this.filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    // Reset pagination after filtering
    this.currentPage = 1;
    this.paginate();
  }

  // -----------------------------
  // IMAGE ERROR HANDLER
  // -----------------------------
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('placeholder')) {
      img.src = 'assets/images/placeholder.png';
    }
  }

  // -----------------------------
  // PAGINATION METHODS
  // -----------------------------
  paginate() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginated = this.filtered.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filtered.length) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  changePageSize(size: number) {
    this.pageSize = Number(size) || 20;
    this.currentPage = 1;
    this.paginate();
  }

  // -----------------------------
  // NAVIGATION TO DETAIL PAGE
  // -----------------------------
  gotoDetail(p: Product) {
    this.router.navigate(['/shop', p.id]);
  }

  // Add to cart from the products list (stops propagation)
  addToCartInList(ev: Event, p: Product) {
    ev.stopPropagation();
    if (!p) return;
    this.cart.add(p, 1);
  }

  // --- Search toggle ---
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchQuery = '';
    }
  }

  doSearch() {
    this.search = this.searchQuery || '';
    this.applyFilters();
    this.showSearch = false;
  }
  viewProduct(p: Product) {
  if (!p || p.id == null) return;
  this.router.navigate(['/shop', p.id]);
}


  // expose math-derived pages count to template
  get totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }
}
