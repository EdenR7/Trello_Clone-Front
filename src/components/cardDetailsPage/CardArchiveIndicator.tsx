import { Archive } from "lucide-react";

function CardArchiveIndicator() {
  return (
    <div>
      <div>
        <div
          className=" relative min-h-8 py-4 pr-4 pl-14 rounded-t-lg bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[#fff7d6] "
          style={{ backgroundSize: "14px 14px" }}
        >
          <span className=" absolute top-5 left-5">
            <Archive />
          </span>
          <p className=" text-[16px] leading-8">This card is archived.</p>
        </div>
      </div>
    </div>
  );
}

export default CardArchiveIndicator;
