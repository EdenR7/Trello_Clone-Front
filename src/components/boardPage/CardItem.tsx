import { ICard } from "@/types/card.types";

import { Draggable } from "@hello-pangea/dnd";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Link, useParams } from "react-router-dom";
import CardItemLabels from "../CardItem/CardItemLabels";
import CardItemDates from "../CardItem/CardItemDates";
import { AlignLeft, Pen } from "lucide-react";
import CardItemChecklist from "../CardItem/CardItemChecklist";
import CardItemUserIcon from "../CardItem/CardItemUserIcon";
import { Button } from "../ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../EditCardModal/Modal";

interface CardItemProps {
  card: ICard;
  index: number;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeCardId: string | null;
  setActiveCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

function CardItem(props: CardItemProps) {
  const {
    card,
    index,
    isModalOpen,
    setIsModalOpen,
    activeCardId,
    setActiveCardId,
  } = props;
  const { boardId } = useParams();
  const [isLabelsOpen, setIsLabelsOpen] = useLocalStorage(
    "trella-labels-open-state",
    false
  );
  const hasTodos = card.checklist.some(
    (checklist) => checklist.todos.length > 0
  );

  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
    menuPosition: "right",
  });
  //hello

  const cardRef = useRef<HTMLDivElement | null>(null);

  const updateModalPosition = useCallback(() => {
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      const menuPosition =
        cardRect.right + 170 > windowWidth ? "left" : "right"; //

      const modalTop = Math.max(
        0,
        Math.min(cardRect.top, window.innerHeight - 300)
      ); // Keep the modal inside view

      const modalLeft = Math.max(0, Math.min(cardRect.left, windowWidth - 256));

      setModalPosition({
        top: modalTop,
        left: modalLeft,
        menuPosition,
      });
    }
  }, [cardRef]);

  useEffect(() => {
    if (isModalOpen) {
      updateModalPosition();

      window.addEventListener("scroll", updateModalPosition);
      window.addEventListener("resize", updateModalPosition);

      return () => {
        window.removeEventListener("scroll", updateModalPosition);
        window.removeEventListener("resize", updateModalPosition);
      };
    }
  }, [isModalOpen, updateModalPosition]);

  // const handleOpenModal = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (cardRef.current) {
  //     const cardRect = cardRef.current.getBoundingClientRect();
  //     const windowWidth = window.innerWidth;

  //     // Calculate menu placement
  //     const menuPosition =
  //       cardRect.right + 300 > windowWidth ? "left" : "right"; // Assuming modal width is 300px

  //     // Set modal position near the card
  //     setModalPosition({
  //       top: cardRect.top,
  //       left: cardRect.left,
  //       menuPosition,
  //     });
  //     setActiveCardId(card._id);
  //     setIsModalOpen(true);
  //   }
  // };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cardRef.current) {
      updateModalPosition();
      setActiveCardId(card._id);
      setIsModalOpen(true);
    }
  };

  return (
    <Draggable
      draggableId={card._id}
      index={index}
      isDragDisabled={isModalOpen}
    >
      {(provided) =>
        card.bgCover.isCover ? (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={(el) => {
              provided.innerRef(el);
              cardRef.current = el;
            }}
          >
            <div className="  h-14 cursor-pointer shadow rounded-lg relative">
              <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
                <div
                  className=" hover:outline hover:outline-1 hover:outline-primary flex rounded-lg min-h-full py-2 pr-2 pl-3 relative group"
                  style={{ backgroundColor: card.bgCover.bg }}
                >
                  <Button
                    onClick={handleOpenModal}
                    variant={"secondary"}
                    className=" hidden group-hover:block bg-gray-100 rounded-full px-2 py-2 absolute top-[2px] right-[2px] z-50"
                  >
                    <Pen strokeWidth={1.75} size={14} />
                  </Button>
                  <p className=" z-10 self-end w-full text-[16px] font-semibold leading-5 relative">
                    {card.title}
                  </p>
                </div>
              </Link>
              {isModalOpen && activeCardId === card._id && (
                <Modal
                  cardId={card._id}
                  position={modalPosition}
                  onClose={() => {
                    setIsModalOpen(false);
                    setActiveCardId(null);
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            // ref={provided.innerRef}
            ref={(el) => {
              provided.innerRef(el);
              cardRef.current = el;
            }}
          >
            <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
              <div className=" relative min-h-9 rounded-lg bg-white shadow scroll-m-2   hover:outline hover:outline-2  hover:outline-primary group ">
                <Button
                  onClick={handleOpenModal}
                  variant={"secondary"}
                  className=" hidden group-hover:block bg-gray-100 rounded-full px-2 py-2 absolute top-[2px] right-[2px] z-50"
                >
                  <Pen strokeWidth={1.75} size={14} />
                </Button>
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
                  <div className=" flex flex-wrap max-w-full gap-1">
                    {(card.dueDate || card.startDate) && (
                      <CardItemDates card={card} />
                    )}
                    {card.description && (
                      <span className=" flex relative items-center justify-center w-fit max-w-full h-6 mb-1 p-[2px] rounded-sm text-sm">
                        <AlignLeft size={16} strokeWidth={1.75} />
                      </span>
                    )}
                    {hasTodos && <CardItemChecklist card={card} />}
                  </div>
                  {card.members.length > 0 && <CardItemUserIcon card={card} />}
                </div>
              </div>
            </Link>
            {isModalOpen && activeCardId === card._id && (
              <Modal
                cardId={card._id}
                position={modalPosition}
                onClose={() => {
                  setIsModalOpen(false);
                  setActiveCardId(null);
                }}
              />
            )}
          </div>
        )
      }
    </Draggable>
  );
}

export default CardItem;
