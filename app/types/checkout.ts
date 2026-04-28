export interface CheckoutPayload {
  payment: string;
  shipping: string;
  name: string;
  phone: string;
  address: string;
  image_url: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered"

export interface Order{
  id: number,
  userid:number,
  name: string,
  phone: string,
  address: string,
  shipping: string,
  payment: string,
  totalPrice: string,
  status: string,
  createdAt: string
}

export interface DeleteMsg{
  message: string
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role?: "customer" | "admin";
}