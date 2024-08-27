import { ICard } from "./card.types";

export interface IList {
  _id: string;
  board: string;
  isArchived: boolean;
  name: string;
  position: number;
  cards: ICard[];
}
