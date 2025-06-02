import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function usePushPermissions() {
  useEffect(() => {
    async function registerForPushNotifications() {
      if (Device.isDevice) {
              const { status: existingStatus } = await Notifications.getPermissionsAsync();
              let finalStatus = existingStatus;
      
              if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
              }
      
              if (finalStatus !== 'granted') {
                alert('Nie uzyskano uprawnień do powiadomień!');
                return;
              }
            } else {
              alert('Powiadomienia wymagają prawdziwego urządzenia.');
            }
      
            if (Platform.OS === 'android') {
              Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.DEFAULT,
              });
            }
    }

    registerForPushNotifications();
  }, []);
}
