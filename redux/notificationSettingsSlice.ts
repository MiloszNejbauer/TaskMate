import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationSettingsState = {
  notificationsEnabled: boolean;
  notifyHourBefore: boolean;
  notifyDayBefore: boolean;
};

const initialState: NotificationSettingsState = {
  notificationsEnabled: true,
  notifyHourBefore: false,
  notifyDayBefore: false,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
    setNotifyHourBefore: (state, action: PayloadAction<boolean>) => {
      state.notifyHourBefore = action.payload;
    },
    setNotifyDayBefore: (state, action: PayloadAction<boolean>) => {
      state.notifyDayBefore = action.payload;
    },
  },
});

export const {
  setNotificationsEnabled,
  setNotifyHourBefore,
  setNotifyDayBefore,
} = notificationSettingsSlice.actions;

export default notificationSettingsSlice.reducer;
