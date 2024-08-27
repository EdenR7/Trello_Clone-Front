import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getBoard(boardId: string) {
  const res = await api.get(`/board/${boardId}`);
  return res;
}

export function useGetBoard(boardId: string) {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoard(boardId),
  });
} //by returning the useQuery hook we can access the object properties directly by calling to the hookkk
