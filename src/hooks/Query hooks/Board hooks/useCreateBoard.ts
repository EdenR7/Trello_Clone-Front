import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { IBoard, IBoardBackground } from "@/types/board.types";
import { IWorkspace } from "@/types/workspace.types";

// API call to create a board
async function createBoard(
  workspaceId: string,
  boardName: string,
  boardBg: IBoardBackground
): Promise<IBoard> {
  const res = await api.post(`/board/${workspaceId}`, {
    name: boardName,
    boardBg,
  });
  return res.data; // return the newly created board
}

interface CreateBoardProps {
  workspaceId: string;
  boardName: string;
  boardBg: IBoardBackground;
}

export default function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    // Mutation function to create a new board
    mutationFn: ({ workspaceId, boardName, boardBg }: CreateBoardProps) =>
      createBoard(workspaceId, boardName, boardBg),

    // Access the newly created board
    onSuccess: (newBoard, { workspaceId }) => {
      const prevWorkspace = queryClient.getQueryData<IWorkspace>([
        "workspace",
        workspaceId,
      ]);

      if (prevWorkspace) {
        // Add the newly created board to the workspace cache
        queryClient.setQueryData(["workspace", workspaceId], {
          ...prevWorkspace,
          boards: [...prevWorkspace.boards, newBoard._id],
        });
      }
    },
  });
}
