import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function ConnectionStatusBanner() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      showBanner();
    });

    // Pokazuj po uruchomieniu
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      showBanner();
    });

    return () => unsubscribe();
  }, []);

  const showBanner = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 3000);
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>
        {isConnected ? '🟢 Online' : '🔴 Offline'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#000000cc',
    borderRadius: 12,
    zIndex: 9999,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});
