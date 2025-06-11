import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo'; // Biblioteka do sprawdzania stanu sieci

export default function ConnectionStatusBanner() {
  // Stan informujący, czy urządzenie jest połączone z siecią
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  // Czy baner ma być aktualnie widoczny
  const [visible, setVisible] = useState(false);
  // Animowana wartość przezroczystości (fade in/out)
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Subskrypcja nasłuchiwania zmian w połączeniu sieciowym
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      showBanner();
    });

    // Jednorazowe sprawdzenie połączenia przy starcie komponentu
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      showBanner();
    });

    // Czyszczenie subskrypcji przy unmountcie
    return () => unsubscribe();
  }, []);

  // Funkcja pokazująca baner przez kilka sekund
  const showBanner = () => {
    setVisible(true);

    // Animacja pojawienia się (fade in)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Ukrycie po 3 sekundach z animacją (fade out)
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 3000);
  };

  // Jeśli baner nie ma być widoczny, nie renderuj nic
  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>
        {isConnected ? '🟢 Online' : '🔴 Offline'}
      </Text>
    </Animated.View>
  );
}

// Style banera
const styles = StyleSheet.create({
  container: {
    position: 'absolute',      // Nakłada się nad inne elementy
    top: 40,                   // Od góry
    right: 16,                 // Od prawej
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#000000cc', // Półprzezroczyste tło
    borderRadius: 12,
    zIndex: 9999,              // Wysoki priorytet warstwy
  },
  text: {
    color: '#fff',             // Biały tekst
    fontSize: 14,
  },
});
