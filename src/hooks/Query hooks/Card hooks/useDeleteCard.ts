import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteCardApi(listId: string, cardId: string) {
  try {
    const res = await api.delete(`/list/${listId}/card/${cardId}`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useDeleteCard(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, cardId }: { listId: string; cardId: string }) =>
      deleteCardApi(listId, cardId),
    onMutate: async ({ cardId }) => {
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
    onError: (error, _, context) => {
      console.log(error);
      if (context?.prevBoard) {
        qClient.setQueryData(
          ["board", context.prevBoard._id],
          context.prevBoard
        );
      }
    },
    onSettled: (_, __, { cardId }) => {
      qClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });
}
