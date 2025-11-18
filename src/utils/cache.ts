import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@multiversohub:cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

export async function cacheCharacters(characters: Character[]) {
  try {
    const cacheData = {
      timestamp: Date.now(),
      data: characters,
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching:', error);
  }
}

export async function getCachedCharacters(): Promise<Character[] | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { timestamp, data } = JSON.parse(cached);
    
    // Verificar si expiró
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
}