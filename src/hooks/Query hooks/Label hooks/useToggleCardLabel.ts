import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
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
        const isLabelPresent = prevCard.labels.some(
          (label) => label._id === labelId
        );
        let updatedLabels;
        if (isLabelPresent) {
          // Remove the label if it's already present
          updatedLabels = prevCard.labels.filter(
            (label) => label._id !== labelId
          );
        } else {
          // Add the label if it's not present
          const boardLabels =
            queryClient.getQueryData<IBoard>(["board", boardId])?.labels || [];
          const labelToAdd = boardLabels.find((label) => label._id === labelId);
          if (labelToAdd) {
            updatedLabels = [...prevCard.labels, labelToAdd];
          } else {
            updatedLabels = prevCard.labels;
          }
        }

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
