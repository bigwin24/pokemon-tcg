export interface TcgPlayerPrice {
  low: number;
  mid: number;
  high: number;
  market: number;
  directLow: number;
}

export interface TcgPlayer {
  url: string;
  updatedAt: string;
  prices: {
    normal: TcgPlayerPrice;
    holofoil: TcgPlayerPrice;
    reverseHolofoil: TcgPlayerPrice;
    "1stEditionHolofoil": TcgPlayerPrice;
    "1stEditionNormal": TcgPlayerPrice;
  };
}
