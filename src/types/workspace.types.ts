import { IBoard } from "./board.types";

export type IWorksapceBoard = Omit<
  IBoard,
  "labels" | "members" | "archivedCards"
> & {
  labels: string;
  members: string;
  archivedCards: string;
};

export interface IWorkspace {
  name: string;
  shortName: string;
  description: string;
  boards: IWorksapceBoard[];
  members: string[];
  admin: string;
  bg: string;
  _id: string;
}
