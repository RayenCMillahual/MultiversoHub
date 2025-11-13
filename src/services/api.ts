// src/services/api.ts

import { Character, CharacterResponse, Episode } from '../types/character';
import { logApiCall, logError } from '../utils/telemetry';

const BASE_URL = 'https://rickandmortyapi.com/api';

export async function getCharacters(page: number = 1): Promise<CharacterResponse> {
  try {
    const response = await fetch(`${BASE_URL}/character?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: CharacterResponse = await response.json();
    logApiCall('/character', true, { page, count: data.results.length });
    return data;
  } catch (error) {
    logApiCall('/character', false, { page, error: String(error) });
    logError('getCharacters', { page, error: String(error) });
    console.error('Error fetching characters:', error);
    throw error;
  }
}

export async function getCharacterById(id: number): Promise<Character> {
  try {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: Character = await response.json();
    logApiCall(`/character/${id}`, true, { characterName: data.name });
    return data;
  } catch (error) {
    logApiCall(`/character/${id}`, false, { error: String(error) });
    logError('getCharacterById', { id, error: String(error) });
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
}

export async function getCharactersByStatus(status: string): Promise<CharacterResponse> {
  try {
    const response = await fetch(`${BASE_URL}/character?status=${status}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: CharacterResponse = await response.json();
    logApiCall('/character (filtered)', true, { status, count: data.results.length });
    return data;
  } catch (error) {
    logApiCall('/character (filtered)', false, { status, error: String(error) });
    logError('getCharactersByStatus', { status, error: String(error) });
    console.error(`Error fetching characters with status ${status}:`, error);
    throw error;
  }
}

export async function getEpisode(url: string): Promise<Episode> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: Episode = await response.json();
    logApiCall('/episode', true, { episodeCode: data.episode, episodeName: data.name });
    return data;
  } catch (error) {
    logApiCall('/episode', false, { url, error: String(error) });
    logError('getEpisode', { url, error: String(error) });
    console.error('Error fetching episode:', error);
    throw error;
  }
}

export async function getEpisodes(urls: string[]): Promise<Episode[]> {
  try {
    const promises = urls.map(url => getEpisode(url));
    const episodes = await Promise.all(promises);
    logApiCall('/episodes (batch)', true, { 
      count: episodes.length,
      episodes: episodes.map(ep => ep.episode).join(', ')
    });
    return episodes;
  } catch (error) {
    logApiCall('/episodes (batch)', false, { urlCount: urls.length, error: String(error) });
    logError('getEpisodes', { urlCount: urls.length, error: String(error) });
    console.error('Error fetching episodes:', error);
    throw error;
  }
}