import { IArchiveCard } from "./card.types";

export type IBgType = "color" | "gradient" | "image";
export interface IBoardBackground {
  bgType: IBgType;
  background: string;
}

export interface ILabel {
  _id: string;
  title: string;
  color: string;
}
export interface IMember {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}
export interface IBoard {
  _id: string;
  admin: string;
  bg: IBoardBackground;
  members: IMember[];
  labels: ILabel[];
  description?: string;
  name: string;
  listsNumber: number;
  archivedCards: IArchiveCard[];
  archivedLists: { listId: string; name: string }[];
}
