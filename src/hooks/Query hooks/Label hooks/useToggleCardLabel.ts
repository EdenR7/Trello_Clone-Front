import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function toggleCardLabel(cardId: string, labelId: string) {
  const res = await api.patch(`/card/${cardId}/label/toggle`, { labelId });
  return res.data;
}

interface ToggleCardLabelProps {
  cardId: string;
  labelId: string;
}

export function useToggleCardLabel(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, labelId }: ToggleCardLabelProps) =>
      toggleCardLabel(cardId, labelId),
    onMutate: async ({ cardId, labelId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedLabels = prevCard.labels.includes(labelId)
          ? prevCard.labels.filter((id) => id !== labelId)
          : [...prevCard.labels, labelId];

        queryClient.setQueryData(["card", cardId], {
          ...prevCard,
          labels: updatedLabels,
        });
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
