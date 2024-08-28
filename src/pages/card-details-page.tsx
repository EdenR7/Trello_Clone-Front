import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usegetCard } from "@/hooks/Query hooks/Card hooks/useGetCard";
import CardTitleComponent from "@/components/cardDetailsPage/cardTitle";
import { useState } from "react";

function CardDetailsPage() {
  const { boardId, cardId } = useParams();
  const { data: card, isPending } = usegetCard(cardId!);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

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
    <Dialog onOpenChange={handleCloseModal} open={true}>
      <DialogTitle />
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[768px] bg-gray-200 p-0 rounded-md"
      >
        <DialogHeader>
          {card && boardId && (
            <CardTitleComponent card={card} boardId={boardId} />
          )}
        </DialogHeader>
        <div>
          <div></div>
          <div></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CardDetailsPage;
