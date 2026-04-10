"use server";

import { getCards } from "@/network/card/api";
import type { Card } from "@/types/cards/card";

const PAGE_SIZE = 20;

export async function fetchCardsByQuery(
  apiQuery: string,
  page: number,
): Promise<{ cards: Card[]; totalCount: number }> {
  const { data, totalCount } = await getCards({
    query: apiQuery,
    page,
    pageSize: PAGE_SIZE,
  });
  return { cards: data, totalCount };
}
