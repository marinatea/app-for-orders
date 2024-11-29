import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserContextType, UserProviderProps } from "../utils/types";

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider kontekstu
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Funkcja do wylogowania użytkownika
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do korzystania z kontekstu
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};