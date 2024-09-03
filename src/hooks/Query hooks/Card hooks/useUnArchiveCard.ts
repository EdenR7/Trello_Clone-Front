import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { ICard } from "@/types/card.types";
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
    mutationFn: ({ cardId }: { cardId: string }) =>
      unarchiveCardApi(boardId, cardId),
    onMutate: async ({ cardId }) => {
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      const prevCard: ICard | undefined = qClient.getQueryData([
        "card",
        cardId,
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
      if (prevCard) {
        const updatedCard = { ...prevCard, isArchived: false };
        qClient.setQueryData(["card", cardId], updatedCard);
      }
      return { prevBoard, prevCard };
    },
    onError(error, { cardId }, context) {
      console.log(error);
      if (context) {
        qClient.setQueryData(["board", boardId], context.prevBoard);
        qClient.setQueryData(["card", cardId], context.prevCard);
      }
    },
    onSettled: (_, __, { cardId }) => {
      qClient.invalidateQueries({ queryKey: ["lists", boardId] });
      qClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });
}
