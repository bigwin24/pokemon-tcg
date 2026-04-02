// src/store/collection.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonCard } from "@/types/pokemon";

interface CollectionStore {
  favorites: PokemonCard[];
  addFavorite: (card: PokemonCard) => void;
  removeFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
  clearAll: () => void;
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (card) =>
        set((state) => ({
          favorites: [...state.favorites, card],
        })),

      removeFavorite: (cardId) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.id !== cardId),
        })),

      isFavorite: (cardId) => get().favorites.some((c) => c.id === cardId),

      clearAll: () => set({ favorites: [] }),
    }),
    {
      name: "card-scope-collection", // localStorage key
    },
  ),
);
