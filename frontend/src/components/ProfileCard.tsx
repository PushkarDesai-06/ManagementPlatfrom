import { MapPin, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ProfileCardProps } from "../types/types";

const ProfileCard = ({
  handleEditClick,
  name = "John Doe",
  city = "Bengaluru",
  countryCode = "IN",
  handle = "@johndoe",
  description = "Lorem, ipsum dolor sit amet consectetur adipisicing elit",
  pfpUrl = "https://picsum.photos/400",
}: ProfileCardProps) => {
  return (
    <motion.div
      className="w-full bg-[#1a1625] border border-[#2d2740] rounded-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex p-6">
        <div className="rounded-full w-20 h-20 flex justify-center items-center mr-6 overflow-hidden border-2 border-[#2d2740]">
          <img src={pfpUrl} alt="PFP" />
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg mb-1 text-[#e8e3f5]">
                {name}
              </div>
              <div className="flex gap-4 mb-2">
                <div className="flex gap-1.5 items-center">
                  <MapPin className="text-[#6b5f88]" size={14} />
                  <p className="text-xs text-[#8b7fb8]">
                    {city} {countryCode}
                  </p>
                </div>
                <div className="flex gap-1.5 items-center">
                  <Share2 className="text-[#6b5f88]" size={14} />
                  <p className="text-xs text-[#8b7fb8]">{handle}</p>
                </div>
              </div>
              <div className="text-sm text-[#6b5f88]">{description}</div>
            </div>
            <button
              className="border border-[#2d2740] px-4 py-1.5 rounded-lg cursor-pointer bg-[#0f0b16] hover:bg-[#1a1625] text-[#c4b8e0] transition text-sm"
              onClick={(e) => handleEditClick(e)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
