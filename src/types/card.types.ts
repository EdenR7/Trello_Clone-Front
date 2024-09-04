import { ILabel, IMember } from "./board.types";
import { IChecklist } from "./checklist.types";

interface ICardMember extends IMember {
  memberId: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface ICardList {
  _id: string;
  board: string;
  isArchived: boolean;
  name: string;
  position: number;
  cards: string[];
}

export interface ICard {
  _id: string;
  admin: string;
  bgCover: { isCover: boolean; bg: string };
  dueDate?: Date;
  checklist: IChecklist[];
  startDate?: Date;
  isArchived: boolean;
  labels: ILabel[];
  list: ICardList;
  members: ICardMember[];
  position: number;
  description: string;
  title: string;
  isComplete: boolean;
}

export interface IArchiveCard extends Omit<ICard, "list"> {
  list: string;
}
