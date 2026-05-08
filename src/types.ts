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

export interface CartItem extends Partial<Book>, Partial<Bundle>, Partial<Accessory> {
  id: string;
  title: string;
  price: number;
  quantity: number;
  coverImage: string; // We'll keep this as the main display image in cart
}

export interface Accessory {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  category?: string;
  isNew?: boolean;
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  discountPercentage?: number;
}

export type View = 'home' | 'details' | 'admin';

export interface ShippingRate {
  governorate: string;
  price: number;
}

export interface SiteSettings {
  heroTag: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  footerDescription: string;
  whatsappNumber: string;
  whatsappChannel: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  footerCopyright: string;
}
