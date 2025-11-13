// src/components/CharacterCard.tsx

import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();

  // 🔹 valor compartido para la escala
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    router.push(`/character/${character.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return '#55cc44';
      case 'Dead':
        return '#d63d2e';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image 
            source={{ uri: character.image }} 
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {character.name}
            </Text>
            
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(character.status) }
                ]} 
              />
              <Text style={styles.status}>
                {character.status} - {character.species}
              </Text>
            </View>

            <Text style={styles.location} numberOfLines={1}>
              📍 {character.location.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
});
