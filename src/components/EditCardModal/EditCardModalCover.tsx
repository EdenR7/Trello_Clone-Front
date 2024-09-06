import { ICard } from "@/types/card.types";
import PopoverLayout from "../general/PopoverLayout";
import CardCoverPopup from "../cardDetailsPage/CardCoverPopup";
import EditCardModalSideButton from "./EditCardModalSideButton";
import { Rows2 } from "lucide-react";
import React from "react";

const EditCardModalCover = React.memo(function EditCardModalCover({
  card,
}: {
  card: ICard;
}) {
  console.log("card: ", card);

  return (
    <PopoverLayout
      trigger={
        <EditCardModalSideButton
          icon={<Rows2 size={15} />}
          title="Change cover"
        />
      }
      title="Cover"
    >
      <CardCoverPopup card={card} />
    </PopoverLayout>
  );
});

export default EditCardModalCover;
