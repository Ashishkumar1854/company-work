"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PhoneItem } from "@/lib/api";

type WishlistContextValue = {
  items: PhoneItem[];
  count: number;
  isWishlisted: (id: string) => boolean;
  add: (item: PhoneItem) => void;
  remove: (id: string) => void;
  toggle: (item: PhoneItem) => void;
};

const STORAGE_KEY = "mobiles24-wishlist";

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStorage(): PhoneItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items: PhoneItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PhoneItem[]>([]);

  useEffect(() => {
    setItems(readStorage());
  }, []);

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  const value = useMemo<WishlistContextValue>(() => {
    const isWishlisted = (id: string) =>
      items.some((item) => String(item.id) === String(id));

    const add = (item: PhoneItem) => {
      setItems((prev) => {
        if (prev.some((p) => String(p.id) === String(item.id))) return prev;
        return [item, ...prev];
      });
    };

    const remove = (id: string) => {
      setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    };

    const toggle = (item: PhoneItem) => {
      setItems((prev) => {
        const exists = prev.some((p) => String(p.id) === String(item.id));
        if (exists) {
          return prev.filter((p) => String(p.id) !== String(item.id));
        }
        return [item, ...prev];
      });
    };

    return {
      items,
      count: items.length,
      isWishlisted,
      add,
      remove,
      toggle,
    };
  }, [items]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
