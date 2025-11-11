// ✅ src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/services/product.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featured: Product[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = 'all';
  searchTerm = '';
  loading = false;
  selectedSize = 'all';
  availability = 'all';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private ps: ProductService, private cart: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ✅ Load and assign proper local images
  private loadProducts() {
    this.loading = true;
  
    this.ps.getAllProducts().subscribe({
      next: (products) => {
        if (!products || products.length === 0) {
          this.allProducts = [];
          this.featured = this.allProducts.slice(0, 10);
          this.filteredProducts = [];
          this.loading = false;
          return;
        }
  
        // 🔹 Define your 8 real local images
        const imageList = [
          'assets/images/stridex-runner-22.png',
          'assets/images/citywalk-casual-40.png',
          'assets/images/aeroflex-trainer-62.png',
          'assets/images/mountaingrip-boot-31.png',
          'assets/images/comfortease-slipon-21.png',
          'assets/images/urbansprint-sneaker-18.png',
          'assets/images/flexlite-runner-37.png',
          'assets/images/waveform-sandal-10.png'
        ];
  
        // 🔹 Map each product and assign a different image by index
        this.allProducts = products.map((p, index) => {
          const image = imageList[index % imageList.length];
          return { ...p, image };
        });
  
        // ✅ Limit "Our Products" to 10 items only (no other changes)
        this.featured = this.allProducts.slice(0, 10);
  
        // ✅ Categories setup
        const cats = new Set(this.allProducts.map(p => p.category || 'Other'));
        this.categories = ['all', ...Array.from(cats)];
  
        // ✅ Filtered = all initially
        this.filteredProducts = this.allProducts;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.allProducts = [];
        this.featured = [];
        this.filteredProducts = [];
      }
    });
  }
  

  addToCart(p: Product) {
    this.cart.add(p, 1);
  }

  trackById(index: number, item: Product) {
    return item.id;
  }

  scrollToSection(sectionId: string) {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 96;
      const rectTop = el.getBoundingClientRect().top + window.scrollY;
      const dest = Math.max(0, Math.floor(rectTop - headerHeight - 12));
      window.scrollTo({ top: dest, behavior: 'smooth' });
    }, 80);
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredProducts = this.allProducts.filter((p) => {
      const matchesCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchesTerm =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);

      const matchesPrice =
        (!this.minPrice || p.price >= this.minPrice) &&
        (!this.maxPrice || p.price <= this.maxPrice);

      const matchesSize = this.selectedSize === 'all' || p.sizes?.includes(Number(this.selectedSize));
      const matchesAvailability =
        this.availability === 'all' ||
        (this.availability === 'in' && p.inStock) ||
        (this.availability === 'out' && !p.inStock);

      return matchesCategory && matchesTerm && matchesPrice && matchesSize && matchesAvailability;
    });
  }
}
