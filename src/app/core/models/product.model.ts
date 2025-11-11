export interface Product {
  id: number;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  price: number;
  image: string;
  sizes?: (string | number)[];  
  colors?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}
