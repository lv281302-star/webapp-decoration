// Types for Decoration Room E-commerce

export type ProductCategory = 'mesa' | 'cadeira' | 'pacote';

export type ColorOption = {
  name: string;
  hex: string;
};

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  promotionalPrice?: number;
  description: string;
  image: string;
  colors: ColorOption[];
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ColorOption;
}

export interface Cart {
  items: CartItem[];
  couponApplied: boolean;
  couponCode?: string;
}

export interface ShippingInfo {
  cep: string;
  cost: number;
  estimatedDays: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  authProvider: 'google' | 'email';
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  category: ProductCategory | 'all';
}
