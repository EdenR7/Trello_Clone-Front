import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usegetCard } from "@/hooks/Query hooks/Card hooks/useGetCard";
import CardTitleComponent from "@/components/cardDetailsPage/cardTitle";

import CardDescriptionComponent from "@/components/cardDetailsPage/cardDescription";
import CardChecklistComponent from "@/components/cardDetailsPage/CardChecklistComponent";
function CardDetailsPage() {
  const { boardId, cardId } = useParams();
  const { data: card, isPending } = usegetCard(cardId!);
  const navigate = useNavigate();

  function handleCloseModal() {
    navigate(`/b/${boardId}`);
  }

  if (isPending)
    return (
      <>
        <div>loading.......</div>
      </>
    );

  return (
    card && (
      <Dialog onOpenChange={handleCloseModal} open={true}>
        <DialogTitle />
        <DialogContent
          aria-describedby={undefined}
          className=" text-text_dark_blue max-w-[768px] bg-gray-200 p-0 rounded-md"
        >
          <DialogHeader>
            {card && boardId && (
              <CardTitleComponent card={card} boardId={boardId} />
            )}
          </DialogHeader>
          <div className=" pb-2 pr-4 break-card_modal:pr-2 pl-4">
            {/* main div */}
            <div>
              <CardDescriptionComponent card={card} />

              <CardChecklistComponent card={card} />
            </div>
            <div>{/* sidebar div */}</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}

export default CardDetailsPage;
