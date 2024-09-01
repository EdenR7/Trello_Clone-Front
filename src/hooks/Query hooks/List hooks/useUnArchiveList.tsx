import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function unArchiveListApi(boardId: string, listId: string) {
  try {
    const res = await api.patch(`/board/${boardId}/list/${listId}/unarchive`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to unarchive list");
  }
}

export function useUnArchiveList(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, listId }: { boardId: string; listId: string }) =>
      unArchiveListApi(boardId, listId),
    onMutate: async ({ boardId, listId }) => {
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      if (prevBoard) {
        const newArchivedLists = prevBoard.archivedLists.filter(
          (list) => list.listId !== listId
        );
        qClient.setQueryData(["board", boardId], {
          ...prevBoard,
          archivedLists: newArchivedLists,
          listsNumber: prevBoard.listsNumber + 1,
        });
      }

      return { prevBoard };
    },
    onError(error, _, context) {
      console.log(error);
      if (context) {
        qClient.setQueryData(["board", boardId], context.prevBoard);
      }
    },
    onSettled: (__, _, { boardId }) => {
      qClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
