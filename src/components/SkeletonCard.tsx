import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.image} />
      <View style={styles.info}>
        <View style={styles.line} />
        <View style={[styles.line, styles.lineShort]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 120,
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: '#d0d0d0',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  line: {
    height: 12,
    backgroundColor: '#d0d0d0',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineShort: {
    width: '60%',
  },
});