import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { IList } from "@/types/list.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createCardApi(listId: string, title: string) {
  try {
    const res = await api.post(`list/${listId}/card/add`, { title });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useCreateCard(boardId: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, title }: { listId: string; title: string }) =>
      createCardApi(listId, title),
    onMutate: ({ title, listId }) => {
      qClient.cancelQueries(["lists", boardId] as any);

      const prevLists: IList[] | undefined = qClient.getQueryData([
        "lists",
        boardId,
      ]);
      if (!prevLists) throw new Error("No data found");

      const listIndex = prevLists.findIndex((list) => list._id === listId);
      if (listIndex === -1) throw new Error("No list found");

      const cardList = prevLists[listIndex];

      const position =
        cardList.cards.length > 0
          ? cardList.cards[cardList.cards.length - 1].position + 1
          : 1;

      const newCard: ICard = {
        _id: "temp",
        admin: "temp",
        bgCover: { bg: "", isCover: false },
        checklist: [],
        description: "",
        isArchived: false,
        isComplete: false,
        labels: [],
        list: cardList,
        members: [],
        title,
        position,
      };
      cardList.cards.push(newCard);

      qClient.setQueryData(["lists", boardId], [...prevLists]);
      return { prevLists };
    },

    onError: (error, _, context) => {
      console.log(error);
      qClient.setQueryData(["lists", boardId], context?.prevLists);
    },
    onSettled: () => {
      qClient.invalidateQueries(["lists", boardId] as any);
    },
  });
}
