import { ICard } from "@/types/card.types";

interface CardItemProps {
  card: ICard;
}

function CardItem(props: CardItemProps) {
  const { card } = props;
  return (
    <div className=" flex flex-col gap-2 bg-gray-400">
      <span>title: {card.title}</span>
      <span>admin: {card.admin}</span>
      <span>position: {card.position}</span>
      <span>id: {card._id}</span>
    </div>
  );
}

export default CardItem;
