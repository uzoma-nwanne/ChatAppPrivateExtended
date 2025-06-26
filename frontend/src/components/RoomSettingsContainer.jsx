import React from "react";
import RoomSettingsHeader from "./RoomSettingsHeader";
import { useChatStore } from "../store/useChatStore";

const RoomSettingsContainer = () => {
  const { selectedRoom } = useChatStore();
  return (
    <div className="w-full">
      <RoomSettingsHeader />
      <div className="flex items-center justify-center mx-auto p-4">
        <div className="rounded-full w-50 h-50 relative">
          <img src={selectedRoom.profilePic || "/avatar.png"} className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default RoomSettingsContainer;
