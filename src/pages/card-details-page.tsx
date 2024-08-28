import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { usegetCard } from "@/hooks/Query hooks/Card hooks/useGetCard";
import CardTitleComponent from "@/components/cardDetailsPage/cardTitle";

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
    <Dialog onOpenChange={handleCloseModal} open={true}>
      <DialogContent className="w-[768px]">
        <DialogHeader>
          {card && <CardTitleComponent card={card} />}
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default CardDetailsPage;
