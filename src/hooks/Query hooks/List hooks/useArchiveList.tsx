import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { IList } from "@/types/list.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function ArchiveListApi(boardId: string, listId: string) {
  try {
    const res = await api.patch(`/board/${boardId}/list/${listId}/archive`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useArchiveList(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId }: { listId: string }) =>
      ArchiveListApi(boardId, listId),
    onMutate: async ({ listId }) => {
      await qClient.cancelQueries(["board", boardId] as any);
      const previousBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      const previousLists: IList[] | undefined = qClient.getQueryData([
        "lists",
        boardId,
      ]);
      if (!previousBoard || !previousLists) throw new Error("No data found");

      const newList = previousLists.find((list) => list._id === listId);
      if (!newList) throw new Error("List not found");
      newList.isArchived = true;

      const b: IBoard = {
        ...previousBoard,
        archivedLists: [
          ...previousBoard.archivedLists,
          { listId, name: newList.name },
        ],
        listsNumber: previousBoard.listsNumber - 1,
      };

      const updatedLists = previousLists.filter((list) => list._id !== listId);

      qClient.setQueryData(["board", boardId], b);
      qClient.setQueryData(["lists", boardId], updatedLists);

      return { previousBoard, previousLists };
    },
    onError: (error, _, context) => {
      console.log(error);
      qClient.setQueryData(["board", boardId], context?.previousBoard);
      qClient.setQueryData(["lists", boardId], context?.previousLists);
    },
    onSettled: () => {
      qClient.invalidateQueries(["board", boardId] as any);
    },
  });
}
