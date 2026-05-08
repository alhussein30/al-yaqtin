export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  oldPrice?: number;
  description: string;
  coverImage: string;
  category: string;
  pages: number;
  language: string;
  isbn: string;
  publishDate: string;
  coverType: string;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  discountPercentage?: number;
  stock?: number;
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  books: string[]; // IDs of books in the bundle
  coverImage: string;
  isBundle: true;
}

export interface CartItem extends Partial<Book>, Partial<Bundle> {
  id: string;
  title: string;
  price: number;
  quantity: number;
  coverImage: string;
}

export type View = 'home' | 'details' | 'admin';

export interface ShippingRate {
  governorate: string;
  price: number;
}
