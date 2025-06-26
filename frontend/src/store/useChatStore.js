import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  rooms: [],
  selectedRoom: null,
  isRoomsLoading: null,
  isCreatingRoom: false,
  viewSettings: false,

  createRoom: async (data) => {
    set({ isCreatingRoom: true });
    try {
      const res = await axiosInstance.post("/room/createRoom", data);
      toast.success(res.data.name + " Room created successfully");
      get().setSelectedRoom(res.data);
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingRoom: false });
    }
  },
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getRooms: async () => {
    set({ isRoomsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/rooms");
      set({ rooms: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isRoomsLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    const { selectedUser } = get();
    try {
      let res;
      selectedUser
        ? (res = await axiosInstance.get(`/messages/${userId}`))
        : (res = await axiosInstance.get(`/messages/room/${userId}`));
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, selectedRoom, messages } = get();
    let id;
    if (selectedUser) id = selectedUser._id;
    if (selectedRoom) id = selectedRoom._id;
    try {
      const res = await axiosInstance.post(`/messages/send/${id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser, selectedRoom } = get();
    if (!selectedUser || selectedRoom) return;
    let id;
    if (selectedUser) id = selectedUser._id;
    if (selectedRoom) id = selectedRoom._id;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, selectedRoom: null, viewSettings:false }),

  setSelectedRoom: (selectedRoom) => set({ selectedRoom, selectedUser: null , viewSettings:false}),

  setViewSettings: (value) => set({ viewSettings: !value}),
}));
