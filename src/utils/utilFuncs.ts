import { IList } from "@/types/list.types";

export function reorderListPositions(lists: IList[]) {
  const sortedLists = lists.sort((a, b) => a.position - b.position);
  return sortedLists.map((list, index) => ({ ...list, position: index + 1 }));
}
