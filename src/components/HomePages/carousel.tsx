import { useState } from "react";

const Carousel = () => {
  // State to track the current slide index and animation direction
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  // Content for each slide
  const slides = [
    {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/3N2U3C71rApm61cGFxnc2E/970b010002488a09a420282df5e7b43a/Carousel_Image_Boards_2x.png?w=1080",
    },
    {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/4U0VUZYX2tQmB5KVGxBabp/7321ac088fe8ec39dbe3069c47d7df99/Carousel_Image_Lists_2x.png?w=1440&fm=webp",
    },
    {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/26CA6JZeRgoOK4nuRHnIlY/060702a80cf7c3be3651d9297d196267/Carousel_Image_Cards_2x.png?w=960&fm=webp",
    },
  ];

  const buttons = [
    {
      title: "Boards",
      content:
        "Trello boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”",
    },
    {
      title: "Lists",
      content:
        "The different stages of a task. Start as simple as To Do, Doing or Done—or build a workflow custom fit to your team’s needs. There’s no wrong way to Trello.",
    },
    {
      title: "Cards",
      content:
        "Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to show their status.",
    },
  ];

  // Handler for button clicks to switch slides
  const handleSlideChange = (index: number) => {
    setDirection(index > currentSlide ? "right" : "left");
    setCurrentSlide(index);
  };

  return (
    <div className="flex flex-col gap-4 break-1000px:gap-0 break-1000px:flex-row items-center space-x-4 p-6  break-600px:max-w-[540px] break-800px:max-w-[720px]  break-1000px:max-w-[960px] break-1200px:max-w-[1140px] mx-auto">
      {/* Side Buttons */}
      <div className="flex flex-col gap-4 pt-4 w-full break-1000px:w-[33.333%] px-4 ">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`py-4 w-full pr-4 pl-6 rounded transition-colors duration-300 text-black ${
              index === currentSlide
                ? "bg-white border-l-8 border-l-[#00C7E5]"
                : "bg-transparent"
            }`}
            onClick={() => handleSlideChange(index)}
          >
            <div>
              <h3 className=" text-lg font-bold mb-2 text-left ">
                {button.title}
              </h3>
              <p className=" text-[16px] text-left">{button.content}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Slide Content with sliding animation */}
      <div className="relative w-full break-1000px:w-[66.6667%] overflow-hidden">
        <div
          className={`flex transition-transform duration-500 ease-in-out ${
            direction === "right" ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-full  rounded border ">
              <img className="w-full h-full" src={slide.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
