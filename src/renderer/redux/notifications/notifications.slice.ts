import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ILauncherLog } from '../../../types';

export interface NotificationsState {
  messages: ILauncherLog[];
}

const initialState: NotificationsState = {
  messages: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<ILauncherLog, 'id'>>
    ) => {
      state.messages.push({ id: Date.now(), ...action.payload });
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(
        (message: ILauncherLog) => message.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.messages = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
