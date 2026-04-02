import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCard, generatePriceHistory } from "@/network/api";
import { PriceChart } from "@/components/charts/price-chart";
import { Card3DViewer } from "@/components/cards/card-3d-viewer";
import { FavoriteButton } from "@/components/cards/favorite-button";

interface Props {
  params: Promise<{ id: string }>;
}

function getMarketPrice(card: Awaited<ReturnType<typeof getCard>>) {
  const prices = card.tcgplayer?.prices;
  if (!prices) return null;
  return (
    prices.holofoil?.market ??
    prices.normal?.market ??
    prices.reverseHolofoil?.market ??
    null
  );
}

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id).catch(() => null);
  if (!card) notFound();

  const marketPrice = getMarketPrice(card);
  const priceHistory = marketPrice ? generatePriceHistory(marketPrice) : null;

  const prices = card.tcgplayer?.prices;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/cards"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        카드 목록으로
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽: 3D 뷰어 */}
        <div>
          <Card3DViewer imageUrl={card.images.large} rarity={card.rarity} />
        </div>

        {/* 오른쪽: 정보 + 차트 */}
        <div className="space-y-6">
          {/* 카드 기본 정보 */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{card.name}</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {card.set.name} · #{card.number}
                </p>
              </div>
              <FavoriteButton card={card} />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge>{card.rarity}</Badge>
              <Badge variant="outline">{card.supertype}</Badge>
              {card.types?.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* 시세 정보 */}
          {prices && (
            <div className="bg-card border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-sm">TCGPlayer 시세</h3>
              {Object.entries(prices).map(([type, price]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {type.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-medium">
                    ${price?.market?.toFixed(2) ?? "N/A"}
                  </span>
                </div>
              ))}
              {card.tcgplayer?.url && (
                <a
                  href={card.tcgplayer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  TCGPlayer에서 구매 <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          {/* 가격 차트 */}
          {priceHistory && (
            <div className="bg-card border rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">30일 시세 추이</h3>
              <PriceChart data={priceHistory} cardName={card.name} />
            </div>
          )}

          {/* 카드 상세 정보 */}
          <div className="bg-card border rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold">카드 정보</h3>
            {card.artist && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">일러스트레이터</span>
                <span>{card.artist}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">세트</span>
              <span>
                {card.set.series} — {card.set.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">발매일</span>
              <span>{card.set.releaseDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
