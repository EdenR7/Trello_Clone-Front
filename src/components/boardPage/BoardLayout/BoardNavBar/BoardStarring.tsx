import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { Star } from "lucide-react";
import { useMemo } from "react";

interface BoardStarringProps {
  boardId: string;
}

function BoardStarring({ boardId }: BoardStarringProps) {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const isStarred = useMemo(() => {
    return loggedInUser?.sttaredBoards.find((b) => b._id === boardId);
  }, [loggedInUser?.sttaredBoards, boardId]);

  async function handleChangeStarredStatus() {
    try {
      if (!boardId) throw new Error("Board id is required");
      const res = await api.patch(`/user/starred/${boardId}`);
      setLoggedInUser(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Button
      variant={"naked"}
      className=" bg-inherit p-0 m-0 hover:bg-inherit group"
      size={"sm"}
    >
      {isStarred ? (
        <Star
          onClick={handleChangeStarredStatus}
          fill="currentColor"
          size={16}
          className=" transition-transform duration-200 ease-in-out group-hover:scale-125"
        />
      ) : (
        <Star
          onClick={handleChangeStarredStatus}
          size={16}
          className=" transition-transform duration-200 ease-in-out group-hover:scale-125"
        />
      )}
    </Button>
  );
}

export default BoardStarring;
