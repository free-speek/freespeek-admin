import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import usersReducer from "./slices/usersSlice";
import chatsReducer from "./slices/chatsSlice";
import supportChatsReducer from "./slices/supportChatsSlice";
import messagesReducer from "./slices/messagesSlice";
import chatHistoryReducer from "./slices/chatHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    chats: chatsReducer,
    supportChats: supportChatsReducer,
    messages: messagesReducer,
    chatHistory: chatHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
