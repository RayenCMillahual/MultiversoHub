// src/services/api.ts

import { Character, CharacterResponse, Episode } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Obtener todos los personajes con paginación
 */
export async function getCharacters(page: number = 1): Promise<CharacterResponse> {
  try {
    const response = await fetch(`${BASE_URL}/character?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: CharacterResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
}

/**
 * Obtener un personaje específico por ID
 */
export async function getCharacterById(id: number): Promise<Character> {
  try {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: Character = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
}

/**
 * Obtener personajes filtrados por estado (Alive, Dead, unknown)
 */
export async function getCharactersByStatus(status: string): Promise<CharacterResponse> {
  try {
    const response = await fetch(`${BASE_URL}/character?status=${status}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: CharacterResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching characters with status ${status}:`, error);
    throw error;
  }
}

/**
 * Obtener información de un episodio por URL
 */
export async function getEpisode(url: string): Promise<Episode> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: Episode = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episode:', error);
    throw error;
  }
}

/**
 * Obtener múltiples episodios por sus URLs
 */
export async function getEpisodes(urls: string[]): Promise<Episode[]> {
  try {
    const promises = urls.map(url => getEpisode(url));
    const episodes = await Promise.all(promises);
    return episodes;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
}