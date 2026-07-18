import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // book - BookResponse ობიექტი bookService-იდან (id, title, finalPrice, quantity=stock და ა.შ.)
  const addToCart = (book, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.bookId === book.id);

      if (existing) {
        // მარაგზე მეტს ვერ დაამატებ - clamp
        const newQty = Math.min(existing.quantity + qty, book.quantity);
        return prev.map((item) =>
          item.bookId === book.id ? { ...item, quantity: newQty } : item
        );
      }

      return [
        ...prev,
        {
          bookId: book.id,
          title: book.title,
          author: book.author,
          coverImageUrl: book.coverImageUrl,
          finalPrice: book.finalPrice,
          publisherBrandName: book.publisherBrandName,
          stock: book.quantity, // მარაგი დამატების მომენტისთვის, quantity-ს clamp-ისთვის
          quantity: Math.min(qty, book.quantity),
        },
      ];
    });
  };

  const removeFromCart = (bookId) => {
    setItems((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const updateQuantity = (bookId, qty) => {
    setItems((prev) =>
      prev.map((item) =>
        item.bookId === bookId
          ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart უნდა გამოიყენო მხოლოდ <CartProvider>-ის შიგნით');
  }
  return context;
}