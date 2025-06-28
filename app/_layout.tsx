import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import { usePushPermissions } from '@/hooks/usePushPermissions';
import * as Notifications from 'expo-notifications';
import { Slot } from 'expo-router';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store';

// Ustaw globalny handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});


// Android kanał powiadomień
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.HIGH,
  });
}



export default function RootLayout() {

  usePushPermissions();
  console.log("RootLayout: store test", store.getState());
  console.log("Root layout store:", store);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectionStatusBanner />
        <Slot />
      </PersistGate>
    </Provider>
  );
}
