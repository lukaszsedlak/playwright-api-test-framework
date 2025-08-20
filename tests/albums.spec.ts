import { test, expect } from '@playwright/test';
import albumsData from '../test-data/albums.json';

test.describe('Albums API Tests', () => {
  test.describe('Positive Scenarios', () => {
    test('Get all albums successfully', async ({ request }) => {
      const response = await request.get('/albums');
      
      expect(response.status()).toBe(200);
      const albums = await response.json();
      
      expect(Array.isArray(albums)).toBe(true);
      expect(albums.length).toBeGreaterThan(0);
      
      // Verify each album has required fields
      for (const album of albums) {
        expect(album).toHaveProperty('id');
        expect(album).toHaveProperty('userId');
        expect(album).toHaveProperty('title');
        expect(typeof album.id).toBe('number');
        expect(typeof album.userId).toBe('number');
        expect(typeof album.title).toBe('string');
      }
    });

    test('Get album by valid ID successfully', async ({ request }) => {
      const response = await request.get('/albums/1');
      
      expect(response.status()).toBe(200);
      const album = await response.json();
      
      expect(album.id).toBe(1);
      expect(album).toHaveProperty('userId');
      expect(album).toHaveProperty('title');
    });

    test('Create new album successfully', async ({ request }) => {
      const newAlbum = {
        userId: 1,
        title: 'Test Album'
      };

      const response = await request.post('/albums', {
        data: newAlbum
      });
      
      expect(response.status()).toBe(201);
      const createdAlbum = await response.json();
      
      expect(createdAlbum).toHaveProperty('id');
      expect(createdAlbum.userId).toBe(newAlbum.userId);
      expect(createdAlbum.title).toBe(newAlbum.title);
    });

    test('Update album successfully', async ({ request }) => {
      const updatedAlbum = {
        id: 1,
        userId: 1,
        title: 'Updated Album'
      };

      const response = await request.put('/albums/1', {
        data: updatedAlbum
      });
      
      expect(response.status()).toBe(200);
      const album = await response.json();
      
      expect(album.id).toBe(updatedAlbum.id);
      expect(album.userId).toBe(updatedAlbum.userId);
      expect(album.title).toBe(updatedAlbum.title);
    });

    test('Delete album successfully', async ({ request }) => {
      const response = await request.delete('/albums/1');
      
      expect(response.status()).toBe(200);
    });

    test('Get albums by user ID', async ({ request }) => {
      const response = await request.get('/albums?userId=1');
      
      expect(response.status()).toBe(200);
      const albums = await response.json();
      
      expect(Array.isArray(albums)).toBe(true);
      for (const album of albums) {
        expect(album.userId).toBe(1);
      }
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get album by invalid ID returns 404', async ({ request }) => {
      const response = await request.get('/albums/999999');
      
      expect(response.status()).toBe(404);
    });

    test('Create album with missing required fields', async ({ request }) => {
      const incompleteAlbum = {
        userId: 1
        // Missing title field
      };

      const response = await request.post('/albums', {
        data: incompleteAlbum
      });
      
      // JSONPlaceholder doesn't validate required fields strictly
      expect([200, 201, 400]).toContain(response.status());
    });

    test('Update non-existent album returns 500', async ({ request }) => {
      const updatedAlbum = {
        id: 999999,
        userId: 1,
        title: 'Updated Album'
      };

      const response = await request.put('/albums/999999', {
        data: updatedAlbum
      });
      
      // JSONPlaceholder returns 500 for non-existent resources on PUT
      expect(response.status()).toBe(500);
    });

    test('Delete non-existent album returns 200', async ({ request }) => {
      const response = await request.delete('/albums/999999');
      
      // JSONPlaceholder returns 200 for DELETE operations even for non-existent resources
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Edge Cases', () => {
    test('Handle large payload successfully', async ({ request }) => {
      const largeTitle = 'A'.repeat(1000);
      
      const largeAlbum = {
        userId: 1,
        title: largeTitle
      };

      const response = await request.post('/albums', {
        data: largeAlbum
      });
      
      expect(response.status()).toBe(201);
      const createdAlbum = await response.json();
      
      expect(createdAlbum.title).toBe(largeTitle);
    });

    test('Handle boundary values', async ({ request }) => {
      // Test first album
      const firstResponse = await request.get('/albums/1');
      expect(firstResponse.status()).toBe(200);
      
      // Test last album (assuming 100 albums exist)
      const lastResponse = await request.get('/albums/100');
      expect(lastResponse.status()).toBe(200);
      
      const firstAlbum = await firstResponse.json();
      const lastAlbum = await lastResponse.json();
      
      expect(firstAlbum.id).toBe(1);
      expect(lastAlbum.id).toBe(100);
    });

    test('Handle special characters in payload', async ({ request }) => {
      const specialAlbum = {
        userId: 1,
        title: 'Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?'
      };

      const response = await request.post('/albums', {
        data: specialAlbum
      });
      
      expect(response.status()).toBe(201);
      const createdAlbum = await response.json();
      
      expect(createdAlbum.title).toBe(specialAlbum.title);
    });

    test('Handle empty fields', async ({ request }) => {
      const emptyFieldAlbum = {
        userId: 1,
        title: ''
      };

      const response = await request.post('/albums', {
        data: emptyFieldAlbum
      });
      
      // JSONPlaceholder accepts empty fields
      expect(response.status()).toBe(201);
      const createdAlbum = await response.json();
      
      expect(createdAlbum.title).toBe('');
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple albums with test data', async ({ request }) => {
      for (const albumData of albumsData) {
        const response = await request.post('/albums', {
          data: albumData
        });
        
        expect(response.status()).toBe(201);
        const createdAlbum = await response.json();
        
        expect(createdAlbum).toHaveProperty('id');
        expect(createdAlbum.userId).toBe(albumData.userId);
        expect(createdAlbum.title).toBe(albumData.title);
      }
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      const response = await request.get('/albums');
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Validate response schema', async ({ request }) => {
      const response = await request.get('/albums/1');
      
      expect(response.status()).toBe(200);
      const album = await response.json();
      
      // Verify required fields exist
      expect(album).toHaveProperty('id');
      expect(album).toHaveProperty('userId');
      expect(album).toHaveProperty('title');
      
      // Verify field types
      expect(typeof album.id).toBe('number');
      expect(typeof album.userId).toBe('number');
      expect(typeof album.title).toBe('string');
      
      // Verify field values are not null/undefined
      expect(album.id).not.toBeNull();
      expect(album.userId).not.toBeNull();
      expect(album.title).not.toBeNull();
    });
  });
});
