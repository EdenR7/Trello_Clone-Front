import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface deleteTodoParams {
  cardId: string;
  checklistId: string;
  todoId: string;
}

async function deleteTodo(cardId: string, checklistId: string, todoId: string) {
  const res = await api.patch(`/card/${cardId}/checklist/removeTodo`, {
    checklistId,
    todoId,
  });
  return res.data;
}

export function useDeleteTodo(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, checklistId, todoId }: deleteTodoParams) =>
      deleteTodo(cardId, checklistId, todoId),
    onMutate: async ({ cardId, checklistId, todoId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });

      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          checklist: prevCard.checklist.map((checklist) =>
            checklist._id === checklistId
              ? {
                  ...checklist,
                  todos: checklist.todos.filter((todo) => todo._id !== todoId),
                }
              : checklist
          ),
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
