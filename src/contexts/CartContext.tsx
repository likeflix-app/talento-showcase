import React, { createContext, useContext, useState, useEffect } from 'react';
import { Talent } from '@/types/talent';

export interface CartItem extends Talent {
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (talent: Talent) => void;
  removeFromCart: (talentId: string) => void;
  updateQuantity: (talentId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('talento-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('talento-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (talent: Talent) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === talent.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === talent.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...talent, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (talentId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== talentId));
  };

  const updateQuantity = (talentId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(talentId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === talentId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[€,]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
