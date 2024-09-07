import api from "@/lib/api";
import { IList } from "@/types/list.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateListTitleApi(listId: string, newName: string) {
  try {
    const res = await api.patch(`/list/${listId}/name`, { newName });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUpdateListTitle(boardId: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, newName }: { listId: string; newName: string }) =>
      updateListTitleApi(listId, newName),
    onMutate: async ({ listId, newName }) => {
      await qClient.cancelQueries({ queryKey: ["lists", boardId] });
      const previousLists = qClient.getQueryData<IList[]>(["lists", boardId]);
      if (previousLists) {
        const newList = previousLists.find((l) => l._id === listId);
        if (!newList) throw new Error("List not found");
        newList.name = newName;
        const updatedLists = previousLists.map((l) => {
          if (l._id === listId) return newList;
          return l;
        });
        if (!updatedLists) throw new Error("List not found");
        qClient.setQueryData<IList[]>(["list", boardId], updatedLists);
      }
      return { previousLists };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousLists) {
        qClient.setQueryData<IList[]>(
          ["lists", boardId],
          context.previousLists
        );
      }
    },
  });
}
