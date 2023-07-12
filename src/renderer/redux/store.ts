import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './notifications/notifications.slice';
import authReducer from './auth/auth.slice';
import mainReducer from './main/main.slice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    auth: authReducer,
    main: mainReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
