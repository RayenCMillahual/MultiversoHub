// app/(tabs)/characters.tsx

import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import CharacterCard from '../../src/components/CharacterCard';
import { getCharacters } from '../../src/services/api';
import { Character } from '../../src/types/character';

export default function CharactersScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Cargar personajes inicial
  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const data = await getCharacters(pageNum);
      
      if (pageNum === 1) {
        setCharacters(data.results);
      } else {
        setCharacters(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.info.next !== null);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCharacters(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCharacters(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#00b3c7" />
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b3c7" />
        <Text style={styles.loadingText}>Cargando personajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
  list: {
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});