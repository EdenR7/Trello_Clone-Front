export interface IChecklist {
  name: string;
  todos: ITodo[];
  _id: string;
}

export interface ITodo {
  _id: string;
  isComplete: false;
  title: string;
}
