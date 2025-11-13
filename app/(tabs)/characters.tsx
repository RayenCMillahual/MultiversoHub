// app/(tabs)/characters.tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CharacterCard from '../../src/components/CharacterCard';
import { getCharacters, getCharactersByStatus } from '../../src/services/api';
import { Character } from '../../src/types/character';

// 🎨 Componente FilterChip
interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

function FilterChip({ label, active, onPress, icon }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={active ? '#fff' : '#666'} 
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function CharactersScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🎯 Estado de filtros múltiples
  const [filters, setFilters] = useState({
    status: '',
    species: '',
    gender: '',
  });

  const params = useLocalSearchParams();
  const statusFilter = params.status as string | undefined;

  // Cargar personajes inicial
  useEffect(() => {
    loadCharacters(1);
  }, []);

  // Recargar cuando cambie el filtro desde Home
  useEffect(() => {
    if (statusFilter) {
      setFilters(prev => ({ ...prev, status: statusFilter }));
      loadCharactersWithFilters({ status: statusFilter });
    }
  }, [statusFilter]);

  // 📦 Cargar personajes básicos (sin filtros)
  const loadCharacters = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      
      let data;
      if (statusFilter && pageNum === 1) {
        data = await getCharactersByStatus(statusFilter);
      } else {
        data = await getCharacters(pageNum);
      }
      
      if (pageNum === 1) {
        setCharacters(data.results);
      } else {
        setCharacters(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.info.next !== null);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading characters:', error);
      setCharacters([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🎯 Cargar personajes CON filtros múltiples
  const loadCharactersWithFilters = async (customFilters?: typeof filters) => {
    const activeFilters = customFilters || filters;
    
    // Construir query params
    const params = new URLSearchParams();
    if (activeFilters.status) params.append('status', activeFilters.status);
    if (activeFilters.species) params.append('species', activeFilters.species);
    if (activeFilters.gender) params.append('gender', activeFilters.gender);

    const queryString = params.toString();
    const url = queryString 
      ? `https://rickandmortyapi.com/api/character?${queryString}`
      : `https://rickandmortyapi.com/api/character`;

    try {
      setLoading(true);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('No se encontraron personajes');
      }
      
      const data = await response.json();
      setCharacters(data.results || []);
      setHasMore(false); // Los filtros no soportan paginación fácilmente
    } catch (error) {
      console.error('Error loading with filters:', error);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Función de búsqueda
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      // Si borra la búsqueda, verificar si hay filtros activos
      const hasActiveFilters = filters.status || filters.species || filters.gender;
      if (hasActiveFilters) {
        loadCharactersWithFilters();
      } else {
        loadCharacters(1);
      }
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?name=${query}`
      );
      const data = await response.json();
      setCharacters(data.results || []);
      setHasMore(false);
    } catch (error) {
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Aplicar filtro individual
  const applyFilter = (filterType: keyof typeof filters, value: string) => {
    const newFilters = {
      ...filters,
      [filterType]: filters[filterType] === value ? '' : value, // Toggle
    };
    
    setFilters(newFilters);
    setSearchQuery(''); // Limpiar búsqueda al filtrar
    loadCharactersWithFilters(newFilters);
  };

  // 🧹 Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({ status: '', species: '', gender: '' });
    setSearchQuery('');
    loadCharacters(1);
  };

  // 🔄 Refrescar
  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    
    const hasActiveFilters = filters.status || filters.species || filters.gender;
    if (hasActiveFilters) {
      loadCharactersWithFilters();
    } else {
      loadCharacters(1);
    }
  };

  // 📜 Cargar más (solo sin filtros y sin búsqueda)
  const handleLoadMore = () => {
    const hasActiveFilters = filters.status || filters.species || filters.gender;
    const isSearching = searchQuery.length >= 2;
    
    if (!loading && hasMore && !hasActiveFilters && !isSearching) {
      loadCharacters(page + 1);
    }
  };

  // 👣 Footer de carga
  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#00b3c7" />
      </View>
    );
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.status || filters.species || filters.gender;

  if (loading && page === 1 && searchQuery.length < 2) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b3c7" />
        <Text style={styles.loadingText}>Cargando personajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Badge de filtro desde Home */}
      {statusFilter && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterText}>
            📌 Filtro: {statusFilter === 'alive' ? 'Vivos' : statusFilter === 'dead' ? 'Muertos' : 'Desconocidos'}
          </Text>
        </View>
      )}

      {/* 🔍 Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#999" 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar personajes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            handleSearch('');
          }}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🎯 Barra de Filtros */}
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={styles.filterBarContent}
        >
          {/* Filtros de Estado */}
          <FilterChip
            label="Vivos"
            icon="checkmark-circle"
            active={filters.status === 'alive'}
            onPress={() => applyFilter('status', 'alive')}
          />
          <FilterChip
            label="Muertos"
            icon="close-circle"
            active={filters.status === 'dead'}
            onPress={() => applyFilter('status', 'dead')}
          />
          <FilterChip
            label="Desconocidos"
            icon="help-circle"
            active={filters.status === 'unknown'}
            onPress={() => applyFilter('status', 'unknown')}
          />

          {/* Separador visual */}
          <View style={styles.separator} />

          {/* Filtros de Especie */}
          <FilterChip
            label="Humanos"
            icon="person"
            active={filters.species === 'Human'}
            onPress={() => applyFilter('species', 'Human')}
          />
          <FilterChip
            label="Aliens"
            icon="planet"
            active={filters.species === 'Alien'}
            onPress={() => applyFilter('species', 'Alien')}
          />

          {/* Separador visual */}
          <View style={styles.separator} />

          {/* Filtros de Género */}
          <FilterChip
            label="Masculino"
            icon="male"
            active={filters.gender === 'Male'}
            onPress={() => applyFilter('gender', 'Male')}
          />
          <FilterChip
            label="Femenino"
            icon="female"
            active={filters.gender === 'Female'}
            onPress={() => applyFilter('gender', 'Female')}
          />
          <FilterChip
            label="Sin género"
            icon="remove-circle"
            active={filters.gender === 'Genderless'}
            onPress={() => applyFilter('gender', 'Genderless')}
          />
        </ScrollView>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearAllFilters}
          >
            <Ionicons name="refresh" size={16} color="#00b3c7" />
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📋 Lista de Personajes */}
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron personajes' : 'No hay personajes para mostrar'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#00b3c7']}
          />
        }
        contentContainerStyle={styles.list}
      />
    </View>
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
  filterBadge: {
    backgroundColor: '#00b3c7',
    padding: 12,
    alignItems: 'center',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  filtersSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  filterBar: {
    paddingHorizontal: 12,
  },
  filterBarContent: {
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipActive: {
    backgroundColor: '#00b3c7',
    borderColor: '#00b3c7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  clearButtonText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#00b3c7',
    fontWeight: '600',
  },
  list: {
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});