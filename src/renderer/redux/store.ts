import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './notifications/notifications.slice';
import authReducer from './auth/auth.slice';
import mainReducer from './main/main.slice';
import serverReducer from './server/server.slice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    auth: authReducer,
    main: mainReducer,
    server: serverReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
