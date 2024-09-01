import { IBoard } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import CardDetailsHeader from "../general/CardDetailsHeader";
import { Button } from "../ui/button";
import MakeUserIcon from "@/utils/makeUserIcon";
import useAddMember from "@/hooks/Query hooks/Member hooks/useAddMember";
import { X } from "lucide-react";
import useRemoveMember from "@/hooks/Query hooks/Member hooks/useRemoveMember";

interface MembersPopoverLayoutProps {
  card: ICard;
  board: IBoard;
}

function MembersPopoverLayout(props: MembersPopoverLayoutProps) {
  const { card, board } = props;
  const [memberSearch, setMemberSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const boardId = board._id;
  const { mutate: addMember } = useAddMember(boardId);
  const { mutate: removeMember } = useRemoveMember(boardId);

  const filteredMembers = useMemo(() => {
    const lowercasedSearch = memberSearch.toLowerCase();
    return board.members.filter(
      (member) =>
        member.username.toLowerCase().includes(lowercasedSearch) ||
        member.firstName.toLowerCase().includes(lowercasedSearch) ||
        member.lastName.toLowerCase().includes(lowercasedSearch)
    );
  }, [board.members, memberSearch]);

  const cardMembers = useMemo(
    () =>
      filteredMembers.filter((member) =>
        card.members.some((cardMember) => cardMember.memberId === member._id)
      ),
    [filteredMembers, card.members]
  );

  const boardMembersNotInCard = useMemo(
    () =>
      filteredMembers.filter(
        (member) =>
          !card.members.some((cardMember) => cardMember.memberId === member._id)
      ),
    [filteredMembers, card.members]
  );

  function handleAddMember(cardId: string, memberId: string) {
    addMember({ cardId, memberId });
  }

  function handleRemoveMember(memberId: string) {
    removeMember({ cardId: card._id!, memberId });
  }

  return (
    <div>
      <Input
        value={memberSearch}
        ref={inputRef}
        onChange={(ev) => setMemberSearch(ev.target.value)}
        placeholder="Search members"
        className=" mt-1 mb-3 border border-gray-600"
      />
      {cardMembers.length > 0 && (
        <>
          <CardDetailsHeader title="Card members" />

          <ul>
            {cardMembers.map((member) => (
              <li key={member._id}>
                <Button
                  variant={"ghost"}
                  className=" flex items-center justify-start w-full h-10 py-1 pr-2 pl-1 bg-none relative"
                  onClick={() => handleRemoveMember(member._id)}
                >
                  <MakeUserIcon className="mr-2 " user={member} />
                  <div className=" font-normal">
                    {member.firstName + " " + member.lastName}
                  </div>
                  <X className=" absolute right-2" size={16} color="#4b4666" />
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}

      {boardMembersNotInCard.length > 0 && (
        <>
          <CardDetailsHeader title="Board members" />
          <ul>
            {boardMembersNotInCard.map((member) => (
              <li key={member._id}>
                <Button
                  onClick={() => handleAddMember(card._id, member._id)}
                  variant={"ghost"}
                  className=" flex items-center justify-start w-full h-10 py-1 pr-2 pl-1 bg-none"
                >
                  <MakeUserIcon className=" mr-2" user={member} />
                  <div className=" font-normal">
                    {member.firstName + " " + member.lastName}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MembersPopoverLayout;
