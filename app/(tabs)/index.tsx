// app/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit'; // 👈 IMPORT NUEVO
import { useFavorites } from '../../src/context/FavoritesContext';
import { getCharacters, getCharactersByStatus } from '../../src/services/api';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 📊 ESTADO PARA ESTADÍSTICAS AVANZADAS (NUEVO)
  const [stats, setStats] = useState({
    totalAlive: 0,
    totalDead: 0,
    totalUnknown: 0,
  });

  useEffect(() => {
    loadStats();
    loadAdvancedStats(); // 👈 LLAMAR FUNCIÓN NUEVA
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

  // 📊 FUNCIÓN PARA CARGAR ESTADÍSTICAS AVANZADAS (NUEVA)
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
      });
    } catch (error) {
      console.error('Error loading advanced stats:', error);
    }
  };

  const navigateToCharacters = (status?: string) => {
    if (status) {
      router.push(`/characters?status=${status}`);
    } else {
      router.push('/characters');
    }
  };

  // 📊 DATOS DEL GRÁFICO (NUEVO)
  const chartData = [
    {
      name: 'Vivos',
      population: stats.totalAlive,
      color: '#55cc44',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Muertos',
      population: stats.totalDead,
      color: '#d63d2e',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Desconocidos',
      population: stats.totalUnknown,
      color: '#9e9e9e',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b3c7" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🏠</Text>
        <Text style={styles.title}>MultiversoHub</Text>
        <Text style={styles.subtitle}>Explora el universo de Rick & Morty</Text>
      </View>

      {/* Estadísticas Principales */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
        
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#00b3c7' }]}>
            <Ionicons name="people" size={40} color="#fff" />
            <Text style={styles.statNumber}>{totalCharacters}</Text>
            <Text style={styles.statLabel}>Personajes</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#ff6b6b' }]}>
            <Ionicons name="heart" size={40} color="#fff" />
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>
      </View>

      {/* 📊 GRÁFICO DE DISTRIBUCIÓN (NUEVO) */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>📈 Distribución por Estado</Text>
        
        {stats.totalAlive > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // 👈 Muestra números en lugar de porcentajes
            />
          </View>
        ) : (
          <View style={styles.chartLoading}>
            <ActivityIndicator size="small" color="#00b3c7" />
            <Text style={styles.chartLoadingText}>Cargando estadísticas...</Text>
          </View>
        )}

        {/* Mini cards con estadísticas */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStatCard}>
            <View style={[styles.miniStatDot, { backgroundColor: '#55cc44' }]} />
            <Text style={styles.miniStatLabel}>Vivos</Text>
            <Text style={styles.miniStatNumber}>{stats.totalAlive}</Text>
          </View>

          <View style={styles.miniStatCard}>
            <View style={[styles.miniStatDot, { backgroundColor: '#d63d2e' }]} />
            <Text style={styles.miniStatLabel}>Muertos</Text>
            <Text style={styles.miniStatNumber}>{stats.totalDead}</Text>
          </View>

          <View style={styles.miniStatCard}>
            <View style={[styles.miniStatDot, { backgroundColor: '#9e9e9e' }]} />
            <Text style={styles.miniStatLabel}>Desconocidos</Text>
            <Text style={styles.miniStatNumber}>{stats.totalUnknown}</Text>
          </View>
        </View>
      </View>

      {/* Filtros Rápidos */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>🔍 Filtros Rápidos</Text>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: '#55cc44' }]}
          onPress={() => navigateToCharacters('alive')}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Personajes Vivos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: '#d63d2e' }]}
          onPress={() => navigateToCharacters('dead')}
        >
          <Ionicons name="close-circle" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Personajes Muertos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: '#9e9e9e' }]}
          onPress={() => navigateToCharacters('unknown')}
        >
          <Ionicons name="help-circle" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Estado Desconocido</Text>
        </TouchableOpacity>
      </View>

      {/* Accesos Rápidos */}
      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>⚡ Accesos Rápidos</Text>

        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateToCharacters()}
        >
          <Ionicons name="list" size={24} color="#00b3c7" />
          <View style={styles.quickAccessText}>
            <Text style={styles.quickAccessTitle}>Ver Todos los Personajes</Text>
            <Text style={styles.quickAccessSubtitle}>
              Explorar la lista completa
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/favorites')}
        >
          <Ionicons name="heart" size={24} color="#ff6b6b" />
          <View style={styles.quickAccessText}>
            <Text style={styles.quickAccessTitle}>Mis Favoritos</Text>
            <Text style={styles.quickAccessSubtitle}>
              {favorites.length} personaje{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#00b3c7',
    padding: 30,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  // 📊 ESTILOS DEL GRÁFICO (NUEVOS)
  chartSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartLoading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  miniStatCard: {
    alignItems: 'center',
  },
  miniStatDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  miniStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  quickAccessSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quickAccessText: {
    flex: 1,
    marginLeft: 12,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});