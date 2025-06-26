import React from "react";
import { useChatStore } from "../store/useChatStore";
import { MoveLeft } from "lucide-react";

const RoomSettingsHeader = () => {
  const { selectedRoom, viewSettings, setViewSettings } = useChatStore();

  return (
    <div className="border-b border-base-300 bg-base-100">
      <div className="flex flex-col">
        <div className="flex items-center h-12 border-b border-base-300 p-2.5 gap-8">
          <button onClick={() => setViewSettings(viewSettings)}>
            <MoveLeft />
          </button>
          <div>
            <h4>{selectedRoom.name}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSettingsHeader;
