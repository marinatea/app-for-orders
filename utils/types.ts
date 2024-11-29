import { ReactNode } from "react";

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  orderLink: string;
  store: string;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  ordered: boolean;
}

export interface Cart {
  userName: string;
  cart: CartItem[];
}

export interface User {
  id: string;
  userId: string;
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
