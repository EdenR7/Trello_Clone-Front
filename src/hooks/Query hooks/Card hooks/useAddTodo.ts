// import api from "@/lib/api";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { ITodo } from "@/types/checklist.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddTodoParams {
  cardId: string;
  checklistId: string;
  todoTitle: string;
}

async function addTodo(cardId: string, checklistId: string, todoTitle: string) {
  const res = await api.post(`/card/${cardId}/checklist/addTodo`, {
    checklistId,
    todoTitle,
  });
  return res.data;
}

export function useAddTodo(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, checklistId, todoTitle }: AddTodoParams) =>
      addTodo(cardId, checklistId, todoTitle),
    onMutate: async ({ cardId, checklistId, todoTitle }) => {
      // Invalidate and refetch

      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const previousCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (previousCard) {
        const optimisticTodo: ITodo = {
          _id: `temp-${Date.now()}`, // Temporary ID
          isComplete: false,
          title: todoTitle,
        };

        const updatedCard: ICard = {
          ...previousCard,
          checklist: previousCard.checklist.map((checklist) =>
            checklist._id === checklistId
              ? {
                  ...checklist,
                  todos: [...checklist.todos, optimisticTodo],
                }
              : checklist
          ),
        };

        queryClient.setQueryData<ICard>(["card", cardId], updatedCard);
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
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}
