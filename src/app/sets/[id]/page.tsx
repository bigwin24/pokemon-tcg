import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSet } from "@/network/sets/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CardGridInfinite } from "@/components/cards/card-grid-infinite";
import { fetchCardsByQuery } from "@/app/cards/actions";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
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

async function CardGridLoader({ setId }: { setId: string }) {
  const apiQuery = `set.id:${setId}`;
  const { cards, totalCount } = await fetchCardsByQuery(apiQuery, 1);

  if (cards.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">카드가 없습니다</p>
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

export default async function SetsDetailPage({ params }: Props) {
  const { id } = await params;
  const set = await getSet({ id });

  console.log("set: ", set);
  if (!set) notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/cards"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        확장팩 목록으로
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽: 3D 뷰어 */}
        {/* <div>
          <Card3DViewer imageUrl={set.images.logo} rarity={set.} />
        </div> */}
        <Image src={set.images.logo} alt={set.name} width={350} height={350} />

        {/* 오른쪽: 정보 + 차트 */}
        <div className="space-y-6">
          {/* 카드 기본 정보 */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{set.name}</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {set.series}
                </p>
              </div>
            </div>

            {/* <div className="flex flex-wrap gap-2 mt-3">
              <Badge>{card.rarity}</Badge>
              <Badge variant="outline">{card.supertype}</Badge>
              {card.types?.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div> */}
          </div>

          {/* 카드 상세 정보 */}
          <div className="bg-card border rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold">확장팩 정보</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">확장팩</span>
              <span>
                {set.series} — {set.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">발매일</span>
              <span>{set.releaseDate}</span>
            </div>
          </div>
        </div>
      </div>

      <Suspense key={id} fallback={<CardGridSkeleton />}>
        <CardGridLoader setId={id} />
      </Suspense>
    </div>
  );
}
