import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthButton } from "./auth-button";
import { UserButton } from "./user-button";
import { useAuth } from "@/providers/auth-provider";
import MainSideBar from "./main-sidebar";
import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react"; // Import the down arrow icon
import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { useEffect, useState } from "react";
import { getAverageColor } from "@/utils/getAverageImgColor";

import api from "@/lib/api";
import RecentBoardsPopover from "../navbar popovers/RecentBoardsPopover";
import StarredBoardsPopover from "../navbar popovers/StarredBoardsPopover";
import CreateBoardPopover from "../navbar popovers/CreateBoardPopover";
import getHoverColor, {
  getHoverColorForButton,
  hexToRgb,
  hslToHex,
  rgbToHex,
  rgbToHsl,
} from "@/utils/ColorConversionUtils";

// const getAverageGradientColor = (gradient: string): string => {
//   // Extract hex color codes from gradient string
//   const hexColors = gradient.match(/#[0-9a-fA-F]{6}/g) || [];
//   console.log("gradient: ", gradient);

//   if (hexColors.length === 0) return "#FFFFFF"; // Default to white if no colors found

//   // Convert hex to HSL
//   const hslColors = hexColors.map((hex) => rgbToHsl(...hexToRgb(hex)));

//   // Average the HSL values
//   const avgHSL = hslColors
//     .reduce((acc, [h, s, l]) => [acc[0] + h, acc[1] + s, acc[2] + l], [0, 0, 0])
//     .map((v, i) =>
//       i === 0 ? (v / hslColors.length) % 360 : v / hslColors.length
//     ); // Keep hue within 0-360

//   const [avgH, avgS, avgL] = avgHSL;

//   // Convert the averaged HSL back to RGB
//   const [r, g, b] = hslToRgb(avgH, avgS, avgL);

//   // Convert back to hex and return
//   return rgbToHex(r, g, b);
// };

const getAverageGradientColor = (gradient: string): string => {
  const gradientColors = gradient.match(/#[0-9a-fA-F]{6}/g) || [];
  let totalR = 0,
    totalG = 0,
    totalB = 0;

  gradientColors.forEach((color) => {
    const [r, g, b] = hexToRgb(color);
    totalR += r;
    totalG += g;
    totalB += b;
  });

  const avgR = Math.round(totalR / gradientColors.length);
  const avgG = Math.round(totalG / gradientColors.length);
  const avgB = Math.round(totalB / gradientColors.length);

  const avgHex = rgbToHex(avgR, avgG, avgB);
  return darkenColor(avgHex, 20); // Darken by 20% for contrast
};

const darkenColor = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(...rgb);
  return hslToHex(hsl[0], hsl[1], Math.max(0, hsl[2] - amount));
};

const getTextColorForBackground = (backgroundColor: string): string => {
  const rgb = hexToRgb(backgroundColor);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 150 ? "#172B4D" : "#FFFFFF";
};

export function MainNav() {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const { boardId } = useParams();
  const [boardBg, setBoardBg] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#FFF");
  const [isRecentPopoverOpen, setIsRecentPopoverOpen] = useState(false);
  const [isStarredPopoverOpen, setIsStarredPopoverOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hoverColor, setHoverColor] = useState("rgba(0, 0, 0, 0.1)");
  const [hoverColorForButton, setHoverColorForButton] =
    useState("rgba(0, 0, 0, 0.2)");

  const { data: board } = useGetBoard(boardId ?? null);

  useEffect(() => {
    const applyBackgroundColor = async () => {
      if (!board) {
        setBoardBg("#FFFFFF");
        setTextColor("#000000");
        return;
      }

      const { bgType, background } = board.bg;
      // console.log("background: ", background);

      let newBgColor = "#FFFFFF";
      setHoverColor(getHoverColor(newBgColor));

      switch (bgType) {
        case "color":
          newBgColor = background;
          newBgColor = darkenColor(newBgColor, 10);

          break;
        case "gradient":
          newBgColor = getAverageGradientColor(background);
          newBgColor = darkenColor(newBgColor, 10); // Darken by 10%

          break;
        case "image":
          try {
            newBgColor = await getAverageColor(background);
          } catch (error) {
            console.error("Failed to extract color from image", error);
            newBgColor = "#FFFFFF";
          }
          break;
        default:
          newBgColor = "#FFFFFF";
      }
      // console.log("new bgColor at the end: ", newBgColor);

      setBoardBg(newBgColor);
      setHoverColor(getHoverColor(newBgColor));
      setHoverColorForButton(getHoverColorForButton(newBgColor));
      setTextColor(getTextColorForBackground(newBgColor));
    };

    applyBackgroundColor();
  }, [boardId, board?.bg]);

  // console.log("boardBg: ", boardBg);

  const navigate = useNavigate();

  const handleBoardClick = (boardId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsRecentPopoverOpen(false);
    setIsStarredPopoverOpen(false);
    navigate(`/b/${boardId}`);
  };

  async function handleChangeStarredStatus(boardId: string) {
    try {
      if (!boardId) throw new Error("Board id is required");
      const res = await api.patch(`/user/starred/${boardId}`);
      setLoggedInUser(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header
      style={
        {
          color: textColor,
          backgroundColor: boardBg,
          "--hover-color": hoverColor, // Set CSS custom property
          "--hover-color-for-button": hoverColorForButton,
        } as React.CSSProperties
      }
      className="sticky top-0 z-50 w-full py-2 border-b border-gray-200 h-12 px-2 flex items-center"
    >
      <div className="max-h-10 w-full flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className=" font-bold text-2xl mr-4">
            Trello
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <button className="font-medium px-3 py-1.5 rounded-sm text-sm hover:bg-[var(--hover-color)]">
              Workspaces <ChevronDown className="inline h-4 w-4" />
            </button>
            <RecentBoardsPopover
              isPopoverOpen={isRecentPopoverOpen}
              setIsPopoverOpen={setIsRecentPopoverOpen}
              handleBoardClick={handleBoardClick}
              handleChangeStarredStatus={handleChangeStarredStatus}
            />

            <StarredBoardsPopover
              isPopoverOpen={isStarredPopoverOpen}
              setIsPopoverOpen={setIsStarredPopoverOpen}
              handleBoardClick={handleBoardClick}
              handleChangeStarredStatus={handleChangeStarredStatus}
            />
            <CreateBoardPopover
              isCreateOpen={isCreateOpen}
              setIsCreateOpen={setIsCreateOpen}
            />
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-white  placeholder-gray-400 px-8 py-1 rounded-md text-sm w-48 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <button className=" hover:bg-[var(--hover-color)] p-1.5 rounded-sm">
            <Bell size={18} style={{ transform: "rotate(45deg)" }} />
          </button>
          <button className=" hover:bg-[var(--hover-color)] p-1.5 rounded-sm">
            <HelpCircle size={18} />
          </button>
          <div className="hidden md:block">
            {loggedInUser ? <UserButton /> : <AuthButton />}
          </div>
          <MainSideBar />
        </div>
      </div>
    </header>
  );
}
