import { X } from "lucide-react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

import { useNavigate } from "react-router-dom";

interface ModalProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
  // Prevent background scrolling when the modal is open

  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Reset overflow on unmount
    };
  }, []);

  return createPortal(
    <div
      onClick={() => navigate(-1)}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-75 overflow-y-auto"
    >
      <div
        onClick={(ev) => ev.stopPropagation()}
        className=" text-text_dark_blue max-w-[768px] bg-gray-100 p-0 my-12 w-full rounded-2xl relative "
      >
        <Button
          onClick={() => navigate(-1)}
          variant={"ghost"}
          className=" hover:bg-gray-500/20 rounded-full  z-50 absolute top-3 py-1 px-2 mx-2  right-0 cursor-pointer"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className=" max-w-[768px]">{children}</div>
      </div>
    </div>,
    document.body
  );
};
