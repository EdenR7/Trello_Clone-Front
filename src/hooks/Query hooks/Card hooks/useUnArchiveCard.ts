import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function unarchiveCardApi(boardId: string, cardId: string) {
  try {
    const res = await api.patch(`/board/${boardId}/card/${cardId}/unarchive`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUnArchiveCard(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, cardId }: { boardId: string; cardId: string }) =>
      unarchiveCardApi(boardId, cardId),
    onMutate: async ({ boardId, cardId }) => {
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      if (prevBoard) {
        const newArchivedCards = prevBoard.archivedCards.filter(
          (card) => card._id !== cardId
        );
        qClient.setQueryData(["board", boardId], {
          ...prevBoard,
          archivedCards: newArchivedCards,
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
    onSettled: (_, __, { boardId }) => {
      qClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
