import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function removeBackground(cardId: string) {
  const res = await api.delete(`/card/${cardId}/bg/remove`);
  return res.data;
}

export default function useRemoveBackground(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId }: { cardId: string }) => removeBackground(cardId),
    onMutate: async ({ cardId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          bgCover: { bg: "", isCover: false },
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
