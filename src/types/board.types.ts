export interface IBoard {
  _id: string;
  admin: string;
  bg: string;
  members: string[];
  labels: string[];
  description?: string;
  name: string;
  listsNumber: number;
  archivedCards: string[];
  archivedLists: { listId: string; name: string }[];
}
