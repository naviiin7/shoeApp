// src/app/core/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  sizes: number[];
  inStock: boolean;
  image: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ✅ REAL IMAGE LIST — matches your assets folder exactly
  private readonly realImages = [
    'assets/images/stridex-runner-22.png',
    'assets/images/citywalk-casual-40.png',
    'assets/images/aeroflex-trainer-62.png',
    'assets/images/mountaingrip-boot-31.png',
    'assets/images/comfortease-slipon-21.png',
    'assets/images/urbansprint-sneaker-18.png',
    'assets/images/flexlite-runner-37.png',
    'assets/images/waveform-sandal-10.png'
  ];

  private products: Product[] = [

    // ========================
    // ⭐ FEATURED PRODUCTS
    // ========================
    {
      id: 1,
      name: 'Trail Runner XT - Black',
      brand: 'ShoeVerse',
      category: 'Running',
      description: 'Durable trail running shoe with breathable mesh upper and multi-grip outsole.',
      price: 89.99,
      sizes: [7, 8, 9, 10, 11, 12],
      inStock: true,
      image: 'assets/images/stridex-runner-22.png'
    },
    {
      id: 2,
      name: 'Tempo Glide - Blue',
      brand: 'StrideX',
      category: 'Running',
      description: 'Lightweight speed trainer with responsive foam for tempo sessions.',
      price: 119.99,
      sizes: [6, 7, 8, 9, 10, 11],
      inStock: true,
      image: 'assets/images/citywalk-casual-40.png'
    },
    {
      id: 3,
      name: 'Everyday Flex - White',
      brand: 'StrideX',
      category: 'Casual',
      description: 'All-day comfort sneaker with breathable knit upper.',
      price: 99.99,
      sizes: [6, 7, 8, 9, 10, 11],
      inStock: true,
      image: 'assets/images/aeroflex-trainer-62.png'
    },
    {
      id: 4,
      name: 'Summit Trek - Olive',
      brand: 'TerraStep',
      category: 'Hiking',
      description: 'Water-resistant hiking boot with Vibram® sole and ankle support.',
      price: 149.0,
      sizes: [8, 9, 10, 11, 12],
      inStock: true,
      image: 'assets/images/mountaingrip-boot-31.png'
    },
    {
      id: 5,
      name: 'Urban Move - Blue',
      brand: 'CityWalk',
      category: 'Lifestyle',
      description: 'Minimalist street sneaker built for comfort and style.',
      price: 119.99,
      sizes: [6, 7, 8, 9, 10],
      inStock: true,
      image: 'assets/images/comfortease-slipon-21.png'
    },

    // image samples
    ...Array.from({ length: 70 }).map((_, i) => ({
      id: 6 + i,
      name: `Fusion Runner ${i + 1}`,
      brand: ['ShoeVerse', 'StrideX', 'TerraStep', 'PowerForm', 'CityWalk'][i % 5],
      category: ['Running', 'Training', 'Casual', 'Hiking', 'Lifestyle'][i % 5],
      description: 'High-performance footwear designed for comfort, grip, and modern style.',
      price: 79 + (i % 5) * 10 + (i % 3) * 5,
      sizes: [7, 8, 9, 10, 11],
      inStock: i % 8 !== 0,


      image: this.realImages[i % this.realImages.length]
    }))
  ];

  constructor() {}

  

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  getProduct(id: string | number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id == id));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(
      this.products.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      )
    );
  }

  getProductsByBrand(brand: string): Observable<Product[]> {
    return of(
      this.products.filter(
        p => p.brand.toLowerCase() === brand.toLowerCase()
      )
    );
  }
}
