import { ICard } from "@/types/card.types";

import { Draggable } from "@hello-pangea/dnd";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Link, useParams } from "react-router-dom";
import CardItemLabels from "../CardItem/CardItemLabels";

interface CardItemProps {
  card: ICard;
  index: number;
}

function CardItem(props: CardItemProps) {
  const { card, index } = props;
  const { boardId } = useParams();
  const [isLabelsOpen, setIsLabelsOpen] = useLocalStorage(
    "trella-labels-open-state",
    false
  );
  console.log(card.labels);

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) =>
        card.bgCover.isCover ? (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="  h-14 cursor-pointer shadow-sm">
              <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
                <div
                  className=" hover:outline hover:outline-2  hover:outline-primary flex rounded-lg min-h-full py-2 pr-2 pl-3"
                  style={{ backgroundColor: card.bgCover.bg }}
                >
                  <p className=" z-10 self-end w-full text-[16px] font-semibold leading-5 relative">
                    {card.title}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
              <div className=" relative min-h-9 rounded-lg bg-white shadow-sm scroll-m-2  hover:outline hover:outline-2  hover:outline-primary">
                {card.bgCover.bg !== "" && (
                  <div
                    className=" h-9 overflow-hidden rounded-t-lg relative"
                    style={{ backgroundColor: card.bgCover.bg }}
                  ></div>
                )}
                <div className=" flow-root relative z-10 min-h-6 px-3 pt-2 pb-1 ">
                  <div className=" flex flex-wrap gap-1 mb-1">
                    {card.labels.map((label, index) => (
                      <CardItemLabels
                        key={index}
                        isLabelsOpen={isLabelsOpen}
                        label={label}
                        setIsLabelsOpen={setIsLabelsOpen}
                      />
                    ))}
                  </div>
                  <p className=" mb-1 block overflow-hidden break-words whitespace-normal">
                    {card.title}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )
      }
    </Draggable>
  );
}

export default CardItem;
