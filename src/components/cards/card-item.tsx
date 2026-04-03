// src/components/cards/card-item.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollectionStore } from "@/store/collection";
import type { Card } from "@/types/cards/card";
import { cn } from "@/lib/utils";

interface Props {
  card: Card;
}

// 레어리티별 테두리 색상
const rarityBorder: Record<string, string> = {
  Common: "border-gray-300",
  Uncommon: "border-green-400",
  Rare: "border-blue-400",
  "Rare Holo": "border-purple-400",
  "Rare Ultra": "border-yellow-400",
  "Rare Secret": "border-yellow-500 shadow-yellow-400/50 shadow-md",
  "Amazing Rare": "border-pink-400",
  "Rare Rainbow": "border-pink-500 shadow-pink-400/50 shadow-md",
  "Rare Holo VMAX": "border-red-400 shadow-red-400/30 shadow-md",
  "Rare Holo V": "border-orange-400",
};

// 시세 포맷
function formatPrice(price: number | null | undefined) {
  if (!price) return "N/A";
  return `$${price.toFixed(2)}`;
}

// 카드의 대표 시세 추출
function getMarketPrice(card: Card) {
  const prices = card.tcgplayer?.prices;
  if (!prices) return null;
  return (
    prices.holofoil?.market ??
    prices.normal?.market ??
    prices.reverseHolofoil?.market ??
    null
  );
}

export function CardItem({ card }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useCollectionStore();
  const favorited = isFavorite(card.id);
  const price = getMarketPrice(card);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이동 방지
    favorited ? removeFavorite(card.id) : addFavorite(card);
  };

  return (
    <Link href={`/cards/${card.id}`}>
      <div
        className={cn(
          "group relative bg-card rounded-xl border-2 overflow-hidden",
          "hover:scale-105 transition-transform duration-200 cursor-pointer",
          rarityBorder[card.rarity] ?? "border-border",
        )}
      >
        {/* 즐겨찾기 버튼 */}
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute top-2 right-2 z-10 p-1.5 rounded-full",
            "bg-black/40 backdrop-blur-sm transition-colors",
            favorited ? "text-red-400" : "text-white/70 hover:text-red-400",
          )}
        >
          <Heart size={14} fill={favorited ? "currentColor" : "none"} />
        </button>

        {/* 카드 이미지 */}
        <div className="relative aspect-[2.5/3.5] bg-muted">
          <Image
            src={card.images.small}
            alt={card.name}
            fill
            className="object-contain p-1"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        </div>

        {/* 카드 정보 */}
        <div className="p-2.5 space-y-1.5">
          <p className="text-sm font-semibold truncate">{card.name}</p>

          <div className="flex items-center justify-between gap-1">
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {card.rarity ?? "Unknown"}
            </Badge>
            <span className="text-xs text-muted-foreground truncate">
              {card.set.name}
            </span>
          </div>

          {/* 시세 */}
          <div className="pt-1 border-t border-border/50">
            <p className="text-sm font-bold text-primary">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
