import { ICard } from "@/types/card.types";
import MakeUserIcon from "@/utils/makeUserIcon";

function CardItemUserIcon({ card }: { card: ICard }) {
  return (
    <div className=" flex wrap justify-end -mr-1 mb-1 gap-1">
      {card.members.map((member) => (
        <MakeUserIcon
          key={member._id}
          className=" h-6 w-6 leading-6 relative "
          user={member}
        />
      ))}
    </div>
  );
}

export default CardItemUserIcon;
