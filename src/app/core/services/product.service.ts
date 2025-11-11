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
  private products: Product[] = [
    // --- Featured Shoes ---
    {
      id: 1,
      name: 'Trail Runner XT - Black',
      brand: 'ShoeVerse',
      category: 'Running',
      description: 'Durable trail running shoe with breathable mesh upper and multi-grip outsole.',
      price: 89.99,
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ['Black', 'Gray'],
      rating: 4.6,
      reviews: 142,
      inStock: true,
      image: 'assets/images/shoe1.png'
    },
    {
      id: 2,
      name: 'Tempo Glide - Blue',
      brand: 'StrideX',
      category: 'Running',
      description: 'Lightweight speed trainer with responsive foam for tempo sessions.',
      price: 119.99,
      sizes: [6, 7, 8, 9, 10, 11],
      colors: ['Navy', 'Cyan'],
      rating: 4.7,
      reviews: 200,
      inStock: true,
      image: 'assets/images/shoe2.png'
    },
    {
      id: 3,
      name: 'Everyday Flex - White',
      brand: 'StrideX',
      category: 'Casual',
      description: 'All-day comfort sneaker with breathable knit upper.',
      price: 99.99,
      sizes: [6, 7, 8, 9, 10, 11],
      colors: ['White', 'Beige'],
      rating: 4.3,
      reviews: 210,
      inStock: true,
      image: 'assets/images/shoe3.png'
    },
    {
      id: 4,
      name: 'Summit Trek - Olive',
      brand: 'TerraStep',
      category: 'Hiking',
      description: 'Water-resistant hiking boot with Vibram® sole and ankle support.',
      price: 149.00,
      sizes: [8, 9, 10, 11, 12],
      colors: ['Olive', 'Brown'],
      rating: 4.8,
      reviews: 320,
      inStock: true,
      image: 'assets/images/shoe4.png'
    },
    {
      id: 5,
      name: 'Urban Move - Blue',
      brand: 'CityWalk',
      category: 'Lifestyle',
      description: 'Minimalist street sneaker built for comfort and style.',
      price: 119.99,
      sizes: [6, 7, 8, 9, 10],
      colors: ['Blue', 'White'],
      rating: 4.2,
      reviews: 189,
      inStock: true,
      image: 'assets/images/shoe5.png'
    },

    // --- Generate 70+ more automatically ---
    ...Array.from({ length: 70 }).map((_, i) => ({
      id: 6 + i,
      name: `Fusion Runner ${i + 1}`,
      brand: ['ShoeVerse', 'StrideX', 'TerraStep', 'PowerForm', 'CityWalk'][i % 5],
      category: ['Running', 'Training', 'Casual', 'Hiking', 'Lifestyle'][i % 5],
      description: 'High-performance footwear designed for comfort, grip, and modern style.',
      price: 79 + (i % 5) * 10 + (i % 3) * 5,
      sizes: [7, 8, 9, 10, 11],
      colors: ['Black', 'White', 'Gray', 'Blue', 'Red'].slice(0, 2 + (i % 3)),
      rating: 3.8 + ((i % 4) * 0.3),
      reviews: 50 + i * 2,
      inStock: i % 8 !== 0,
      image: `assets/images/shoe${(i % 12) + 1}.png`
    }))
  ];

  constructor() {}

  // Fetch all products
  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // Fetch one product by ID
  getProductById(id: number): Observable<Product | undefined> {
    const found = this.products.find(p => p.id === id);
    return of(found);
  }
  getProduct(id: string | number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id == id));
  }
  

  // Filter by category
  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return of(filtered);
  }

  // Filter by brand
  getProductsByBrand(brand: string): Observable<Product[]> {
    const filtered = this.products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    return of(filtered);
  }
}
