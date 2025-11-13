// app/character/[id].tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useFavorites } from '../../src/context/FavoritesContext';
import { getCharacterById, getEpisodes } from '../../src/services/api';
import { Character, Episode } from '../../src/types/character';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite } = useFavorites();
  useEffect(() => {
    loadCharacterDetail();
  }, [id]);

  const loadCharacterDetail = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del personaje
      const characterData = await getCharacterById(Number(id));
      setCharacter(characterData);
      
      // Obtener información de episodios (solo los primeros 5 para no sobrecargar)
      const episodeUrls = characterData.episode.slice(0, 5);
      const episodesData = await getEpisodes(episodeUrls);
      setEpisodes(episodesData);
      
    } catch (error) {
      console.error('Error loading character detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
  if (!character) return;
  
  if (checkIsFavorite(character.id)) {
    removeFavorite(character.id);
  } else {
    addFavorite(character);
  }
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b3c7" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Personaje no encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: character.name,
          headerRight: () => (
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
             <Ionicons 
  name={checkIsFavorite(character?.id || 0) ? "heart" : "heart-outline"} 
  size={24} 
  color={checkIsFavorite(character?.id || 0) ? "#ff4444" : "#fff"} 
/>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container}>
        {/* Imagen del personaje */}
        <Image source={{ uri: character.image }} style={styles.image} />
        
        {/* Información básica */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{character.name}</Text>
          
          <View style={styles.statusRow}>
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

          {character.type && (
            <Text style={styles.type}>Tipo: {character.type}</Text>
          )}

          <Text style={styles.gender}>Género: {character.gender}</Text>
        </View>

        {/* Origen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Origen</Text>
          <Text style={styles.sectionContent}>{character.origin.name}</Text>
        </View>

        {/* Ubicación actual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Última ubicación conocida</Text>
          <Text style={styles.sectionContent}>{character.location.name}</Text>
        </View>

        {/* Episodios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📺 Episodios</Text>
          <Text style={styles.episodeCount}>
            Aparece en {character.episode.length} episodio(s)
          </Text>
          
          {episodes.length > 0 && (
            <View style={styles.episodesList}>
              {episodes.map((episode) => (
                <View key={episode.id} style={styles.episodeCard}>
                  <Text style={styles.episodeNumber}>{episode.episode}</Text>
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeName}>{episode.name}</Text>
                    <Text style={styles.episodeDate}>{episode.air_date}</Text>
                  </View>
                </View>
              ))}
              
              {character.episode.length > 5 && (
                <Text style={styles.moreEpisodes}>
                  + {character.episode.length - 5} episodios más
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#d63d2e',
  },
  favoriteButton: {
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  status: {
    fontSize: 18,
    color: '#666',
  },
  type: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  gender: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
  },
  episodeCount: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  episodesList: {
    marginTop: 10,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00b3c7',
  },
  episodeNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00b3c7',
    marginRight: 12,
    minWidth: 60,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  episodeDate: {
    fontSize: 12,
    color: '#999',
  },
  moreEpisodes: {
    fontSize: 14,
    color: '#00b3c7',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});