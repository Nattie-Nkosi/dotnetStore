export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CreateOrderRequest {
  saveAddress: boolean;
  shippingAddress: ShippingAddress;
}

export interface OrderItem {
  productId: number;
  name: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface PaymentSummary {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface Order {
  id: number;
  buyerId: string;
  shippingAddress: ShippingAddress;
  orderDate: string;
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  orderStatus: string;
  paymentSummary?: PaymentSummary;
  total: number;
}
