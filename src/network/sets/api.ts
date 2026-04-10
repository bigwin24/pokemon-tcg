import { BASE_URL, headers } from "../settings";
import type { SetsResponse, Set } from "@/types/sets/set";

// 확장팩 목록 조회 — 필터용
export async function getSets() {
  const res = await fetch(`${BASE_URL}/sets?orderBy=-releaseDate`, {
    headers,
    next: { revalidate: 86400 }, // 24시간 캐시 (확장팩은 자주 안 바뀜)
  });

  if (!res.ok) throw new Error("확장팩 목록을 불러오지 못했습니다");

  const data: SetsResponse = await res.json();

  return data;
}

// 확장팩 목록 조회 — 필터용
export async function getSet({ id }: { id: string }) {
  const res = await fetch(`${BASE_URL}/sets/${id}`, {
    headers,
  });

  if (!res.ok) throw new Error("확장팩을 불러오지 못했습니다");

  const { data }: { data: Set } = await res.json();

  return data;
}

// export async function getSets({
//   query = "",
//   page = 1,
//   pageSize = 20,
// }: {
//   query?: string;
//   page?: number;
//   pageSize?: number;
// }): Promise<{ data: Set[]; totalCount: number }> {
//   const params = new URLSearchParams();
//   if (query) params.set("q", query);
//   params.set("page", page.toString());
//   params.set("pageSize", pageSize.toString());

//   const response = await fetch(`${BASE_URL}/sets?${params.toString()}`, {
//     headers,
//     next: { revalidate: 86400 }, // 24시간 캐시 (확장팩은 자주 안 바뀜)
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch sets");
//   }

//   const data: SetsResponse = await response.json();
//   return {
//     data: data.data,
//     totalCount: data.totalCount,
//   };
// }
