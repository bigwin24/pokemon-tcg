import type { Images } from "./images";
import type { Legalities } from "../legalities";

export interface Set {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities;
  ptcgoCode?: string;
  releaseDate: string;
  updatedAt: string;
  images: Images;
}

export interface SetsResponse {
  data: Set[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}
