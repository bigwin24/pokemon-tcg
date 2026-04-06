import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/cards/search-bar";
import { CardGridInfinite } from "@/components/cards/card-grid-infinite";
import { fetchCardsByQuery } from "./actions";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="aspect-2.5/3.5 rounded-xl" />
      ))}
    </div>
  );
}

async function CardGridLoader({ query }: { query: string }) {
  const apiQuery = query ? `name:${query}*` : "";
  const { cards, totalCount } = await fetchCardsByQuery(apiQuery, 1);

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
    <CardGridInfinite
      initialCards={cards}
      totalCount={totalCount}
      loadMore={fetchCardsByQuery.bind(null, apiQuery)}
    />
  );
}

export default async function CardsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q ?? "";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">카드 검색</h1>
        <p className="text-muted-foreground text-sm mt-1">
          포켓몬 이름으로 검색하세요
        </p>
      </div>

      <SearchBar defaultValue={query} />

      <Suspense key={query} fallback={<CardGridSkeleton />}>
        <CardGridLoader query={query} />
      </Suspense>
    </div>
  );
}
