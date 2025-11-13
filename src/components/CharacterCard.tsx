// src/components/CharacterCard.tsx

import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();

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

  const handlePress = () => {
    router.push(`/character/${character.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
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