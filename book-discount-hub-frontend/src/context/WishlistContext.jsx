import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBookById } from '../api/bookService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

function getStorageKey(userId) {
  return `wishlist_${userId ?? 'guest'}`;
}

function loadFromStorage(key) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.userId);

  const [items, setItems] = useState(() => loadFromStorage(storageKey));
  const [restockAlerts, setRestockAlerts] = useState([]);

  /**
   * ყოველ item-ს ცოცხალ (ბექენდიდან ახლად წამოღებულ) quantity-ს ვუსინქრონებთ -
   * არა მხოლოდ მათ, ვინც დამატების მომენტში უკვე ამოწურული იყო. ეს აუცილებელია,
   * რადგან წიგნი შეიძლება wishlist-ში დაემატოს მარაგში-ყოფნისას და მოგვიანებით
   * ამოიწუროს (მაგ. ვიღაცამ იყიდა) - ამ ცვლილების დანახვა მხოლოდ live შემოწმებით შეიძლება.
   * "restock" alert მხოლოდ იმ item-ებზე ჩნდება, ვინც წინა შემოწმებისას ამოწურული
   * იყო და ახლა კვლავ მარაგშია - არა უბრალოდ quantity-ის ცვლილებაზე.
   */
  const syncStock = useCallback(async (currentItems) => {
    if (currentItems.length === 0) return;

    const results = await Promise.all(
      currentItems.map((item) =>
        getBookById(item.id)
          .then((res) => ({ id: item.id, quantity: res.data.quantity }))
          .catch(() => null)
      )
    );

    const newlyRestocked = results.filter((r, idx) => {
      if (!r) return false;
      const wasOut = currentItems[idx].wasOutOfStock;
      return wasOut && r.quantity > 0;
    });

    if (newlyRestocked.length > 0) {
      setRestockAlerts((prev) => {
        const newOnes = newlyRestocked.filter((r) => !prev.some((p) => p.id === r.id));
        if (newOnes.length === 0) return prev;
        return [
          ...prev,
          ...newOnes.map((r) => ({
            id: r.id,
            title: currentItems.find((i) => i.id === r.id)?.title,
          })),
        ];
      });
    }

    setItems((prev) =>
      prev.map((item) => {
        const fresh = results.find((r) => r && r.id === item.id);
        if (!fresh) return item; // fetch ჩავარდა (მაგ. წიგნი წაშლილია) - ძველი მონაცემი ვტოვოთ
        return { ...item, quantity: fresh.quantity, wasOutOfStock: fresh.quantity === 0 };
      })
    );
  }, []);

  // storageKey-ის ცვლილებაზე (login/logout/user switch) ახალი user-ის (ან guest-ის)
  // საკუთარი wishlist ხელახლა იტვირთება და მაშინვე სინქრონდება ცოცხალ მარაგთან
  useEffect(() => {
    const loaded = loadFromStorage(storageKey);
    setItems(loaded);
    syncStock(loaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const isInWishlist = (bookId) => items.some((item) => item.id === bookId);

  const toggleWishlist = (book) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (exists) {
        return prev.filter((item) => item.id !== book.id);
      }
      return [...prev, { ...book, wasOutOfStock: book.quantity === 0 }];
    });
  };

  const clearWishlist = () => setItems([]);

  const dismissRestockAlert = (bookId) => {
    setRestockAlerts((prev) => prev.filter((alert) => alert.id !== bookId));
  };

  // Wishlist.jsx-ის mount-ზე გამოსაძახებლად - გვერდზე შესვლისას ყოველთვის
  // ცოცხალი მარაგით განახლდეს, login/logout-ის მოლოდინის გარეშე
  const refreshRestocks = useCallback(() => {
    syncStock(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const value = {
    items,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    restockAlerts,
    dismissRestockAlert,
    refreshRestocks,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist უნდა გამოიყენო მხოლოდ <WishlistProvider>-ის შიგნით');
  }
  return context;
}