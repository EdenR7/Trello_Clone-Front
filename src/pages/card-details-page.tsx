import { useParams } from "react-router-dom";

import { usegetCard } from "@/hooks/Query hooks/Card hooks/useGetCard";
import CardTitleComponent from "@/components/cardDetailsPage/cardTitle";

import CardDescriptionComponent from "@/components/cardDetailsPage/cardDescription";
import CardChecklistComponent from "@/components/cardDetailsPage/CardChecklistComponent";
import CardDataComponent from "@/components/cardDetailsPage/CardDataComponent";
import CardCoverComponent from "@/components/cardDetailsPage/CardCoverComponent ";
import { Modal } from "@/components/ui/CardDetailsModal";

import MembersLayout from "@/components/cardDetailsPage/card sidebar/MembersLayout";
import LabelsLayout from "@/components/cardDetailsPage/card sidebar/LabelsLayout";
import ChecklistLayout from "@/components/cardDetailsPage/card sidebar/ChecklistLayout";
import CardDetailsHeader from "@/components/general/CardDetailsHeader";
import DatesLayout from "@/components/cardDetailsPage/card sidebar/DatesLayout";
import ArchiveLayout from "@/components/cardDetailsPage/card sidebar/ArchiveLayout";
import CardArchiveIndicator from "@/components/cardDetailsPage/CardArchiveIndicator";
import CoverLayout from "@/components/cardDetailsPage/card sidebar/CoverLayout ";

function CardDetailsPage() {
  const { boardId, cardId } = useParams();
  const { data: card } = usegetCard(cardId!);

  console.log("card: ", card);

  return (
    card && (
      <Modal>
        {card.bgCover.bg !== "" && <CardCoverComponent card={card} />}

        {card.isArchived && <CardArchiveIndicator />}

        <h2>
          {card && boardId && (
            <CardTitleComponent card={card} boardId={boardId} />
          )}
        </h2>
        <div
          onClick={(ev) => ev.stopPropagation()}
          className=" pb-2 pr-4 break-card_modal:pr-2 pl-4 break-card_modal:flex w-full"
        >
          {/* main div */}
          <div className=" break-card_modal:w-[552px]">
            <CardDataComponent card={card} />
            <CardDescriptionComponent card={card} />

            <CardChecklistComponent card={card} />
          </div>
          <div className=" break-card_modal:pb-2 break-card_modal:pl-4 break-card_modal:pr-4 break-card_modal:w-[168px] ">
            <CardDetailsHeader title="Add to card" />
            <div className=" flex flex-wrap   break-card_modal:flex-col   ">
              <MembersLayout card={card} />
              <LabelsLayout card={card} />
              <ChecklistLayout card={card} />
              <DatesLayout card={card} />
              <CoverLayout card={card} />
            </div>
            <CardDetailsHeader className=" mt-6" title="Actions" />
            <div className=" mb-6 flex flex-wrap break-card_modal:w-[176px] ">
              <ArchiveLayout card={card} />
            </div>
          </div>
        </div>
      </Modal>
    )
  );
}

export default CardDetailsPage;
