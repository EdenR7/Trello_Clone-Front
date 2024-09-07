import api from "@/lib/api";
import { IList } from "@/types/list.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createListApi(boardId: string, name: string) {
  try {
    const res = await api.post(`list/${boardId}`, { name });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useCreateList(boardId: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, name }: { boardId: string; name: string }) =>
      createListApi(boardId, name),
    onMutate: ({ name }) => {
      qClient.cancelQueries({ queryKey: ["lists", boardId] });
      const prevData: IList[] | undefined = qClient.getQueryData([
        "lists",
        boardId,
      ]);
      if (!prevData) throw new Error("No data found");
      const position =
        prevData.length > 0 ? prevData[prevData.length - 1].position + 1 : 1;
      const newList: IList = {
        _id: "temp",
        board: boardId,
        isArchived: false,
        name,
        position,
        cards: [],
      };
      qClient.setQueryData(["lists", boardId], [...prevData, newList]);
      return { prevData };
    },
    onError: (error, _, context) => {
      console.log(error);
      qClient.setQueryData(["lists", boardId], context?.prevData);
    },
    onSettled: () => {
      qClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
