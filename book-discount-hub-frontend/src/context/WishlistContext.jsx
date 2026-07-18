import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = (bookId) => items.some((item) => item.id === bookId);

  const toggleWishlist = (book) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (exists) {
        return prev.filter((item) => item.id !== book.id);
      }
      return [...prev, book];
    });
  };

  const clearWishlist = () => setItems([]);

  const value = { items, isInWishlist, toggleWishlist, clearWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist უნდა გამოიყენო მხოლოდ <WishlistProvider>-ის შიგნით');
  }
  return context;
}