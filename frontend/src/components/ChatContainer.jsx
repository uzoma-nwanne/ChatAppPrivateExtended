import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Scissors ,Copy, Clipboard, Forward} from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const menuRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (menuVisible && menuRef) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 360;
      const menuHeight = menuRef.current.offsetHeight;

      let xPos = menuPosition.x;
      let yPos = menuPosition.y;

      if (xPos + menuWidth > viewportWidth) {
        xPos = viewportWidth - menuWidth;
      }
      if (yPos + menuHeight > viewportHeight) {
        yPos = viewportHeight - menuHeight;
      }

      setAdjustedPosition({ x: xPos, y: yPos });
    }
  }, [menuVisible, menuPosition]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleRightClick = (e) => {
    e.preventDefault();
    if (e.target.tagName === 'SECTION') {
      setMenuPosition({ x: e.clientX, y: e.clientY });
      setMenuVisible(true);
    }
  };

  const handleClick = () => {
    setMenuVisible(false);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onContextMenu={handleRightClick}
        onClick={handleClick}
      >
        {menuVisible && (
          <ul
            ref={menuRef}
            className="bg-base-200 z-200 border rounded-sm border-transparent"
            style={{
              position: "absolute",
              top: `${adjustedPosition.y}px`,
              left: `${adjustedPosition.x}px`,
            }}
          >
            <li className="hover:bg-base-300 w-full p-2" ><div className="flex items-center gap-2"><Copy size={8}/> Copy </div></li>
            <li className="hover:bg-base-300 w-full p-2"><div className="flex items-center gap-2"><Clipboard size={8}/>Paste </div></li>
            <li className="hover:bg-base-300 w-full p-2"><div className="flex items-center gap-2"><Forward size={8}/>Forward</div></li>
          </ul>
        )}
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <section className="chat-bubble flex flex-col" >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </section>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
