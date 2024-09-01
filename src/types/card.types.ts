import { ILabel, IMember } from "./board.types";
import { IChecklist } from "./checklist.types";
import { IList } from "./list.types";

interface ICardMember extends IMember {
  memberId: string;
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
  list: IList;
  members: ICardMember[];
  position: number;
  description: string;
  title: string;
}

export interface IArchiveCard extends Omit<ICard, "list"> {
  list: string;
}
