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
import CardDataComponent from "@/components/cardDetailsPage/CardDataComponent";
import CardCoverComponent from "@/components/cardDetailsPage/CardCoverComponent ";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
function CardDetailsPage() {
  const { boardId, cardId } = useParams();
  const { data: card, isPending } = usegetCard(cardId!);
  const navigate = useNavigate();
  console.log("card: ", card);

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
          className=" text-text_dark_blue max-w-[768px] bg-gray-200 p-0 rounded-3xl"
        >
          <CardCoverComponent card={card} />
          <DialogHeader>
            {card && boardId && (
              <CardTitleComponent card={card} boardId={boardId} />
            )}
          </DialogHeader>
          <div className=" pb-2 pr-4 break-card_modal:pr-2 pl-4">
            {/* main div */}
            <div>
              <CardDataComponent card={card} />
              <CardDescriptionComponent card={card} />

              <CardChecklistComponent card={card} />
            </div>
            <div className=" h-10">
              <Button
                className=" mr-2 w-[calc(50% - 8px)] "
                variant={"secondary"}
              >
                <UserRound />
              </Button>
              <h3>wsdasda</h3>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}

export default CardDetailsPage;
