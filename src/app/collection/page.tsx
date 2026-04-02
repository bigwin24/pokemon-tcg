"use client";

import { useCollectionStore } from "@/store/collection";
import { CardItem } from "@/components/cards/card-item";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";

export default function CollectionPage() {
  const { favorites, clearAll } = useCollectionStore();

  if (favorites.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full min-h-96 text-center">
        <Heart size={48} className="text-muted-foreground/30 mb-4" />
        <h1 className="text-xl font-semibold">컬렉션이 비어있습니다</h1>
        <p className="text-muted-foreground text-sm mt-2">
          카드 상세 페이지에서 하트를 눌러 저장하세요
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 컬렉션</h1>
          <p className="text-muted-foreground text-sm mt-1">
            저장된 카드{" "}
            <span className="font-semibold text-foreground">
              {favorites.length}
            </span>
            장
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive gap-1.5"
          onClick={clearAll}
        >
          <Trash2 size={14} />
          전체 삭제
        </Button>
      </div>

      {/* 총 시세 */}
      <div className="bg-card border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">컬렉션 총 시세 (추정)</p>
        <p className="text-2xl font-bold mt-1">
          $
          {favorites
            .reduce((sum, card) => {
              const prices = card.tcgplayer?.prices;
              const price =
                prices?.holofoil?.market ??
                prices?.normal?.market ??
                prices?.reverseHolofoil?.market ??
                0;
              return sum + price;
            }, 0)
            .toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favorites.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
