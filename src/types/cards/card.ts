import { Images } from "./images";
import { Legalities } from "../legalities";
import { Set } from "../sets/set";
import { SubTypes } from "../sub-types";
import { SuperTypes } from "../super-types";
import { Types } from "../types";
import { Ability } from "./ability";
import { Attack } from "./attack";
import { CardMarket } from "./card-market";
import { TcgPlayer } from "./tcg-player";
import { Weakness } from "./weakness";

export interface Card {
  id: string;
  name: string;
  supertype: SuperTypes;
  subtypes: SubTypes[];
  hp: string;
  types: Types[];
  evolvesFrom: string;
  evolvesTo: string[];
  rules: string[];
  ancientTrait: {
    name: string;
    text: string;
  };
  abilities: Ability[];
  attacks: Attack[];
  weaknesses: Weakness[];
  resistances: { type: string; value: string }[];
  retreatCost: string[];
  convertedRetreatCost: number;
  set: Set;
  number: string;
  artist: string;
  rarity: string;
  flavorText: string;
  nationalPokedexNumbers: number[];
  legalities: Legalities;
  images: Images;
  tcgplayer: TcgPlayer;
  cardmarket: CardMarket;
}

export interface CardsResponse {
  data: Card[];
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
