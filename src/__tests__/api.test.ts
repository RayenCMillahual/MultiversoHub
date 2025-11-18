import { getCharacters } from '../services/api';

describe('API Tests', () => {
  it('should fetch characters', async () => {
    const data = await getCharacters(1);
    expect(data.results).toBeDefined();
    expect(data.results.length).toBeGreaterThan(0);
  });

  it('should have valid character structure', async () => {
    const data = await getCharacters(1);
    const character = data.results[0];
    
    expect(character).toHaveProperty('id');
    expect(character).toHaveProperty('name');
    expect(character).toHaveProperty('status');
  });
});