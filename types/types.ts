export interface Item {
  id: number;
  name: string;
  price: number;
}

export interface CartItem extends Item {
  quantity: number;
  totalPrice: number;
}

export interface User {
  id: number;
  username: string;
  isAdmin?: boolean;
}

export interface Discount {
  code: string;
  percentage: number;
}

export interface Cart {
  userId: number | null;
  items: CartItem[];
  total: number;
  availableDiscountCodes?: Discount[];
  discountCodeUsed?: string;
  discountAmount?: number;
  grandTotal: number;
}

export interface Order {
  orderId: string;
  userId: number;
  items: CartItem[];
  total: number;
  discountCodeUsed?: string;
  discountAmount?: number;
  grandTotal: number;
}

export interface Insights {
  totalOrders: number;
  totalRevenue: number;
  totalCarts: number;
  totalItems: number;
  averageOrderValue: number;
  averageItemsPerCart: number;
  totalDiscountAmount: number;
  totalDiscountCodesUsed: number;
  totalDiscountCodes: number;
  discountCodes: Discount[];
}
