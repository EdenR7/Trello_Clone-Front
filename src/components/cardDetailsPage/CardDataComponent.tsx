import { IBoard } from "@/types/board.types";
import { ICard } from "@/types/card.types";

import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import CardDetailsLayout from "../general/CardDetailsLayout";

import CardDataLabelsLayout from "./CardDataLabelsLayout";
import CardDataMembersLayout from "./CardDataMembersLayout";
import CardDataDateLayout from "./CardDataDateLayout";

interface CardDataComponentProps {
  card: ICard;
}

function CardDataComponent(props: CardDataComponentProps) {
  const { card } = props;
  const qClient = useQueryClient();
  const { boardId } = useParams();

  const board = qClient.getQueryData<IBoard>(["board", boardId]);
  console.log("board", board);

  return (
    <div className=" mt-2 ml-10 ">
      <CardDetailsLayout>
        <CardDataMembersLayout card={card} />
      </CardDetailsLayout>
      <CardDetailsLayout>
        <CardDataLabelsLayout card={card} />
      </CardDetailsLayout>
      <CardDetailsLayout>
        <CardDataDateLayout card={card} />
      </CardDetailsLayout>
    </div>
  );
}

export default CardDataComponent;
