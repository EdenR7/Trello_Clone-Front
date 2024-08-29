export interface IBoardBackground {
  bgType: "color" | "gradient" | "image";
  background: string; // CSS color, gradient string, or image URL
}

export interface ILabel {
  _id: string;
  title: string;
  color: string;
}
export interface IBoard {
  _id: string;
  admin: string;
  bg: IBoardBackground;
  members: string[];
  labels: ILabel[];
  description?: string;
  name: string;
  listsNumber: number;
  archivedCards: string[];
  archivedLists: { listId: string; name: string }[];
}
