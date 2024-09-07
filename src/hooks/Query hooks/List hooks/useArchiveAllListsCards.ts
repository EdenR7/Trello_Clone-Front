import api from "@/lib/api";
import { IList } from "@/types/list.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function archiveAllCardsInListApi(
  boardId: string,
  listId: string
) {
  try {
    const res = await api.patch(
      `/board/${boardId}/list/${listId}/cards/archive`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useArchiveAllListsCards(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId }: { listId: string }) =>
      archiveAllCardsInListApi(boardId, listId),
    onMutate: async ({ listId }) => {
      await qClient.cancelQueries({ queryKey: ["board", boardId] });
      await qClient.cancelQueries({ queryKey: ["lists", boardId] });
      const previousLists: IList[] | undefined = qClient.getQueryData([
        "lists",
        boardId,
      ]);
      const updatedLists = previousLists?.map((list) => {
        if (list._id === listId) {
          return { ...list, cards: [] };
        }
        return list;
      });
      console.log(updatedLists);

      if (previousLists) {
        qClient.setQueryData(["lists", boardId], updatedLists);
      }
      return { previousLists };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousLists) {
        qClient.setQueryData(["lists", boardId], context.previousLists);
      }
    },
    onSettled: () => {
      qClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}
