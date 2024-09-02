import { IBoardBackground } from "@/types/board.types";
import { IList } from "@/types/list.types";

export function countDecimalPlaces(number: number) {
  const numStr = number.toString();
  if (numStr.includes(".")) {
    return numStr.split(".")[1].length;
  }
  return 0;
}

export function reorderListPositions(lists: IList[]) {
  const sortedLists = lists.sort((a, b) => a.position - b.position);
  return sortedLists.map((list, index) => ({ ...list, position: index + 1 }));
}

export function reOrderCardPositions(
  lists: IList[],
  destinationListId: string
) {
  console.log(lists, destinationListId);

  const destinationList = lists.find((list) => list._id === destinationListId);
  if (!destinationList) return lists;

  const sortedCards = destinationList.cards.sort(
    (a, b) => a.position - b.position
  );

  return lists.map((list) => {
    if (list._id === destinationListId) {
      return {
        ...list,
        cards: sortedCards.map((card, index) => ({
          ...card,
          position: index + 1,
        })),
      };
    }
    return list;
  });
}

export type BoardStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
};

export function getBoardBgStyle(bg: IBoardBackground) {
  let boardStyle: BoardStyle | undefined;
  if (bg) {
    boardStyle = {
      ...(bg.bgType === "color" && {
        backgroundColor: bg.background,
      }),
      ...(bg.bgType === "gradient" && {
        backgroundImage: bg.background,
      }),
      ...(bg.bgType === "image" && {
        backgroundImage: `url(${bg.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
    };
  }
  return boardStyle;
}
