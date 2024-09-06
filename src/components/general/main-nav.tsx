import { Link, useParams } from "react-router-dom";
import { AuthButton } from "./auth-button";
import { UserButton } from "./user-button";
import { useAuth } from "@/providers/auth-provider";
import MainSideBar from "./main-sidebar";
import { Search, Bell, HelpCircle, Plus, ChevronDown } from "lucide-react"; // Import the down arrow icon
import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { useEffect, useState } from "react";
import { getAverageColor } from "@/utils/getAverageImgColor";
import { getTextColorForBackground } from "@/utils/getTextColorFromBg";

// Utility function to convert HEX to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return [r, g, b];
};

// Utility function to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): string => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s: number;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
};

export function MainNav() {
  const { loggedInUser } = useAuth();
  const { boardId } = useParams();
  const [boardBg, setBoardBg] = useState("rgb(255, 255, 255)");
  const [textColor, setTextColor] = useState("FFF");

  const { data: board } = useGetBoard(boardId ?? null);

  useEffect(() => {
    const applyBackgroundColor = async () => {
      if (!board) {
        setBoardBg("#FFF");
        setTextColor("#000");
        return;
      }

      const { bgType, background } = board.bg;

      switch (bgType) {
        case "color":
          setBoardBg(background);
          setTextColor(getTextColorForBackground(boardBg));
          break;
        case "gradient":
          // Extracting colors from gradient is complex; here we assume the first color
          const gradientColors = background.match(/#[0-9a-fA-F]{6}/g) || [];
          const gradientColor = gradientColors[0] || "#fff";
          setBoardBg(rgbToHsl(...hexToRgb(gradientColor))); // Convert to HSL
          setTextColor(getTextColorForBackground(boardBg));

          break;
        case "image":
          try {
            const dominantColor = await getAverageColor(background);
            setBoardBg(dominantColor);
            console.log(boardBg);

            console.log("textColor: ", textColor);
          } catch (error) {
            console.error("Failed to extract color from image", error);
          }
          break;
        default:
          setBoardBg("#fff");
      }
    };

    applyBackgroundColor();
  }, [boardId, board?.bg]);

  return (
    <header
      style={{ color: textColor, backgroundColor: boardBg }}
      className="sticky top-0 z-50 w-full py-2 border-b border-gray-200 h-12"
    >
      <div className="max-h-10 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[#44546F] font-bold text-2xl mr-4">
            Trello
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              Workspaces <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              Recent <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              Starred <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              More <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-0 w-8 h-8 rounded-sm text-sm">
              <Plus size={22} />
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-white text-gray-400 placeholder-gray-400 px-8 py-1 rounded-md text-sm w-48 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <button className="text-[#44546F] hover:bg-[#f0f0f0] p-1.5 rounded-sm">
            <Bell size={18} style={{ transform: "rotate(45deg)" }} />
          </button>
          <button className="text-[#44546F] hover:bg-[#f0f0f0] p-1.5 rounded-sm">
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
