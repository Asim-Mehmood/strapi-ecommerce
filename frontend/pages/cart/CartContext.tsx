'use-client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IProduct } from '@app/types';

type CartItem = IProduct;

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  removeAll: ()=> void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (productObj: CartItem) => {
    setCartItems((prevCartItems) => {
      const prevItem = prevCartItems.find(p => p.id === productObj.id);
      let newItems = [...prevCartItems];
      if (prevItem) {
        prevItem.attributes.Quantity += 1;
      } else {
        const product = {id: productObj.id, attributes: { ...productObj.attributes } };
        product.attributes.Quantity = 1;
        newItems = [...prevCartItems, product];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevCartItems) => {
      const newItems = prevCartItems.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeAll = () => {
    setCartItems(() => {
      localStorage.setItem('cart', JSON.stringify([]));
      return [];
    });
  };


  const updateCartItemQuantity = (productId: number, quantity: number) => {
    setCartItems((prevCartItems) => {
      const prevItem = prevCartItems.find((item) => item.id === productId);
      if (prevItem) {
        prevItem.attributes.Quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(prevCartItems));
      return [...prevCartItems];
    });
  };


  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem('cart') ?? '[]'));
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity, removeAll }}>
      {children}
    </CartContext.Provider>
  );
}
