export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Specification {
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  display: string;
  battery: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: string[];
  specs: Specification;
  category: 'Gaming' | 'Business' | 'Student' | 'Premium';
  stock: number;
  rating: number;
  reviews: Review[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  joinedDate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpecs?: {
    ram?: string;
    storage?: string;
  };
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  trackingNumber?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal?: number;
  isActive: boolean;
  description: string;
}

export type Currency = 'USD' | 'EUR' | 'VND';
export type Language = 'en' | 'es' | 'vi';
