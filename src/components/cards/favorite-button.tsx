"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollectionStore } from "@/store/collection";
import type { Card } from "@/types/cards/card";
import { cn } from "@/lib/utils";

export function FavoriteButton({ card }: { card: Card }) {
  const { isFavorite, addFavorite, removeFavorite } = useCollectionStore();
  const favorited = isFavorite(card.id);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (favorited ? removeFavorite(card.id) : addFavorite(card))}
      className={cn(favorited && "border-red-400 text-red-400")}
    >
      <Heart size={16} fill={favorited ? "currentColor" : "none"} />
    </Button>
  );
}
