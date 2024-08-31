import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function changeBackground(cardId: string, color: string) {
  const res = await api.patch(`/card/${cardId}/bg/color`, { color });
  return res.data;
}

export default function useChangeBackground(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, color }: { cardId: string; color: string }) =>
      changeBackground(cardId, color),
    onMutate: async ({ cardId, color }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          bgCover: { ...prevCard.bgCover, bg: color },
        };
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
