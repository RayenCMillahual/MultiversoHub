// src/context/FavoritesContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { Character } from '../types/character';

// Tipos
interface FavoritesState {
  favorites: Character[];
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Character }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'LOAD_FAVORITES'; payload: Character[] }
  | { type: 'CLEAR_FAVORITES' };

interface FavoritesContextType {
  favorites: Character[];
  addFavorite: (character: Character) => void;
  removeFavorite: (characterId: number) => void;
  isFavorite: (characterId: number) => boolean;
  clearFavorites: () => void;
}

// Clave para AsyncStorage
const FAVORITES_STORAGE_KEY = '@multiversohub:favorites';

// Estado inicial
const initialState: FavoritesState = {
  favorites: [],
};

// Reducer
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      // No agregar si ya existe
      if (state.favorites.some(fav => fav.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
      };
    
    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };
    
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
      };
    
    default:
      return state;
  }
}

// Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Cargar favoritos al iniciar
  useEffect(() => {
    loadFavorites();
  }, []);

  // Guardar favoritos cada vez que cambien
  useEffect(() => {
    saveFavorites(state.favorites);
  }, [state.favorites]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored);
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (favorites: Character[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = (character: Character) => {
    dispatch({ type: 'ADD_FAVORITE', payload: character });
  };

  const removeFavorite = (characterId: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: characterId });
  };

  const isFavorite = (characterId: number): boolean => {
    return state.favorites.some(fav => fav.id === characterId);
  };

  const clearFavorites = async () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook personalizado
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}