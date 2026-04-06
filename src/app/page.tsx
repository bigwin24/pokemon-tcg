import { Suspense } from "react";
import { TrendingUp, Database, Layers } from "lucide-react";
import { getTopPricedCards, getCards } from "@/network/card/action";
import { CardItem } from "@/components/cards/card-item";
import { Skeleton } from "@/components/ui/skeleton";

// 요약 수치 카드
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
      <div className="p-2.5 bg-primary/10 rounded-lg">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// 카드 그리드 스켈레톤
function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2.5/3.5] rounded-xl" />
      ))}
    </div>
  );
}

// 고가 카드 섹션 — Server Component
async function TopCards() {
  const cards = await getTopPricedCards(10);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}

// 최신 카드 섹션 — Server Component
async function LatestCards() {
  const { data: cards } = await getCards({ pageSize: 10 });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground text-sm mt-1">
          포켓몬 TCG 카드 시세 현황
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Database} label="총 카드 수" value="18,000+" />
        <StatCard icon={Layers} label="총 확장팩 수" value="150+" />
        <StatCard icon={TrendingUp} label="오늘 업데이트" value="실시간" />
      </div>

      {/* 고가 카드 TOP 10 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">💰 시세 TOP 10</h2>
        <Suspense fallback={<CardGridSkeleton />}>
          <TopCards />
        </Suspense>
      </section>

      {/* 최신 카드 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">🆕 최신 카드</h2>
        <Suspense fallback={<CardGridSkeleton />}>
          <LatestCards />
        </Suspense>
      </section>
    </div>
  );
}
