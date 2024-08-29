import api from "@/lib/api";
import { IList } from "@/types/list.types";
import { countDecimalPlaces, reorderListPositions } from "@/utils/utilFuncs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateListPos(listId: string, newPos: number) {
  try {
    const res = await api.patch(`/list/${listId}/position`, {
      newPosition: newPos,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useListUpdatePosition(boardId: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      newPos,
    }: {
      listId: string;
      newPos: number;
      draggedList: IList;
      newLoc: number;
    }) => updateListPos(listId, newPos),
    onMutate: async ({ listId, newPos, draggedList, newLoc }) => {
      const previousLists = qClient.getQueryData<IList[]>(["lists", boardId]);

      if (previousLists) {
        const newLists = previousLists.filter((list) => list._id !== listId);

        newLists.splice(newLoc, 0, { ...draggedList, position: newPos }!);

        if (countDecimalPlaces(newPos) > 10) {
          qClient.setQueryData(
            ["lists", boardId],
            reorderListPositions(newLists)
          );
        } else {
          qClient.setQueryData(["lists", boardId], newLists);
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

    // onSettled: () => {
    //   qClient.invalidateQueries({ queryKey: ["lists", boardId] });
    // },
  });
}
