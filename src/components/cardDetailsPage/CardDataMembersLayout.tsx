import { ICard } from "@/types/card.types";
import CardDetailsHeader from "../general/CardDetailsHeader";

interface CardDataMembersLayoutProps {
  card: ICard;
}

function CardDataMembersLayout(props: CardDataMembersLayoutProps) {
  const { card } = props;
  return (
    <div className=" mr-2 mb-2 max-w-full">
      <CardDetailsHeader title="Members" />
    </div>
  );
}

export default CardDataMembersLayout;
