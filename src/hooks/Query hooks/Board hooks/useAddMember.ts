import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addMember(memberName: string, boardId: string) {
  const res = await api.patch(`/board/${boardId}/member/add`, { memberName });
  return res.data;
}

interface AddMemberParams {
  memberName: string;
  boardId: string;
}

export default function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberName, boardId }: AddMemberParams) =>
      addMember(memberName, boardId),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}
