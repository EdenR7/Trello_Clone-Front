import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function archiveCard(boardId: string, cardId: string) {
  const res = await api.patch(
    `/board/${boardId}/card/${cardId}/archive`,
    archiveCard
  );
  return res.data;
}

interface ArchiveCardProps {
  cardId: string;
  boardId: string;
}

export default function useArchiveCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, cardId }: ArchiveCardProps) =>
      archiveCard(boardId, cardId),
    onMutate: async ({ cardId, boardId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });

      const prevBoard = queryClient.getQueryData<IBoard>(["board", boardId]);
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (prevBoard) {
        const updatedBoard = {
          ...prevBoard,
          archivedCards: [...prevBoard.archivedCards, cardId],
        };
        queryClient.setQueryData(["board", boardId], updatedBoard);
      }
      if (prevCard) {
        const updatedCard = { ...prevCard, isArchived: true };
        queryClient.setQueryData(["card", cardId], updatedCard);
      }

      return {
        prevBoard,
        prevCard,
      };
    },
    onError: (_, { cardId, boardId }, context) => {
      if (context) {
        queryClient.setQueryData(["board", boardId], context.prevBoard);
        queryClient.setQueryData(["card", cardId], context.prevCard);
      }
    },
    onSettled: (_, __, { cardId, boardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
