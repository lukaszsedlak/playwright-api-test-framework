import { test, expect } from '../utils/test-fixtures';
import { ApiAssertions } from '../utils/assertions';
import { ApiHelpers, TestDataGenerators } from '../utils/api-helpers';
import { Photo, CreatePhotoRequest, UpdatePhotoRequest } from '../types/api-types';
import photosData from '../test-data/photos.json';

test.describe('Photos API Tests', () => {

  test.describe('GET Operations', () => {
    test('Get all photos successfully', async ({ request }) => {
      await test.step('Send GET request to /photos endpoint', async () => {
        const response = await request.get('/photos');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid array with base resource fields', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertBaseResourceArray(response);
        });
        
        await test.step('Verify photo schema matches expected structure', async () => {
          await ApiAssertions.assertSchema<Photo>(response, {
            id: 'number',
            albumId: 'number',
            title: 'string',
            url: 'string',
            thumbnailUrl: 'string'
          });
        });
      });
    });

    test('Get photo by valid ID successfully', async ({ request }) => {
      await test.step('Send GET request to /photos/1 endpoint', async () => {
        const response = await request.get('/photos/1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid object with base resource fields', async () => {
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify specific photo data', async () => {
          const photo = await response.json();
          expect(photo.id).toBe(1);
          expect(photo).toHaveProperty('albumId');
          expect(photo).toHaveProperty('title');
          expect(photo).toHaveProperty('url');
          expect(photo).toHaveProperty('thumbnailUrl');
        });
      });
    });

    test('Get photos by album ID', async ({ request }) => {
      await test.step('Send GET request to /photos?albumId=1 endpoint', async () => {
        const response = await request.get('/photos?albumId=1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is filtered array', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertArrayFilteredByField(response, 'albumId', 1);
        });
      });
    });
  });

  test.describe('POST Operations', () => {
    test('Create new photo successfully', async ({ request, testPhotoData }) => {
      await test.step('Send POST request to create new photo', async () => {
        const response = await request.post('/photos', {
          data: testPhotoData
        });
        
        await test.step('Verify photo was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Photo>(response, testPhotoData);
        });
      });
    });

    test('Create photo with large payload', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largePhotoData = TestDataGenerators.createTestPhoto({
          title: TestDataGenerators.createLargePayload(1000),
          url: 'https://via.placeholder.com/600/' + TestDataGenerators.createLargePayload(500)
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/photos', {
            data: largePhotoData
          });
          
          await test.step('Verify large payload photo was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, largePhotoData);
          });
        });
      });
    });

    test('Create photo with special characters', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialPhotoData = TestDataGenerators.createTestPhoto({
          title: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/photos', {
            data: specialPhotoData
          });
          
          await test.step('Verify special characters photo was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, specialPhotoData);
          });
        });
      });
    });

    test('Create photo with empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldPhotoData = TestDataGenerators.createTestPhoto({
          title: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/photos', {
            data: emptyFieldPhotoData
          });
          
          await test.step('Verify empty fields photo was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, emptyFieldPhotoData);
          });
        });
      });
    });

    test('Create photo with invalid URL formats', async ({ request }) => {
      await test.step('Prepare invalid URL test data', async () => {
        const invalidUrlPhotoData = TestDataGenerators.createTestPhoto({
          url: 'not-a-valid-url',
          thumbnailUrl: 'also-not-valid'
        });

        await test.step('Send POST request with invalid URLs', async () => {
          const response = await request.post('/photos', {
            data: invalidUrlPhotoData
          });
          
          await test.step('Verify invalid URLs were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, invalidUrlPhotoData);
          });
        });
      });
    });
  });

  test.describe('PUT Operations', () => {
    test('Update photo successfully', async ({ request }) => {
      await test.step('Prepare update data for existing photo', async () => {
        const updatedPhotoData: UpdatePhotoRequest = {
          id: 1,
          albumId: 1,
          title: 'Updated Photo',
          url: 'https://via.placeholder.com/600/updated',
          thumbnailUrl: 'https://via.placeholder.com/150/updated'
        };

        await test.step('Send PUT request to update photo', async () => {
          const response = await request.put('/photos/1', {
            data: updatedPhotoData
          });
          
          await test.step('Verify photo was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Photo>(response, updatedPhotoData);
          });
        });
      });
    });

    test('Update photo with large payload', async ({ request }) => {
      await test.step('Prepare large payload update data', async () => {
        const largeUpdatedPhotoData: UpdatePhotoRequest = {
          id: 1,
          albumId: 1,
          title: TestDataGenerators.createLargePayload(1000),
          url: 'https://via.placeholder.com/600/' + TestDataGenerators.createLargePayload(500),
          thumbnailUrl: 'https://via.placeholder.com/150/updated'
        };

        await test.step('Send PUT request with large payload', async () => {
          const response = await request.put('/photos/1', {
            data: largeUpdatedPhotoData
          });
          
          await test.step('Verify large payload photo was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Photo>(response, largeUpdatedPhotoData);
          });
        });
      });
    });
  });

  test.describe('DELETE Operations', () => {
    test('Delete photo successfully', async ({ request }) => {
      await test.step('Send DELETE request to remove photo', async () => {
        const response = await request.delete('/photos/1');
        
        await test.step('Verify photo was deleted successfully', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get photo by invalid ID returns 404', async ({ request }) => {
      await test.step('Send GET request with invalid photo ID', async () => {
        const response = await request.get('/photos/999999');
        
        await test.step('Verify 404 Not Found response', async () => {
          await ApiAssertions.assertNotFound(response);
        });
      });
    });

    test('Create photo with missing required fields', async ({ request }) => {
      await test.step('Prepare incomplete photo data (missing url and thumbnailUrl)', async () => {
        const incompletePhotoData = {
          albumId: 1,
          title: 'Test Photo'
          // Missing url and thumbnailUrl fields
        };

        await test.step('Send POST request with incomplete data', async () => {
          const response = await request.post('/photos', {
            data: incompletePhotoData
          });
          
          await test.step('Verify response (JSONPlaceholder accepts incomplete data)', async () => {
            // JSONPlaceholder doesn't validate required fields strictly
            expect([200, 201, 400]).toContain(response.status());
          });
        });
      });
    });

    test('Update non-existent photo returns 500', async ({ request }) => {
      await test.step('Prepare update data for non-existent photo', async () => {
        const updatedPhotoData: UpdatePhotoRequest = {
          id: 999999,
          albumId: 1,
          title: 'Updated Photo',
          url: 'https://via.placeholder.com/600/updated',
          thumbnailUrl: 'https://via.placeholder.com/150/updated'
        };

        await test.step('Send PUT request to non-existent photo', async () => {
          const response = await request.put('/photos/999999', {
            data: updatedPhotoData
          });
          
          await test.step('Verify 500 Server Error response', async () => {
            await ApiAssertions.assertServerError(response);
          });
        });
      });
    });

    test('Delete non-existent photo returns 200', async ({ request }) => {
      await test.step('Send DELETE request to non-existent photo', async () => {
        const response = await request.delete('/photos/999999');
        
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
        const largeUrl = 'https://via.placeholder.com/600/' + TestDataGenerators.createLargePayload(500);
        
        const largePhotoData = TestDataGenerators.createTestPhoto({
          title: largeTitle,
          url: largeUrl
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/photos', {
            data: largePhotoData
          });
          
          await test.step('Verify large payload was handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, largePhotoData);
          });
        });
      });
    });

    test('Handle boundary values', async ({ request }) => {
      await test.step('Test first photo (boundary: ID=1)', async () => {
        const firstResponse = await request.get('/photos/1');
        await ApiAssertions.assertStatus(firstResponse, 200);
        
        const firstPhoto = await firstResponse.json();
        expect(firstPhoto.id).toBe(1);
      });
      
      await test.step('Test last photo (boundary: ID=5000)', async () => {
        const lastResponse = await request.get('/photos/5000');
        await ApiAssertions.assertStatus(lastResponse, 200);
        
        const lastPhoto = await lastResponse.json();
        expect(lastPhoto.id).toBe(5000);
      });
    });

    test('Handle special characters in payload', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialPhotoData = TestDataGenerators.createTestPhoto({
          title: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/photos', {
            data: specialPhotoData
          });
          
          await test.step('Verify special characters were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, specialPhotoData);
          });
        });
      });
    });

    test('Handle empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldPhotoData = TestDataGenerators.createTestPhoto({
          title: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/photos', {
            data: emptyFieldPhotoData
          });
          
          await test.step('Verify empty fields were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, emptyFieldPhotoData);
          });
        });
      });
    });

    test('Handle invalid URL formats', async ({ request }) => {
      await test.step('Prepare invalid URL test data', async () => {
        const invalidUrlPhotoData = TestDataGenerators.createTestPhoto({
          url: 'not-a-valid-url',
          thumbnailUrl: 'also-not-valid'
        });

        await test.step('Send POST request with invalid URLs', async () => {
          const response = await request.post('/photos', {
            data: invalidUrlPhotoData
          });
          
          await test.step('Verify invalid URLs were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Photo>(response, invalidUrlPhotoData);
          });
        });
      });
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple photos with test data', async ({ request }) => {
      await test.step('Load external test data from JSON file', async () => {
        for (const photoData of photosData) {
          await test.step(`Create photo: "${photoData.title}"`, async () => {
            const response = await request.post('/photos', {
              data: photoData
            });
            
            await test.step('Verify photo creation from external data', async () => {
              await ApiAssertions.assertCreatedResource<Photo>(response, photoData);
            });
          });
        }
      });
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      await test.step('Send GET request to photos endpoint', async () => {
        const response = await request.get('/photos');
        
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
      await test.step('Send GET request to specific photo', async () => {
        const response = await request.get('/photos/1');
        
        await test.step('Verify basic response validation', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify photo-specific schema validation', async () => {
          await ApiAssertions.assertSchema<Photo>(response, {
            id: 'number',
            albumId: 'number',
            title: 'string',
            url: 'string',
            thumbnailUrl: 'string'
          });
        });
      });
    });
  });

  test.describe('API Helper Methods', () => {
    test('Use API helper methods for CRUD operations', async ({ request, testPhotoData }) => {
      await test.step('Initialize API helpers', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Test CREATE operation using helper', async () => {
          const createdPhoto = await apiHelpers.createPhoto(testPhotoData);
          expect(createdPhoto).toHaveProperty('id');
          expect(createdPhoto.albumId).toBe(testPhotoData.albumId);
          expect(createdPhoto.title).toBe(testPhotoData.title);
          expect(createdPhoto.url).toBe(testPhotoData.url);
          expect(createdPhoto.thumbnailUrl).toBe(testPhotoData.thumbnailUrl);
        });

        await test.step('Test READ operation using helper', async () => {
          // Get existing photo using helper (since JSONPlaceholder doesn't persist created photos)
          const retrievedPhoto = await apiHelpers.getPhotoById(1);
          expect(retrievedPhoto.id).toBe(1);
        });

        await test.step('Test UPDATE operation using helper', async () => {
          const updatedPhotoData: UpdatePhotoRequest = {
            id: 1,
            albumId: 1,
            title: 'Updated via Helper',
            url: 'https://via.placeholder.com/600/helper',
            thumbnailUrl: 'https://via.placeholder.com/150/helper'
          };
          const updatedPhoto = await apiHelpers.updatePhoto(1, updatedPhotoData);
          expect(updatedPhoto.title).toBe('Updated via Helper');
        });

        await test.step('Test DELETE operation using helper', async () => {
          await apiHelpers.deletePhoto(1);
        });
      });
    });

    test('Use API helper for filtered queries', async ({ request }) => {
      await test.step('Initialize API helpers and test filtered queries', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Get photos filtered by album ID', async () => {
          const photosByAlbum = await apiHelpers.getPhotosByAlbumId(1);
          expect(Array.isArray(photosByAlbum)).toBe(true);
          
          await test.step('Verify all photos belong to specified album', async () => {
            for (const photo of photosByAlbum) {
              expect(photo.albumId).toBe(1);
            }
          });
        });
      });
    });
  });
});
