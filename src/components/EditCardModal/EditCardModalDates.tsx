import { ICard } from "@/types/card.types";
import DatePopoverLayout from "../general/DatePopoverLayout";
import CardDatesPopup from "../cardDetailsPage/CardDatesPopup";
import { useState } from "react";
import EditCardModalSideButton from "./EditCardModalSideButton";
import { Clock } from "lucide-react";

function EditCardModalDates({ card }: { card: ICard }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DatePopoverLayout
      internalOpen={isOpen}
      setInternalOpen={setIsOpen}
      title="Dates"
      trigger={
        <EditCardModalSideButton
          icon={<Clock size={16} strokeWidth={1.75} />}
          title="Edit dates"
        />
      }
    >
      <CardDatesPopup setInternalOpen={setIsOpen} card={card} />
    </DatePopoverLayout>
  );
}

export default EditCardModalDates;
