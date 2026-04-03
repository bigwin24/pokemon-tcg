// 카드 목록 조회 (검색 + 페이지네이션)
import type { Card, CardsResponse } from "@/types/cards/card";
import { BASE_URL, headers } from "../settings";

export async function getCards({
  query = "",
  page = 1,
  pageSize = 20,
  orderBy = "-set.releaseDate",
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
} = {}): Promise<CardsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });

  if (query) {
    params.set("q", query);
  }

  const res = await fetch(`${BASE_URL}/cards?${params}`, {
    headers,
    next: { revalidate: 3600 }, // 1시간 캐시
  });

  console.log("카드목록: ", res);

  if (!res.ok) throw new Error("카드 목록을 불러오지 못했습니다");

  return res.json();
}

// 단일 카드 조회
export async function getCard(id: string): Promise<Card> {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`카드를 찾을 수 없습니다: ${id}`);

  const json = await res.json();
  return json.data;
}

// 인기 카드 (시세 높은 순) — 메인 페이지용
export async function getTopPricedCards(limit = 10): Promise<Card[]> {
  const res = await fetch(
    `${BASE_URL}/cards?q=rarity:"Rare Secret"&pageSize=25`,
    {
      headers,
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return [];

  const json: CardsResponse = await res.json();

  return json.data
    .filter((card) => card.tcgplayer?.prices.holofoil?.market)
    .sort((a, b) => {
      const aPrice = a.tcgplayer?.prices.holofoil.market ?? 0;
      const bPrice = b.tcgplayer?.prices.holofoil.market ?? 0;
      return bPrice - aPrice;
    })
    .slice(0, limit);
}

// 시세 히스토리 시뮬레이션
// Pokemon TCG API는 현재 시세만 제공하므로, 현재가 기준으로 과거 30일 데이터를 생성
export function generatePriceHistory(currentPrice: number, days = 30) {
  const history = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 현재가 기준 ±20% 범위에서 자연스러운 가격 흐름 생성
    const volatility = 0.03;
    const trend = (Math.random() - 0.48) * volatility;
    const prevPrice =
      i === days
        ? currentPrice * (0.85 + Math.random() * 0.3)
        : history[history.length - 1].market;

    const market = Math.max(0.01, prevPrice * (1 + trend));

    history.push({
      date: date.toISOString().split("T")[0],
      market: Number(market.toFixed(2)),
      low: Number((market * 0.92).toFixed(2)),
      high: Number((market * 1.08).toFixed(2)),
    });
  }

  return history;
}
