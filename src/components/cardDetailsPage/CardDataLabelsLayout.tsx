import { Plus } from "lucide-react";
import CardDetailsHeader from "../general/CardDetailsHeader";
import CardLabelItem from "../labels/CardLabelItem";
import { Button } from "../ui/button";
import CardModalLabels from "../labels/CardModalLabelLayout";
import { useToggleCardLabel } from "@/hooks/Query hooks/Label hooks/useToggleCardLabel";
import { ICard } from "@/types/card.types";
import { ILabel } from "@/types/board.types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { CreateAndEditLabelLayout } from "../labels/CreateAndEditLabelLayout.tsx";
import LabelPopoverLayout from "../general/LabelPopoverLayout.tsx";

interface CardDataLabelsLayoutProps {
  card: ICard;
}

function CardDataLabelsLayout(props: CardDataLabelsLayoutProps) {
  const { card } = props;

  const { cardId, boardId } = useParams();

  const [isEditLabel, setIsEditLabel] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState<ILabel | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const { mutate: toggleCardLabels } = useToggleCardLabel(boardId!);
  function handleToggleLabels(cardId: string, labelId: string) {
    toggleCardLabels({ cardId, labelId });
  }
  const labels = card.labels;
  labels.sort((a, b) => {
    if (a.title === "Default") return 1;
    if (b.title === "Default") return -1;
    return a.title.localeCompare(b.title);
  });
  return (
    <div>
      <section className=" flex flex-col justify-end max-w-full">
        <CardDetailsHeader title="Labels" />
        <div className="flex gap-1">
          {labels.map((label) => {
            if (label) {
              return (
                <CardLabelItem
                  key={label._id}
                  label={label}
                  cardLabels={card.labels}
                  boardId={boardId!}
                  onToggleLabel={(labelId) =>
                    handleToggleLabels(card._id!, labelId)
                  }
                />
              );
            }
            return null;
          })}

          <LabelPopoverLayout
            setIsEditLabel={setIsEditLabel}
            setIsEditMode={setIsEditMode}
            setLabelToEdit={setLabelToEdit}
            internalOpen={isLabelPopoverOpen}
            setInternalOpen={setIsLabelPopoverOpen}
            side=""
            title="Labels"
            trigger={
              <Button className=" p-2" variant={"secondary"}>
                <Plus size={16} />
              </Button>
            }
          >
            {isEditLabel ? (
              <CreateAndEditLabelLayout
                setIsLabelPopoverOpen={setIsLabelPopoverOpen}
                isEditMode={isEditMode}
                color={labelToEdit?.color}
                labelId={labelToEdit?._id}
                title={labelToEdit?.title}
                cardId={cardId}
              />
            ) : (
              <CardModalLabels
                boardId={boardId!}
                cardLabels={card.labels}
                onToggleLabel={(labelId) =>
                  handleToggleLabels(card._id!, labelId)
                }
                setIsEditLabel={setIsEditLabel}
                setIsEditMode={setIsEditMode}
                setLabelToEdit={setLabelToEdit}
              />
            )}
          </LabelPopoverLayout>
        </div>
      </section>
    </div>
  );
}

export default CardDataLabelsLayout;
