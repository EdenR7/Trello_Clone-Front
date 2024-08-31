import { IBoard } from "@/types/board.types";
import { ICard } from "@/types/card.types";

import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import CardLabelItem from "../labels/CardLabelItem";
import { Button } from "../ui/button";
import PopoverLayout from "../general/PopoverLayout";
import { Plus } from "lucide-react";
import CardDetailsHeader from "../general/CardDetailsHeader";
import CardDetailsLayout from "../general/CardDetailsLayout";
import CardModalLabels from "../labels/CardModalLabelLayout";
import { useToggleCardLabel } from "@/hooks/Query hooks/Label hooks/useToggleCardLabel";

interface CardDataComponentProps {
  card: ICard;
}

function CardDataComponent(props: CardDataComponentProps) {
  const { card } = props;
  const qClient = useQueryClient();
  const { boardId } = useParams();
  const { mutate: toggleCardLabels } = useToggleCardLabel(boardId!);
  const board = qClient.getQueryData<IBoard>(["board", boardId]);

  function handleToggleLabels(cardId: string, labelId: string) {
    toggleCardLabels({ cardId, labelId });
  }

  return (
    <div className=" mt-2 ml-10">
      <CardDetailsLayout>
        <div>
          <section className=" flex flex-col justify-end max-w-full">
            <CardDetailsHeader title="Labels" />
            <div className="flex gap-1">
              {card.labels.map((labelId) => {
                const label = board?.labels.find((lbl) => lbl._id === labelId);
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

              <PopoverLayout
                title="Labels"
                trigger={
                  <Button className=" p-2" variant={"secondary"}>
                    <Plus size={16} />
                  </Button>
                }
              >
                <CardModalLabels
                  onToggleLabel={(labelId) =>
                    handleToggleLabels(card._id!, labelId)
                  }
                  boardId={boardId!}
                  cardLabels={card.labels}
                />
              </PopoverLayout>
            </div>
          </section>
        </div>
      </CardDetailsLayout>
    </div>
  );
}

export default CardDataComponent;
