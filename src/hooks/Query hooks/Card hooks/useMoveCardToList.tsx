import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { IList } from "@/types/list.types";
import { countDecimalPlaces, reOrderCardPositions } from "@/utils/utilFuncs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function moveCardToListApi(
  cardId: string,
  listId: string,
  newPos: number
) {
  try {
    const res = await api.patch(`/card/${cardId}/list/position/${listId}`, {
      newPosition: newPos,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useMoveCardToList(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      listId,
      newPos,
    }: {
      cardId: string;
      listId: string;
      newPos: number;
      sourceIndex: number;
      targetCard: ICard;
      cardInitialList: IList;
      destinationIndex: number;
      cardFinalList: IList;
      previousLists: IList[];
    }) => moveCardToListApi(cardId, listId, newPos),
    onMutate: async ({
      newPos,
      listId,
      sourceIndex,
      targetCard,
      cardInitialList,
      cardFinalList,
      destinationIndex,
      previousLists,
    }) => {
      targetCard.position = newPos;
      if (previousLists) {
        cardInitialList?.cards.splice(sourceIndex, 1);
        const cardFinalListCards = cardFinalList.cards;
        cardFinalListCards?.splice(destinationIndex, 0, targetCard);

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
