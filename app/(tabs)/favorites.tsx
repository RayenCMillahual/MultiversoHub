// app/(tabs)/favorites.tsx

import { FlatList, StyleSheet, Text, View } from 'react-native';
import CharacterCard from '../../src/components/CharacterCard';
import { useFavorites } from '../../src/context/FavoritesContext';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyTitle}>No tienes favoritos</Text>
        <Text style={styles.emptySubtitle}>
          Agrega personajes a favoritos desde su página de detalle
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>
        {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
      </Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    padding: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 16,
  },
});