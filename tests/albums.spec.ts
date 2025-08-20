import { test, expect } from '@playwright/test';
import { ApiAssertions } from '../utils/assertions';
import { ApiHelpers, TestDataGenerators } from '../utils/api-helpers';
import { Album, CreateAlbumRequest, UpdateAlbumRequest } from '../types/api-types';
import albumsData from '../test-data/albums.json';

test.describe('Albums API Tests', () => {
  let sampleAlbum: Album;
  let testAlbumData: CreateAlbumRequest;

  test.beforeAll(async ({ request }) => {
    // Fetch a sample album for reuse in tests
    const response = await request.get('/albums/1');
    sampleAlbum = await response.json();
    
    // Initialize test data
    testAlbumData = TestDataGenerators.createTestAlbum();
  });

  test.beforeEach(async () => {
    // Reset test data for each test
    testAlbumData = TestDataGenerators.createTestAlbum();
  });

  test.describe('GET Operations', () => {
    test('Get all albums successfully', async ({ request }) => {
      await test.step('Send GET request to /albums endpoint', async () => {
        const response = await request.get('/albums');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid array with base resource fields', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertBaseResourceArray(response);
        });
        
        await test.step('Verify album schema matches expected structure', async () => {
          await ApiAssertions.assertSchema<Album>(response, {
            id: 'number',
            userId: 'number',
            title: 'string'
          });
        });
      });
    });

    test('Get album by valid ID successfully', async ({ request }) => {
      await test.step('Send GET request to /albums/1 endpoint', async () => {
        const response = await request.get('/albums/1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid object with base resource fields', async () => {
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify specific album data', async () => {
          const album = await response.json();
          expect(album.id).toBe(1);
          expect(album).toHaveProperty('userId');
          expect(album).toHaveProperty('title');
        });
      });
    });

    test('Get albums by user ID', async ({ request }) => {
      await test.step('Send GET request to /albums?userId=1 endpoint', async () => {
        const response = await request.get('/albums?userId=1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is filtered array', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertArrayFilteredByField(response, 'userId', 1);
        });
      });
    });
  });

  test.describe('POST Operations', () => {
    test('Create new album successfully', async ({ request }) => {
      await test.step('Send POST request to create new album', async () => {
        const response = await request.post('/albums', {
          data: testAlbumData
        });
        
        await test.step('Verify album was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Album>(response, testAlbumData);
        });
      });
    });

    test('Create album with large payload', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeAlbumData = TestDataGenerators.createTestAlbum({
          title: TestDataGenerators.createLargePayload(1000)
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/albums', {
            data: largeAlbumData
          });
          
          await test.step('Verify large payload album was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Album>(response, largeAlbumData);
          });
        });
      });
    });

    test('Create album with special characters', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialAlbumData = TestDataGenerators.createTestAlbum({
          title: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/albums', {
            data: specialAlbumData
          });
          
          await test.step('Verify special characters album was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Album>(response, specialAlbumData);
          });
        });
      });
    });

    test('Create album with empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldAlbumData = TestDataGenerators.createTestAlbum({
          title: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/albums', {
            data: emptyFieldAlbumData
          });
          
          await test.step('Verify empty fields album was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Album>(response, emptyFieldAlbumData);
          });
        });
      });
    });
  });

  test.describe('PUT Operations', () => {
    test('Update album successfully', async ({ request }) => {
      await test.step('Prepare update data for existing album', async () => {
        const updatedAlbumData: UpdateAlbumRequest = {
          id: 1,
          userId: 1,
          title: 'Updated Album'
        };

        await test.step('Send PUT request to update album', async () => {
          const response = await request.put('/albums/1', {
            data: updatedAlbumData
          });
          
          await test.step('Verify album was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Album>(response, updatedAlbumData);
          });
        });
      });
    });

    test('Update album with large payload', async ({ request }) => {
      await test.step('Prepare large payload update data', async () => {
        const largeUpdatedAlbumData: UpdateAlbumRequest = {
          id: 1,
          userId: 1,
          title: TestDataGenerators.createLargePayload(1000)
        };

        await test.step('Send PUT request with large payload', async () => {
          const response = await request.put('/albums/1', {
            data: largeUpdatedAlbumData
          });
          
          await test.step('Verify large payload album was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Album>(response, largeUpdatedAlbumData);
          });
        });
      });
    });
  });

  test.describe('DELETE Operations', () => {
    test('Delete album successfully', async ({ request }) => {
      await test.step('Send DELETE request to remove album', async () => {
        const response = await request.delete('/albums/1');
        
        await test.step('Verify album was deleted successfully', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get album by invalid ID returns 404', async ({ request }) => {
      await test.step('Send GET request with invalid album ID', async () => {
        const response = await request.get('/albums/999999');
        
        await test.step('Verify 404 Not Found response', async () => {
          await ApiAssertions.assertNotFound(response);
        });
      });
    });

    test('Create album with missing required fields', async ({ request }) => {
      await test.step('Prepare incomplete album data (missing title)', async () => {
        const incompleteAlbumData = {
          userId: 1
          // Missing title field
        };

        await test.step('Send POST request with incomplete data', async () => {
          const response = await request.post('/albums', {
            data: incompleteAlbumData
          });
          
          await test.step('Verify response (JSONPlaceholder accepts incomplete data)', async () => {
            // JSONPlaceholder doesn't validate required fields strictly
            expect([200, 201, 400]).toContain(response.status());
          });
        });
      });
    });

    test('Update non-existent album returns 500', async ({ request }) => {
      await test.step('Prepare update data for non-existent album', async () => {
        const updatedAlbumData: UpdateAlbumRequest = {
          id: 999999,
          userId: 1,
          title: 'Updated Album'
        };

        await test.step('Send PUT request to non-existent album', async () => {
          const response = await request.put('/albums/999999', {
            data: updatedAlbumData
          });
          
          await test.step('Verify 500 Server Error response', async () => {
            await ApiAssertions.assertServerError(response);
          });
        });
      });
    });

    test('Delete non-existent album returns 200', async ({ request }) => {
      await test.step('Send DELETE request to non-existent album', async () => {
        const response = await request.delete('/albums/999999');
        
        await test.step('Verify 200 response (JSONPlaceholder behavior)', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('Handle large payload successfully', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeTitle = TestDataGenerators.createLargePayload(1000);
        
        const largeAlbumData = TestDataGenerators.createTestAlbum({
          title: largeTitle
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/albums', {
            data: largeAlbumData
          });
          
          await test.step('Verify large payload was handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Album>(response, largeAlbumData);
          });
        });
      });
    });

    test('Handle boundary values', async ({ request }) => {
      await test.step('Test first album (boundary: ID=1)', async () => {
        const firstResponse = await request.get('/albums/1');
        await ApiAssertions.assertStatus(firstResponse, 200);
        
        const firstAlbum = await firstResponse.json();
        expect(firstAlbum.id).toBe(1);
      });
      
      await test.step('Test last album (boundary: ID=100)', async () => {
        const lastResponse = await request.get('/albums/100');
        await ApiAssertions.assertStatus(lastResponse, 200);
        
        const lastAlbum = await lastResponse.json();
        expect(lastAlbum.id).toBe(100);
      });
    });

    test('Handle special characters in payload', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialAlbumData = TestDataGenerators.createTestAlbum({
          title: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/albums', {
            data: specialAlbumData
          });
          
          await test.step('Verify special characters were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Album>(response, specialAlbumData);
          });
        });
      });
    });

    test('Handle empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldAlbumData = TestDataGenerators.createTestAlbum({
          title: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/albums', {
            data: emptyFieldAlbumData
          });
          
          await test.step('Verify empty fields were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Album>(response, emptyFieldAlbumData);
          });
        });
      });
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple albums with test data', async ({ request }) => {
      await test.step('Load external test data from JSON file', async () => {
        for (const albumData of albumsData) {
          await test.step(`Create album: "${albumData.title}"`, async () => {
            const response = await request.post('/albums', {
              data: albumData
            });
            
            await test.step('Verify album creation from external data', async () => {
              await ApiAssertions.assertCreatedResource<Album>(response, albumData);
            });
          });
        }
      });
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      await test.step('Send GET request to albums endpoint', async () => {
        const response = await request.get('/albums');
        
        await test.step('Verify response status', async () => {
          await ApiAssertions.assertStatus(response, 200);
        });
        
        await test.step('Verify response headers contain correct content type', async () => {
          await ApiAssertions.assertHeaders(response, {
            'content-type': 'application/json'
          });
        });
      });
    });

    test('Validate response schema', async ({ request }) => {
      await test.step('Send GET request to specific album', async () => {
        const response = await request.get('/albums/1');
        
        await test.step('Verify basic response validation', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify album-specific schema validation', async () => {
          await ApiAssertions.assertSchema<Album>(response, {
            id: 'number',
            userId: 'number',
            title: 'string'
          });
        });
      });
    });
  });

  test.describe('API Helper Methods', () => {
    test('Use API helper methods for CRUD operations', async ({ request }) => {
      await test.step('Initialize API helpers', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Test CREATE operation using helper', async () => {
          const createdAlbum = await apiHelpers.createAlbum(testAlbumData);
          expect(createdAlbum).toHaveProperty('id');
          expect(createdAlbum.userId).toBe(testAlbumData.userId);
          expect(createdAlbum.title).toBe(testAlbumData.title);
        });

        await test.step('Test READ operation using helper', async () => {
          // Get existing album using helper (since JSONPlaceholder doesn't persist created albums)
          const retrievedAlbum = await apiHelpers.getAlbumById(1);
          expect(retrievedAlbum.id).toBe(1);
        });

        await test.step('Test UPDATE operation using helper', async () => {
          const updatedAlbumData: UpdateAlbumRequest = {
            id: 1,
            userId: 1,
            title: 'Updated via Helper'
          };
          const updatedAlbum = await apiHelpers.updateAlbum(1, updatedAlbumData);
          expect(updatedAlbum.title).toBe('Updated via Helper');
        });

        await test.step('Test DELETE operation using helper', async () => {
          await apiHelpers.deleteAlbum(1);
        });
      });
    });

    test('Use API helper for filtered queries', async ({ request }) => {
      await test.step('Initialize API helpers and test filtered queries', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Get albums filtered by user ID', async () => {
          const albumsByUser = await apiHelpers.getAlbumsByUserId(1);
          expect(Array.isArray(albumsByUser)).toBe(true);
          
          await test.step('Verify all albums belong to specified user', async () => {
            for (const album of albumsByUser) {
              expect(album.userId).toBe(1);
            }
          });
        });
      });
    });
  });
});
