import { useParams } from "react-router-dom";

import { usegetCard } from "@/hooks/Query hooks/Card hooks/useGetCard";
import CardTitleComponent from "@/components/cardDetailsPage/cardTitle";

import CardDescriptionComponent from "@/components/cardDetailsPage/cardDescription";
import CardChecklistComponent from "@/components/cardDetailsPage/CardChecklistComponent";
import CardDataComponent from "@/components/cardDetailsPage/CardDataComponent";
import CardCoverComponent from "@/components/cardDetailsPage/CardCoverComponent ";
import { Modal } from "@/components/ui/CardDetailsModal";

function CardDetailsPage() {
  const { boardId, cardId } = useParams();
  const { data: card } = usegetCard(cardId!);

  console.log("card: ", card);

  return (
    card && (
      <Modal>
        <CardCoverComponent card={card} />
        <h2>
          {card && boardId && (
            <CardTitleComponent card={card} boardId={boardId} />
          )}
        </h2>
        <div
          onClick={(ev) => ev.stopPropagation()}
          className=" pb-2 pr-4 break-card_modal:pr-2 pl-4"
        >
          {/* main div */}
          <div>
            <CardDataComponent card={card} />
            <CardDescriptionComponent card={card} />

            <CardChecklistComponent card={card} />
          </div>
          <div>{/* sidebar div */}</div>
        </div>
      </Modal>
    )
  );
}

export default CardDetailsPage;
