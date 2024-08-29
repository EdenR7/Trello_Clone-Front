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
        const cards = cardsInitialList;
        cards.splice(lastIndex, 1);
        cards.splice(destinationIndex, 0, targetCard);

        if (countDecimalPlaces(newPos) > 10) {
          qClient.setQueryData(
            ["lists", boardId],
            reOrderCardPositions(previousLists, listId)
          );
        } else {
          qClient.setQueryData(["lists", boardId], previousLists);
        }
      }

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        qClient.setQueryData(["lists", boardId], context.previousLists);
      }
      console.error("Error updating list position:", err);
    },
  });
}
