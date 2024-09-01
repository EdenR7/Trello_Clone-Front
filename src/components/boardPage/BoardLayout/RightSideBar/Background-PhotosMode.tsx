import { Input } from "@/components/ui/input";
import { boardBgImageOptions } from "@/constants/board.constants";
import { Search } from "lucide-react";

function PhotosMode() {
  return (
    <>
      <div className=" relative m-[1px]">
        <Input className=" h-9 pl-8 py-2 pr-3 mb-3" placeholder="Photos" />
        <Search
          size={16}
          color="rgb(68, 84, 111)"
          className=" absolute top-1/2 -translate-y-1/2 left-3"
        />
      </div>
      <div className=" overflow-y-auto max-h-[480px] px-1">
        <ul className=" grid grid-cols-2 gap-2 ">
          {boardBgImageOptions.map((bg, index) => {
            return (
              <li
                key={index}
                className=" cursor-pointer h-24 overflow-hidden rounded-md"
              >
                <img
                  src={bg}
                  alt="bg img"
                  className="w-full h-full object-cover"
                />
              </li>
            );
          })}
        </ul>
      </div>
      <footer className=" py-2">
        <p className=" text-xs">
          By using images from Unsplash, you agree to their{" "}
          <a
            className=" text-blue-500 hover:underline"
            href="#https://unsplash.com/license"
          >
            license
          </a>{" "}
          and{" "}
          <a
            className=" text-blue-500 hover:underline"
            href="#https://unsplash.com/terms"
          >
            terms of service
          </a>
          .
        </p>
      </footer>
    </>
  );
}

export default PhotosMode;

//rgba(9, 30, 66, 0.14)  scroll bar
