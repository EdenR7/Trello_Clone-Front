import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useAddMember from "@/hooks/Query hooks/Board hooks/useAddMember";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { UserSearch } from "lucide-react";
import { useState } from "react";

interface AddMembersProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: string;
}

async function getAllMembers(targetUsername: string) {
  try {
    if (!targetUsername) {
      return [];
    }
    const res = await api.get(`/user/all`, {
      params: {
        targetUsername,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

function AddMembers({ isOpen, setIsOpen, boardId }: AddMembersProps) {
  const [targetUsername, setTargetUsername] = useState<string>("");
  const debouncedValue = useDebounce(targetUsername, 500);
  const { mutate: addMember } = useAddMember();
  const {
    data: usersResults,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["targetUsers", debouncedValue],
    queryFn: () => getAllMembers(debouncedValue),
    enabled: !!debouncedValue, // Ensures the query only runs when debouncedValue is not empty
  });

  async function handleAddMember(username: string) {
    addMember({
      boardId: boardId,
      memberName: username,
    });
    setTargetUsername("");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={` max-w-[400px] h-8 mr-1 mt-1 mb-0 pl-2 overflow-hidden bg-gray-200 hover:bg-white text-[#172B4D] bg-btn_bg_primary  py-[6px] px-3  inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:opacity-50  `}
      >
        <UserSearch size={16} className=" mr-1" />
        Share
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className=" min-h-[200px] pt-5 pl-6 pr-0 pb-0"
      >
        <DialogHeader>
          <DialogTitle className=" min-h-8 mr-6  mt-0 ml-0 text-2xl font-normal ">
            Share board
          </DialogTitle>
        </DialogHeader>
        <div className=" mr-6 mb-5">
          <div>
            <div className=" flex items-start">
              <div className=" flex-grow">
                <Input
                  onChange={(e) => setTargetUsername(e.target.value)}
                  value={targetUsername}
                  className=" max-w-[380px] w-full py-1.5 pr-1 pl-3 rounded-sm min-h-8 border-gray-600"
                  placeholder="Email address or name"
                />
              </div>
            </div>
          </div>
          <div>
            {debouncedValue && isPending && <div>Loading...</div>}
            {usersResults?.map((user: any) => {
              return (
                <div key={user._id}>
                  <div>
                    <div className=" flex items-center">
                      <div
                        onClick={() => {
                          handleAddMember(user.username);
                        }}
                        className=" w-full h-8 m-0 cursor-pointer hover:bg-gray-100 "
                      >
                        {user.username}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddMembers;
