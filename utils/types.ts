import { ReactNode } from "react";

export interface Product {
  productId: string;
  category: string;
  name: string;
  description: string;
  orderLink: string;
  store: string;
  price: number;
  email: string;
}

export interface CartProduct {
  id: number;
  cartId: string;
  productId: string;
  quantity: number;
  ordered: boolean;
  product: Product;
}

export interface Cart {
  cartId: string;
  userName: string;
  products: CartProduct[];
}

export interface User {
  userId: string;
  codeToLogin: string;
  userName?: string;
  role: "admin" | "user";
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export interface UserProviderProps {
  children: ReactNode;
}
