import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateBoardNameApi(boardId: string, name: string) {
  try {
    const res = await api.patch(`/board/${boardId}/name`, { name });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUpdateName(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name }: { name: string }) =>
      updateBoardNameApi(boardId, name),
    onMutate: async ({ name }) => {
      const previousData: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      qClient.setQueryData(["board", boardId], { ...previousData, name });
      return { previousData };
    },
    onError(error, __, context) {
      console.log(error);
      qClient.setQueryData(["board", boardId], context?.previousData);
    },
  });
}
