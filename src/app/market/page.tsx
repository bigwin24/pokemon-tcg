import { getCards } from "@/network/card/api";
import { CardItem } from "@/components/cards/card-item";
import { MarketChart } from "@/components/charts/market-chart";

async function getMarketData() {
  const [holoData, exData, vData] = await Promise.all([
    getCards({ query: 'rarity:"Rare Holo"', pageSize: 20 }),
    getCards({ query: 'rarity:"Rare Ultra"', pageSize: 20 }),
    getCards({ query: 'rarity:"Rare Holo VMAX"', pageSize: 20 }),
  ]);
  return { holoData, exData, vData };
}

export default async function MarketPage() {
  const { holoData, exData, vData } = await getMarketData();

  const sections = [
    { label: "⚡ Rare Holo TOP", cards: holoData.data },
    { label: "💎 Ultra Rare TOP", cards: exData.data },
    { label: "👑 VMAX TOP", cards: vData.data },
  ];

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">시장 분석</h1>
        <p className="text-muted-foreground text-sm mt-1">
          레어리티별 시세 상위 카드
        </p>
      </div>

      {/* 레어리티별 평균 시세 차트 */}
      <div className="bg-card border rounded-xl p-5">
        <h2 className="font-semibold mb-4">레어리티별 평균 시세 비교</h2>
        <MarketChart
          data={[
            { label: "Common", value: 0.15 },
            { label: "Uncommon", value: 0.3 },
            { label: "Rare", value: 1.2 },
            { label: "Rare Holo", value: 3.5 },
            { label: "Rare Ultra", value: 12.0 },
            { label: "Rare Holo VMAX", value: 18.0 },
            { label: "Rare Secret", value: 35.0 },
            { label: "Rare Rainbow", value: 42.0 },
          ]}
        />
      </div>

      {/* 섹션별 카드 목록 */}
      {sections.map(({ label, cards }) => (
        <section key={label}>
          <h2 className="text-lg font-semibold mb-4">{label}</h2>
          {cards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">데이터 없음</p>
          )}
        </section>
      ))}
    </div>
  );
}
