// Importy z Redux Toolkit i redux-persist
import AsyncStorage from '@react-native-async-storage/async-storage'; // Lokalna pamięć na urządzeniu (dla persist)
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist'; // Umożliwia zachowanie stanu w pamięci
import notificationSettingsReducer from './notificationSettingsSlice'; // Reducer ustawień powiadomień
import tasksReducer from './tasksSlice'; // Reducer zadań

// Akcje ignorowane przez middleware ze względu na niestandardowe dane
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

// Konfiguracja persist — określa klucz i mechanizm przechowywania danych
const persistConfig = {
  key: 'root',             // Klucz rootowy dla całego stanu
  storage: AsyncStorage,   // Przechowywanie danych w pamięci urządzenia
};

// Połączenie wszystkich reducerów w jeden główny reducer
const rootReducer = combineReducers({
  tasks: tasksReducer,                     // Stan zadań
  notificationSettings: notificationSettingsReducer, // Stan ustawień powiadomień
});

// Zastosowanie persist do rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Konfiguracja i utworzenie store Redux z middleware
export const store = configureStore({
  reducer: persistedReducer, // Reducer z persist
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        //akcje, które redux-persist wykorzystuje wewnętrznie
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tworzenie persistor — potrzebne do działania redux-persist
export const persistor = persistStore(store);

// Typy do użytku w aplikacji
export type RootState = ReturnType<typeof store.getState>; // Typ całego stanu aplikacji
export type AppDispatch = typeof store.dispatch; // Typ funkcji dispatch (do użycia np. z useDispatch)
