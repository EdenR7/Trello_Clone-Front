interface IBoardBackground {
  type: "color" | "gradient" | "image";
  value: string; // CSS color, gradient string, or image URL
}

export interface IBoard {
  _id: string;
  admin: string;
  bg: IBoardBackground;
  members: string[];
  labels: string[];
  description?: string;
  name: string;
  listsNumber: number;
  archivedCards: string[];
  archivedLists: { listId: string; name: string }[];
}
