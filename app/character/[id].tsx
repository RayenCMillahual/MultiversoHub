// app/character/[id].tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing'; // 👈 IMPORT NUEVO
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  const isFavorite = character 
    ? favorites.some(fav => fav.id === character.id) 
    : false;

  useEffect(() => {
    loadCharacterDetail();
  }, [id]);

  const loadCharacterDetail = async () => {
    try {
      setLoading(true);
      const characterData = await getCharacterById(Number(id));
      setCharacter(characterData);
      
      if (characterData.episode.length > 0) {
        const episodesData = await getEpisodes(characterData.episode);
        setEpisodes(episodesData);
      }
    } catch (error) {
      console.error('Error loading character:', error);
      Alert.alert('Error', 'No se pudo cargar el personaje');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // ✨ FUNCIÓN PARA COMPARTIR (NUEVA)
  const shareCharacter = async () => {
    if (!character) return;

    const message = `🌌 ¡Mira este personaje de Rick & Morty!

📛 Nombre: ${character.name}
🧬 Especie: ${character.species}
${character.status === 'Alive' ? '💚' : character.status === 'Dead' ? '💀' : '❓'} Estado: ${character.status}
🌍 Origen: ${character.origin.name}
📍 Ubicación: ${character.location.name}

Aparece en ${episodes.length} episodio${episodes.length !== 1 ? 's' : ''}.

#RickAndMorty #MultiversoHub`;

    try {
      // Verificar si el dispositivo puede compartir
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync('data:text/plain,' + encodeURIComponent(message), {
          dialogTitle: `¡Mira a ${character.name}!`,
          mimeType: 'text/plain',
          UTI: 'public.plain-text',
        });
      } else {
        // Fallback para web o dispositivos sin sharing
        Alert.alert(
          `Compartir ${character.name}`,
          message,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'No se pudo compartir el personaje');
    }
  };

  const toggleFavorite = () => {
    if (!character) return;
    
    if (isFavorite) {
      removeFavorite(character.id);
    } else {
      addFavorite(character);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b3c7" />
        <Text style={styles.loadingText}>Cargando personaje...</Text>
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

  const statusColor = 
    character.status === 'Alive' ? '#55cc44' :
    character.status === 'Dead' ? '#d63d2e' : '#9e9e9e';

  return (
    <>
      {/* 🎯 HEADER CON BOTONES (MODIFICADO) */}
      <Stack.Screen
        options={{
          title: character.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              {/* 🔥 BOTÓN COMPARTIR (NUEVO) */}
              <TouchableOpacity 
                onPress={shareCharacter}
                style={styles.headerButton}
              >
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>

              {/* ❤️ BOTÓN FAVORITO */}
              <TouchableOpacity 
                onPress={toggleFavorite}
                style={styles.headerButton}
              >
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? "#ff6b6b" : "#fff"} 
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        {/* Imagen del personaje */}
        <Image 
          source={{ uri: character.image }} 
          style={styles.image}
          resizeMode="cover"
        />

        {/* Información Principal */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{character.name}</Text>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={styles.status}>
              {character.status} - {character.species}
            </Text>
          </View>

          <Text style={styles.gender}>
            {character.gender === 'Male' ? '♂️ Masculino' :
             character.gender === 'Female' ? '♀️ Femenino' :
             character.gender === 'Genderless' ? '⚪ Sin género' : '❓ Desconocido'}
          </Text>
        </View>

        {/* Origen */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="planet" size={20} color="#00b3c7" />
            <Text style={styles.sectionTitle}>Origen</Text>
          </View>
          <Text style={styles.sectionContent}>{character.origin.name}</Text>
        </View>

        {/* Última ubicación conocida */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#00b3c7" />
            <Text style={styles.sectionTitle}>Última ubicación conocida</Text>
          </View>
          <Text style={styles.sectionContent}>{character.location.name}</Text>
        </View>

        {/* Episodios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="tv" size={20} color="#00b3c7" />
            <Text style={styles.sectionTitle}>
              Episodios ({episodes.length})
            </Text>
          </View>
          
          {episodes.length > 0 ? (
            episodes.map((episode) => (
              <View key={episode.id} style={styles.episodeCard}>
                <Text style={styles.episodeCode}>{episode.episode}</Text>
                <Text style={styles.episodeName}>{episode.name}</Text>
                <Text style={styles.episodeDate}>{episode.air_date}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEpisodes}>
              No hay episodios disponibles
            </Text>
          )}
        </View>

        {/* Padding bottom */}
        <View style={{ height: 40 }} />
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
    fontSize: 16,
    color: '#d63d2e',
  },
  // 🎯 ESTILOS NUEVOS PARA HEADER
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
  gender: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  episodeCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00b3c7',
  },
  episodeCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00b3c7',
    marginBottom: 4,
  },
  episodeName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  episodeDate: {
    fontSize: 12,
    color: '#999',
  },
  noEpisodes: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});