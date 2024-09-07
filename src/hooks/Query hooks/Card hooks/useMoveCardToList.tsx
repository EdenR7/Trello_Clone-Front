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
      cardId,
    }) => {
      await qClient.cancelQueries({ queryKey: ["lists", listId] });
      await qClient.cancelQueries({ queryKey: ["card", cardId] });
      if (previousLists) {
        const initialList = [...cardInitialList.cards];
        initialList.splice(sourceIndex, 1);
        const finalList = [...cardFinalList.cards];
        finalList.splice(destinationIndex, 0, {
          ...targetCard,
          position: newPos,
        });

        const updatedLists = previousLists.map((list) => {
          if (list._id === cardFinalList._id) {
            return { ...list, cards: finalList };
          } else if (list._id === cardInitialList._id) {
            return { ...list, cards: initialList };
          } else {
            return list;
          }
        });

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
    onSettled: (_, __, { listId, cardId }) => {
      qClient.invalidateQueries({ queryKey: ["lists", listId] });
      qClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });
}
