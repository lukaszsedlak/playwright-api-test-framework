import { test, expect } from '@playwright/test';
import photosData from '../test-data/photos.json';

test.describe('Photos API Tests', () => {
  test.describe('Positive Scenarios', () => {
    test('Get all photos successfully', async ({ request }) => {
      const response = await request.get('/photos');
      
      expect(response.status()).toBe(200);
      const photos = await response.json();
      
      expect(Array.isArray(photos)).toBe(true);
      expect(photos.length).toBeGreaterThan(0);
      
      // Verify each photo has required fields
      for (const photo of photos) {
        expect(photo).toHaveProperty('id');
        expect(photo).toHaveProperty('albumId');
        expect(photo).toHaveProperty('title');
        expect(photo).toHaveProperty('url');
        expect(photo).toHaveProperty('thumbnailUrl');
        expect(typeof photo.id).toBe('number');
        expect(typeof photo.albumId).toBe('number');
        expect(typeof photo.title).toBe('string');
        expect(typeof photo.url).toBe('string');
        expect(typeof photo.thumbnailUrl).toBe('string');
      }
    });

    test('Get photo by valid ID successfully', async ({ request }) => {
      const response = await request.get('/photos/1');
      
      expect(response.status()).toBe(200);
      const photo = await response.json();
      
      expect(photo.id).toBe(1);
      expect(photo).toHaveProperty('albumId');
      expect(photo).toHaveProperty('title');
      expect(photo).toHaveProperty('url');
      expect(photo).toHaveProperty('thumbnailUrl');
    });

    test('Create new photo successfully', async ({ request }) => {
      const newPhoto = {
        albumId: 1,
        title: 'Test Photo',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      };

      const response = await request.post('/photos', {
        data: newPhoto
      });
      
      expect(response.status()).toBe(201);
      const createdPhoto = await response.json();
      
      expect(createdPhoto).toHaveProperty('id');
      expect(createdPhoto.albumId).toBe(newPhoto.albumId);
      expect(createdPhoto.title).toBe(newPhoto.title);
      expect(createdPhoto.url).toBe(newPhoto.url);
      expect(createdPhoto.thumbnailUrl).toBe(newPhoto.thumbnailUrl);
    });

    test('Update photo successfully', async ({ request }) => {
      const updatedPhoto = {
        id: 1,
        albumId: 1,
        title: 'Updated Photo',
        url: 'https://via.placeholder.com/600/updated',
        thumbnailUrl: 'https://via.placeholder.com/150/updated'
      };

      const response = await request.put('/photos/1', {
        data: updatedPhoto
      });
      
      expect(response.status()).toBe(200);
      const photo = await response.json();
      
      expect(photo.id).toBe(updatedPhoto.id);
      expect(photo.albumId).toBe(updatedPhoto.albumId);
      expect(photo.title).toBe(updatedPhoto.title);
      expect(photo.url).toBe(updatedPhoto.url);
      expect(photo.thumbnailUrl).toBe(updatedPhoto.thumbnailUrl);
    });

    test('Delete photo successfully', async ({ request }) => {
      const response = await request.delete('/photos/1');
      
      expect(response.status()).toBe(200);
    });

    test('Get photos by album ID', async ({ request }) => {
      const response = await request.get('/photos?albumId=1');
      
      expect(response.status()).toBe(200);
      const photos = await response.json();
      
      expect(Array.isArray(photos)).toBe(true);
      for (const photo of photos) {
        expect(photo.albumId).toBe(1);
      }
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get photo by invalid ID returns 404', async ({ request }) => {
      const response = await request.get('/photos/999999');
      
      expect(response.status()).toBe(404);
    });

    test('Create photo with missing required fields', async ({ request }) => {
      const incompletePhoto = {
        albumId: 1,
        title: 'Test Photo'
        // Missing url and thumbnailUrl fields
      };

      const response = await request.post('/photos', {
        data: incompletePhoto
      });
      
      // JSONPlaceholder doesn't validate required fields strictly
      expect([200, 201, 400]).toContain(response.status());
    });

    test('Update non-existent photo returns 500', async ({ request }) => {
      const updatedPhoto = {
        id: 999999,
        albumId: 1,
        title: 'Updated Photo',
        url: 'https://via.placeholder.com/600/updated',
        thumbnailUrl: 'https://via.placeholder.com/150/updated'
      };

      const response = await request.put('/photos/999999', {
        data: updatedPhoto
      });
      
      // JSONPlaceholder returns 500 for non-existent resources on PUT
      expect(response.status()).toBe(500);
    });

    test('Delete non-existent photo returns 200', async ({ request }) => {
      const response = await request.delete('/photos/999999');
      
      // JSONPlaceholder returns 200 for DELETE operations even for non-existent resources
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Edge Cases', () => {
    test('Handle large payload successfully', async ({ request }) => {
      const largeTitle = 'A'.repeat(1000);
      const largeUrl = 'https://via.placeholder.com/600/' + 'B'.repeat(500);
      
      const largePhoto = {
        albumId: 1,
        title: largeTitle,
        url: largeUrl,
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      };

      const response = await request.post('/photos', {
        data: largePhoto
      });
      
      expect(response.status()).toBe(201);
      const createdPhoto = await response.json();
      
      expect(createdPhoto.title).toBe(largeTitle);
      expect(createdPhoto.url).toBe(largeUrl);
    });

    test('Handle boundary values', async ({ request }) => {
      // Test first photo
      const firstResponse = await request.get('/photos/1');
      expect(firstResponse.status()).toBe(200);
      
      // Test last photo (assuming 5000 photos exist)
      const lastResponse = await request.get('/photos/5000');
      expect(lastResponse.status()).toBe(200);
      
      const firstPhoto = await firstResponse.json();
      const lastPhoto = await lastResponse.json();
      
      expect(firstPhoto.id).toBe(1);
      expect(lastPhoto.id).toBe(5000);
    });

    test('Handle special characters in payload', async ({ request }) => {
      const specialPhoto = {
        albumId: 1,
        title: 'Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
        url: 'https://via.placeholder.com/600/special',
        thumbnailUrl: 'https://via.placeholder.com/150/special'
      };

      const response = await request.post('/photos', {
        data: specialPhoto
      });
      
      expect(response.status()).toBe(201);
      const createdPhoto = await response.json();
      
      expect(createdPhoto.title).toBe(specialPhoto.title);
    });

    test('Handle empty fields', async ({ request }) => {
      const emptyFieldPhoto = {
        albumId: 1,
        title: '',
        url: 'https://via.placeholder.com/600/empty',
        thumbnailUrl: 'https://via.placeholder.com/150/empty'
      };

      const response = await request.post('/photos', {
        data: emptyFieldPhoto
      });
      
      // JSONPlaceholder accepts empty fields
      expect(response.status()).toBe(201);
      const createdPhoto = await response.json();
      
      expect(createdPhoto.title).toBe('');
    });

    test('Handle invalid URL formats', async ({ request }) => {
      const invalidUrlPhoto = {
        albumId: 1,
        title: 'Invalid URL Test',
        url: 'not-a-valid-url',
        thumbnailUrl: 'also-not-valid'
      };

      const response = await request.post('/photos', {
        data: invalidUrlPhoto
      });
      
      // JSONPlaceholder accepts invalid URLs
      expect(response.status()).toBe(201);
      const createdPhoto = await response.json();
      
      expect(createdPhoto.url).toBe(invalidUrlPhoto.url);
      expect(createdPhoto.thumbnailUrl).toBe(invalidUrlPhoto.thumbnailUrl);
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple photos with test data', async ({ request }) => {
      for (const photoData of photosData) {
        const response = await request.post('/photos', {
          data: photoData
        });
        
        expect(response.status()).toBe(201);
        const createdPhoto = await response.json();
        
        expect(createdPhoto).toHaveProperty('id');
        expect(createdPhoto.albumId).toBe(photoData.albumId);
        expect(createdPhoto.title).toBe(photoData.title);
        expect(createdPhoto.url).toBe(photoData.url);
        expect(createdPhoto.thumbnailUrl).toBe(photoData.thumbnailUrl);
      }
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      const response = await request.get('/photos');
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Validate response schema', async ({ request }) => {
      const response = await request.get('/photos/1');
      
      expect(response.status()).toBe(200);
      const photo = await response.json();
      
      // Verify required fields exist
      expect(photo).toHaveProperty('id');
      expect(photo).toHaveProperty('albumId');
      expect(photo).toHaveProperty('title');
      expect(photo).toHaveProperty('url');
      expect(photo).toHaveProperty('thumbnailUrl');
      
      // Verify field types
      expect(typeof photo.id).toBe('number');
      expect(typeof photo.albumId).toBe('number');
      expect(typeof photo.title).toBe('string');
      expect(typeof photo.url).toBe('string');
      expect(typeof photo.thumbnailUrl).toBe('string');
      
      // Verify field values are not null/undefined
      expect(photo.id).not.toBeNull();
      expect(photo.albumId).not.toBeNull();
      expect(photo.title).not.toBeNull();
      expect(photo.url).not.toBeNull();
      expect(photo.thumbnailUrl).not.toBeNull();
    });
  });
});
