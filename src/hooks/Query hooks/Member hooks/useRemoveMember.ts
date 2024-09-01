import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function removeMember(cardId: string, memberId: string) {
  const res = await api.delete(`/card/${cardId}/member/remove/${memberId}`);
  return res.data;
}

export default function useRemoveMember(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, memberId }: { cardId: string; memberId: string }) =>
      removeMember(cardId, memberId),
    onMutate: async ({ cardId, memberId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          members: prevCard.members.filter(
            (member) => member.memberId !== memberId
          ),
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
    onSettled: (_, __, cardId) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
