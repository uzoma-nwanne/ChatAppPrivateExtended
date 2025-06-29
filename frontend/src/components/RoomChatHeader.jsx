import { X, Settings } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const RoomChatHeader = () => {
  const { selectedRoom, setSelectedRoom, setViewSettings , viewSettings} = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedRoom.profilePic || "/avatar.png"}
                alt={selectedRoom.name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedRoom.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedRoom._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex justify-between w-20">
         
          {/* Group Settings */}
          <button onClick={()=>setViewSettings(viewSettings)}>
            <Settings />
          </button>
          {/* Close button */}
          <button onClick={() => setSelectedRoom(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChatHeader;
