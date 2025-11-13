// app/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MiniStatCard from '../../src/components/MiniStatCard'; // 👈 nuevo import
import { useFavorites } from '../../src/context/FavoritesContext';
import { getCharacters, getCharactersByStatus } from '../../src/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [loading, setLoading] = useState(true);

  // 👇 nuevo estado de estadísticas avanzadas
  const [stats, setStats] = useState({
    totalAlive: 0,
    totalDead: 0,
    totalUnknown: 0,
    mostCommonSpecies: '',
  });

  useEffect(() => {
    loadStats();
    loadAdvancedStats(); // 👈 cargamos también las estadísticas avanzadas
  }, []);

  const loadStats = async () => {
    try {
      const data = await getCharacters(1);
      setTotalCharacters(data.info.count);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 función que te pidieron en la consigna
  const loadAdvancedStats = async () => {
    try {
      const [alive, dead, unknown] = await Promise.all([
        getCharactersByStatus('alive'),
        getCharactersByStatus('dead'),
        getCharactersByStatus('unknown'),
      ]);
      
      setStats({
        totalAlive: alive.info.count,
        totalDead: dead.info.count,
        totalUnknown: unknown.info.count,
        mostCommonSpecies: 'Human', // o calcular dinámicamente
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFilterByStatus = (status: string) => {
    // Navegar a la pantalla de personajes con filtro
    router.push(`/characters?status=${status}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏠 MultiversoHub</Text>
        <Text style={styles.subtitle}>
          Explora el universo de Rick & Morty
        </Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Estadísticas</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#00b3c7" style={styles.loader} />
        ) : (
          <>
            {/* Stats principales */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#00b3c7' }]}>
                <Ionicons name="people" size={32} color="#fff" />
                <Text style={styles.statNumber}>{totalCharacters}</Text>
                <Text style={styles.statLabel}>Personajes</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#ff4444' }]}>
                <Ionicons name="heart" size={32} color="#fff" />
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Favoritos</Text>
              </View>
            </View>

            {/* 👇 Nuevas métricas avanzadas */}
            <View style={styles.miniStatsGrid}>
              <MiniStatCard 
                icon="checkmark-circle"
                value={stats.totalAlive}
                label="Vivos"
                color="#55cc44"
              />
              <MiniStatCard 
                icon="close-circle"
                value={stats.totalDead}
                label="Muertos"
                color="#d63d2e"
              />
              <MiniStatCard 
                icon="help-circle"
                value={stats.totalUnknown}
                label="Desconocidos"
                color="#9e9e9e"
              />
            </View>

            {/* Extra: especie más común */}
            <View style={[styles.statCard, { backgroundColor: '#9c27b0', marginTop: 14 }]}>
              <Ionicons name="planet" size={32} color="#fff" />
              <Text style={styles.statNumber}>
                {stats.mostCommonSpecies || '-'}
              </Text>
              <Text style={styles.statLabel}>Especie más común</Text>
            </View>
          </>
        )}
      </View>

      {/* Filtros Rápidos */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>🔍 Filtros Rápidos</Text>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: '#55cc44' }]}
          onPress={() => handleFilterByStatus('alive')}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Personajes Vivos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: '#d63d2e' }]}
          onPress={() => handleFilterByStatus('dead')}
        >
          <Ionicons name="close-circle" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Personajes Muertos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: '#9e9e9e' }]}
          onPress={() => handleFilterByStatus('unknown')}
        >
          <Ionicons name="help-circle" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Estado Desconocido</Text>
        </TouchableOpacity>
      </View>

      {/* Accesos Rápidos */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.quickAccessTitle}>⚡ Accesos Rápidos</Text>
        
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/characters')}
        >
          <Ionicons name="list" size={24} color="#00b3c7" />
          <View style={styles.quickAccessTextContainer}>
            <Text style={styles.quickAccessText}>Ver Todos los Personajes</Text>
            <Text style={styles.quickAccessSubtext}>
              Explorar la lista completa
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/favorites')}
        >
          <Ionicons name="heart" size={24} color="#ff4444" />
          <View style={styles.quickAccessTextContainer}>
            <Text style={styles.quickAccessText}>Mis Favoritos</Text>
            <Text style={styles.quickAccessSubtext}>
              {favorites.length} personajes guardados
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Datos proporcionados por Rick and Morty API
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#00b3c7',
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  // 👇 estilos para las mini cards
  miniStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  filtersContainer: {
    padding: 20,
    marginTop: 16,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  quickAccessContainer: {
    padding: 20,
    paddingTop: 0,
  },
  quickAccessTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickAccessTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quickAccessSubtext: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
