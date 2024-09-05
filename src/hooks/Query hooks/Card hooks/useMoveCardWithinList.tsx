import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { IList } from "@/types/list.types";
import { countDecimalPlaces, reOrderCardPositions } from "@/utils/utilFuncs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function moveCardWithinListApi(cardId: string, newPos: number) {
  try {
    const res = await api.patch(`/card/${cardId}/position`, {
      newPosition: newPos,
    });
    return res.data;
  } catch (error) {
    console.log("moveCardWithinListApi", error);
  }
}

export function useMoveCardWithinList(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      newPos,
    }: {
      cardId: string;
      listId: string;
      newPos: number;
      lastIndex: number;
      destinationIndex: number;
      cardsInitialList: IList["cards"];
      targetCard: ICard;
    }) => moveCardWithinListApi(cardId, newPos),
    onMutate: async ({
      newPos,
      listId,
      lastIndex,
      destinationIndex,
      cardsInitialList,
      targetCard,
    }) => {
      const previousLists = qClient.getQueryData<IList[]>(["lists", boardId]);
      targetCard.position = newPos;
      if (previousLists) {
        const updatedCards = [...cardsInitialList];
        updatedCards.splice(lastIndex, 1);
        updatedCards.splice(destinationIndex, 0, {
          ...targetCard,
          position: newPos,
        });

        const updatedLists = previousLists.map((list) =>
          list._id === listId ? { ...list, cards: updatedCards } : list
        );

        if (countDecimalPlaces(newPos) > 10) {
          qClient.setQueryData(
            ["lists", boardId],
            reOrderCardPositions(updatedLists, listId)
          );
        } else {
          qClient.setQueryData(["lists", boardId], updatedLists);
        }
      }

      return { previousLists };
    },
    onError: (err, _, context) => {
      if (context?.previousLists) {
        qClient.setQueryData(["lists", boardId], context.previousLists);
      }
      console.error("Error updating list position:", err);
    },
  });
}
