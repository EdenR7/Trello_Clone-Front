import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function toggleCardIsComplete(cardId: string) {
  const res = await api.patch(`/card/${cardId}/toggleComplete`);
  return res.data;
}

export default function useToggleCardIsComplete(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId }: { cardId: string }) =>
      toggleCardIsComplete(cardId),
    onMutate: async ({ cardId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (prevCard) {
        const updatedCard = { ...prevCard, isComplete: !prevCard.isComplete };
        queryClient.setQueryData(["card", cardId], updatedCard);
      }

      return {
        prevCard,
      };
    },
    onError: (_, { cardId }, context) => {
      if (context?.prevCard) {
        queryClient.setQueryData(["card", cardId], context.prevCard);
      }
    },
    onSettled: (_, __, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
