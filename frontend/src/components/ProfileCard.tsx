import React from "react";
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
      className="w-2xl"
      initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex p-4">
        <div className="rounded-full w-28 h-28 border-2 flex justify-center items-center mr-8 overflow-hidden border-neutral-400/80">
          <img src={pfpUrl} alt="PFP" />
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex justify-between">
            <div className="font-rubik font-medium text-2xl mb-2">{name}</div>
            <div>

            </div>
            <button
              className="border w-24 rounded-md font-rubik cursor-pointer"
              onClick={(e) => handleEditClick(e)}
            >
              Edit
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-1 items-center">
              <MapPin className="text-sm text-neutral-600" size={18} />
              <p className="text-sm text-neutral-500 font-inter">
                {city} {countryCode}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Share2 className="text-sm text-neutral-600" size={18} />
              <p className="text-sm text-neutral-500 font-inter">{handle}</p>
            </div>
          </div>
          <div className="text-neutral-600">{description}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
