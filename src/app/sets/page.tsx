import { Suspense } from "react";
import { getSets } from "@/network/sets/api";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/sets/search-bar";
import { SetItem } from "@/components/sets/set-item";

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
  //   const { data: cards, totalCount } = await getSets({
  //     query: query ? `name:${query}*` : "",
  //     page,
  //     pageSize: 20,
  //   });

  const { data: cards, totalCount } = await getSets();

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
          <SetItem key={card.id} set={card} />
        ))}
      </div>
    </div>
  );
}

export default async function SetsPage({ searchParams }: PageProps) {
  const { q, page: pageParam } = await searchParams; // await 추가
  const query = q ?? "";
  const page = Number(pageParam ?? 1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">확장팩 검색</h1>
        <p className="text-muted-foreground text-sm mt-1">
          확장팩 이름으로 검색하세요
        </p>
      </div>

      <SearchBar defaultValue={query} />

      <Suspense key={query + page} fallback={<CardGridSkeleton />}>
        <CardGrid query={query} page={page} />
      </Suspense>
    </div>
  );
}
