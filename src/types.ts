export interface Product {
  id: string;
  name: string;
  category: 'smartphones' | 'audio' | 'watches' | 'laptops' | 'accessories';
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  colors?: { name: string; hex: string }[];
  specs: { label: string; value: string }[];
  tag?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  comment: string;
  deliveryType: 'courier' | 'pickup';
  paymentMethod: 'kaspi' | 'cash';
}

export interface CompletedOrder {
  orderId: string;
  items: CartItem[];
  total: number;
  customer: CheckoutForm;
  date: string;
}

export type Page = 'catalog' | 'product' | 'cart' | 'checkout' | 'thank-you';
