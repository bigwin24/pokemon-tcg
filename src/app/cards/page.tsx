import { Suspense } from "react";
import { getCards } from "@/network/api";
import { CardItem } from "@/components/cards/card-item";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/cards/search-bar";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2.5/3.5] rounded-xl" />
      ))}
    </div>
  );
}

async function CardGrid({ query, page }: { query: string; page: number }) {
  const { data: cards, totalCount } = await getCards({
    query: query ? `name:${query}*` : "",
    page,
    pageSize: 20,
  });

  if (cards.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-lg font-medium">검색 결과가 없습니다</p>
        <p className="text-sm mt-1">다른 카드 이름으로 검색해보세요</p>
      </div>
    );
  }

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
      </div>
    </div>
  );
}

export default async function CardsPage({ searchParams }: PageProps) {
  const { q, page: pageParam } = await searchParams; // await 추가
  const query = q ?? "";
  const page = Number(pageParam ?? 1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">카드 검색</h1>
        <p className="text-muted-foreground text-sm mt-1">
          포켓몬 이름으로 검색하세요
        </p>
      </div>

      <SearchBar defaultValue={query} />

      <Suspense key={query + page} fallback={<CardGridSkeleton />}>
        <CardGrid query={query} page={page} />
      </Suspense>
    </div>
  );
}
