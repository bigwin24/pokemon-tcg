export interface CardPrice {
  low: number | null;
  mid: number | null;
  high: number | null;
  market: number | null;
  directLow: number | null;
}

export interface CardPrices {
  normal?: CardPrice;
  holofoil?: CardPrice;
  reverseHolofoil?: CardPrice;
  "1stEditionHolofoil"?: CardPrice;
}

export interface CardImage {
  small: string;
  large: string;
}

export interface CardSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images: {
    symbol: string;
    logo: string;
  };
}

export interface PokemonCard {
  id: string;
  name: string;
  supertype: string; // Pokemon / Trainer / Energy
  subtypes: string[];
  hp?: string;
  types?: string[];
  rarity: string;
  images: CardImage;
  set: CardSet;
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: CardPrices;
  };
  number: string;
  artist?: string;
}

export interface CardsResponse {
  data: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

// 시세 차트용
export interface PriceHistory {
  date: string;
  market: number;
  low: number;
  high: number;
}
