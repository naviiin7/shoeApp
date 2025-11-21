import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']   // <-- added so hero styles load
})
export class HomeComponent implements OnInit {
  featured: Product[] = [];
  loading = false;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (list: Product[]) => {
        // pick first 10 as featured
        this.featured = Array.isArray(list) ? list.slice(0, 10) : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load featured products', err);
        this.featured = [];
        this.loading = false;
      }
    });
  }

  gotoDetail(p: Product | any) {
    const id = p?.id;
    if (id === undefined || id === null || id === '') {
      console.warn('gotoDetail: invalid product id', p);
      return;
    }
    const url = `/shop/${encodeURIComponent(String(id))}`;
    this.router.navigateByUrl(url).catch(err => { console.error('Navigation to product failed', url, err); });
  }

  trackById(index: number, item: Product) {
    return item?.id ?? index;
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
}
