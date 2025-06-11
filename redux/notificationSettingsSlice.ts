// Import funkcji z Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Typ definiujący strukturę stanu powiadomień
type NotificationSettingsState = {
  notificationsEnabled: boolean; // Czy powiadomienia są w ogóle włączone
  notifyHourBefore: boolean;     // Czy powiadamiać 1 godzinę przed deadlinem
  notifyDayBefore: boolean;      // Czy powiadamiać 1 dzień przed deadlinem
};

// Stan początkowy ustawień powiadomień
const initialState: NotificationSettingsState = {
  notificationsEnabled: true,
  notifyHourBefore: false,
  notifyDayBefore: false,
};

// Tworzenie slice'a (fragmentu) stanu Redux dla ustawień powiadomień
const notificationSettingsSlice = createSlice({
  name: 'notificationSettings', // Nazwa slice'a
  initialState,                 // Domyślny stan
  reducers: {
    // Akcja do ustawiania globalnego włączenia/wyłączenia powiadomień
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
    // Akcja do ustawiania powiadomień na 1 godzinę przed deadlinem
    setNotifyHourBefore: (state, action: PayloadAction<boolean>) => {
      state.notifyHourBefore = action.payload;
    },
    // Akcja do ustawiania powiadomień na 1 dzień przed deadlinem
    setNotifyDayBefore: (state, action: PayloadAction<boolean>) => {
      state.notifyDayBefore = action.payload;
    },
  },
});

// Eksport poszczególnych akcji
export const {
  setNotificationsEnabled,
  setNotifyHourBefore,
  setNotifyDayBefore,
} = notificationSettingsSlice.actions;

// Eksport reduktora do podłączenia w store
export default notificationSettingsSlice.reducer;
