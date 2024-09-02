import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type formattedDateType = Partial<{ startDate: string; dueDate: string }>;

async function addCardDates(cardId: string, formattedDate: formattedDateType) {
  const res = await api.post(`/card/${cardId}/date/add`, formattedDate);
  return res.data;
}

interface AddCardDatesProps {
  cardId: string;
  formattedDate: formattedDateType;
}

export default function useAddCardDates(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, formattedDate }: AddCardDatesProps) =>
      addCardDates(cardId, formattedDate),
    onMutate: async ({ cardId, formattedDate }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });

      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (prevCard) {
        const updatedCard: ICard = {
          ...prevCard,
          // Update or clear the startDate
          startDate: formattedDate.startDate
            ? new Date(formattedDate.startDate)
            : undefined,
          // Update or clear the dueDate
          dueDate: formattedDate.dueDate
            ? new Date(formattedDate.dueDate)
            : undefined,
        };
        queryClient.setQueryData(["card", cardId], updatedCard);
      }

      return { prevCard };
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
