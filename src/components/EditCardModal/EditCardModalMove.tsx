import { ICard } from "@/types/card.types";
import DatePopoverLayout from "../general/DatePopoverLayout";
import MoveCardPopoverLayout from "../cardDetailsPage/card sidebar/MoveCardPopoverLayout";
import { memo, useState } from "react";
import EditCardModalSideButton from "./EditCardModalSideButton";
import { ArrowRight } from "lucide-react";

const EditCardModalMove = memo(function EditCardModalMove({
  card,
  onClose,
}: {
  card: ICard;
  onClose: () => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <DatePopoverLayout
      internalOpen={isPopoverOpen}
      setInternalOpen={setIsPopoverOpen}
      trigger={
        <EditCardModalSideButton
          icon={<ArrowRight strokeWidth={1.75} size={16} />}
          title="Move"
        />
      }
      title="Move card"
    >
      <MoveCardPopoverLayout
        onClose={onClose}
        setIsPopoverOpen={setIsPopoverOpen}
        card={card}
      />
    </DatePopoverLayout>
  );
});

export default EditCardModalMove;
