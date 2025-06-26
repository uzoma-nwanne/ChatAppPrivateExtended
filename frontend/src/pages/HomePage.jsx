import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/SideBar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import RoomChatContainer from "../components/RoomChatContainer";
import RoomSettingsContainer from "../components/RoomSettingsContainer";

const HomePage = () => {
  const { selectedUser, selectedRoom, viewSettings } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? (
              !selectedRoom ? (
                <NoChatSelected />
              ) : viewSettings ? (
                <RoomSettingsContainer />
              ) : (
                <RoomChatContainer />
              )
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
