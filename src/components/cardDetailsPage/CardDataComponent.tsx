import { ICard } from "@/types/card.types";

interface CardDataComponentProps {
  card: ICard;
}

function CardDataComponent(props: CardDataComponentProps) {
  const { card } = props;
  return (
    <div className=" mt-2 ml-10">
      <div className=" mb-2 ml-2"></div>
    </div>
  );
}

export default CardDataComponent;
