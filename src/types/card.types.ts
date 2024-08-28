import { IChecklist } from "./checklist.types";
import { IMember } from "./member.types";

export interface ICard {
  _id: string;
  admin: string;
  bgCover: { isCover: boolean; bg: string };
  dueDate?: Date;
  checklist: IChecklist[];
  startDate?: Date;
  isArchived: boolean;
  labels: string[];
  list: string;
  members: IMember[];
  position: number;
  title: string;
}