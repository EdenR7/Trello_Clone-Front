import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface toggleTodoParams {
  cardId: string;
  checklistId: string;
  todoId: string;
}

async function toggleTodoComplete(
  cardId: string,
  checklistId: string,
  todoId: string
) {
  const res = await api.patch(`/card/${cardId}/checklist/toggleComplete`, {
    checklistId,
    todoId,
  });
  return res.data;
}

export function useToggleTodoComplete(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, checklistId, todoId }: toggleTodoParams) =>
      toggleTodoComplete(cardId, checklistId, todoId),
    onMutate: async ({ cardId, checklistId, todoId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });

      const previousCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (previousCard) {
        const updatedCard = {
          ...previousCard,
          checklist: previousCard.checklist.map((checklist) =>
            checklist._id === checklistId
              ? {
                  ...checklist,
                  todos: checklist.todos.map((todo) =>
                    todo._id === todoId
                      ? { ...todo, isComplete: !todo.isComplete }
                      : todo
                  ),
                }
              : checklist
          ),
        };

        queryClient.setQueryData(["card", cardId], updatedCard);
      }
      return { previousCard };
    },
    onError: (_, { cardId }, context) => {
      if (context?.previousCard) {
        queryClient.setQueryData<ICard>(["card", cardId], context.previousCard);
      }
    },
    onSettled: (_, __, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
