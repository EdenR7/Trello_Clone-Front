import { ICard } from "@/types/card.types";
import DatePopoverLayout from "../general/DatePopoverLayout";
import MoveCardPopoverLayout from "../cardDetailsPage/card sidebar/MoveCardPopoverLayout";
import { useState } from "react";
import EditCardModalSideButton from "./EditCardModalSideButton";
import { ArrowRight } from "lucide-react";

function EditCardModalMove({ card }: { card: ICard }) {
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
      <MoveCardPopoverLayout setIsPopoverOpen={setIsPopoverOpen} card={card} />
    </DatePopoverLayout>
  );
}

export default EditCardModalMove;
