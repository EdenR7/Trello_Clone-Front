import api from "@/lib/api";
import { IList } from "@/types/list.types";
import { useQuery } from "@tanstack/react-query";

async function getLists(boardId: string): Promise<IList[]> {
  const res = await api.get(`/list/${boardId}/`);

  return res.data;
}

export function useGetLists(boardId: string) {
  return useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => getLists(boardId),
  });
}
