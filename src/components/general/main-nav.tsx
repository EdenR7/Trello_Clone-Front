import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthButton } from "./auth-button";
import { UserButton } from "./user-button";
import { useAuth } from "@/providers/auth-provider";
import { Search, Bell, HelpCircle, Plus } from "lucide-react"; // Import the down arrow icon
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

export const darkenColor = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(...rgb);
  return hslToHex(hsl[0], hsl[1], Math.max(0, hsl[2] - amount));
};

const getTextColorForBackground = (backgroundColor: string): string => {
  const rgb = hexToRgb(backgroundColor);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 150 ? "#44546F" : "#FFFFFF";
};

export function MainNav() {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const { boardId } = useParams();
  const [boardBg, setBoardBg] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#44546F");
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
        setTextColor("#44546F");
        return;
      }

      const { bgType, background } = board.bg;

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

      setBoardBg(newBgColor);
      setHoverColor(getHoverColor(newBgColor));
      setHoverColorForButton(getHoverColorForButton(newBgColor));
      setTextColor(getTextColorForBackground(newBgColor));
    };

    applyBackgroundColor();
  }, [boardId, board?.bg]);

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
      className="sticky top-0 z-50 w-full py-2 border-b border-gray-200 h-12 pl-1 pr-0 flex items-center"
    >
      <div className="max-h-10 w-full flex justify-between items-center pl-4 pr-1.5">
        <div className="flex items-center gap-4">
          <Link
            to={loggedInUser ? `/u/${loggedInUser?.firstName}/boards` : "/"}
            className="font-bold text-xl mr-3"
          >
            Trella
          </Link>
          <nav className="flex items-center gap-1">
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
            {loggedInUser && (
              <CreateBoardPopover
                trigger={
                  <button className="hover:bg-[var(--hover-color-for-button)] bg-[var(--hover-color)]  px-1 py-0 w-8 h-8 rounded-sm text-sm">
                    <Plus size={22} />
                  </button>
                }
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
              />
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {loggedInUser && (
            <>
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
              <div className=" hidden md:block">
                <button className=" hover:bg-[var(--hover-color)] p-1.5 rounded-sm">
                  <Bell size={18} style={{ transform: "rotate(45deg)" }} />
                </button>
                <button className=" hover:bg-[var(--hover-color)] p-1.5 rounded-sm">
                  <HelpCircle size={18} />
                </button>
              </div>
            </>
          )}

          <div className="">
            {loggedInUser ? <UserButton /> : <AuthButton />}
          </div>
          {/* <MainSideBar /> */}
        </div>
      </div>
    </header>
  );
}
