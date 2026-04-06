"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CardItem } from "./card-item";
import { Skeleton } from "@/components/ui/skeleton";
import type { Card } from "@/types/cards/card";

interface Props {
  initialCards: Card[];
  totalCount: number;
  loadMore: (page: number) => Promise<{ cards: Card[]; totalCount: number }>;
}

export function CardGridInfinite({ initialCards, totalCount, loadMore }: Props) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [page, setPage] = useState(2);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = cards.length < totalCount;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          startTransition(async () => {
            const { cards: next } = await loadMore(page);
            setCards((prev) => [...prev, ...next]);
            setPage((p) => p + 1);
          });
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isPending, loadMore, page]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        총{" "}
        <span className="font-semibold text-foreground">
          {totalCount.toLocaleString()}
        </span>
        장
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
        {isPending &&
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={`sk-${i}`} className="aspect-2.5/3.5 rounded-xl" />
          ))}
      </div>

      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
