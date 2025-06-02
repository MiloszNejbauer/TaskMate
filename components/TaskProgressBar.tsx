import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

type Props = {
  progress: number; // 0 to 1
};

export default function ProgressBar({ progress }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500, // czas animacji w ms
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const colorInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['hsl(120, 80%, 50%)', 'hsl(0, 80%, 50%)'], // zielony -> czerwony
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: widthInterpolate,
            backgroundColor: colorInterpolate,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
});
