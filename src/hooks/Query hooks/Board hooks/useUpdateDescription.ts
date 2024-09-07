import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function editDescriptionApi(boardId: string, description: string) {
  try {
    const res = await api.patch(`/board/${boardId}/description`, {
      description,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUpdateDescription({ boardId }: { boardId: string }) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      boardId,
      description,
    }: {
      boardId: string;
      description: string;
    }) => editDescriptionApi(boardId, description),
    onMutate: ({ description }) => {
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      qClient.setQueryData(["board", boardId], (oldData: IBoard) => {
        return {
          ...oldData,
          description,
        };
      });
      return { prevBoard };
    },
    onError(_, __, context) {
      if (context?.prevBoard) {
        qClient.setQueryData(["board", boardId], context?.prevBoard);
      }
    },
  });
}
