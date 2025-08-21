import { test, expect } from '../utils/test-fixtures';
import { ApiAssertions } from '../utils/assertions';
import { ApiHelpers, TestDataGenerators } from '../utils/api-helpers';
import { Post, CreatePostRequest, UpdatePostRequest } from '../types/api-types';
import postsData from '../test-data/posts.json';

test.describe('Posts API Tests', () => {

  test.describe('GET Operations', () => {
    test('TC001: Get all posts successfully', async ({ request }) => {
      await test.step('Send GET request to /posts endpoint', async () => {
        const response = await request.get('/posts');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid array with base resource fields', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertBaseResourceArray(response);
        });
        
        await test.step('Verify post schema matches expected structure', async () => {
          await ApiAssertions.assertSchema<Post>(response, {
            id: 'number',
            title: 'string',
            body: 'string',
            userId: 'number'
          });
        });
      });
    });

    test('TC002: Get post by valid ID successfully', async ({ request }) => {
      await test.step('Send GET request to /posts/1 endpoint', async () => {
        const response = await request.get('/posts/1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid object with base resource fields', async () => {
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify specific post data', async () => {
          const post = await response.json();
          expect(post.id).toBe(1);
          expect(post).toHaveProperty('title');
          expect(post).toHaveProperty('body');
          expect(post).toHaveProperty('userId');
        });
      });
    });

    test('Get posts by user ID', async ({ request }) => {
      await test.step('Send GET request to /posts?userId=1 endpoint', async () => {
        const response = await request.get('/posts?userId=1');
        
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
    test('TC003: Create new post successfully', async ({ request, testPostData }) => {
      await test.step('Send POST request to create new post', async () => {
        const response = await request.post('/posts', {
          data: testPostData
        });
        
        await test.step('Verify post was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Post>(response, testPostData);
        });
      });
    });

    test('Create post with large payload', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largePostData = TestDataGenerators.createTestPost({
          title: TestDataGenerators.createLargePayload(1000),
          body: TestDataGenerators.createLargePayload(5000)
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/posts', {
            data: largePostData
          });
          
          await test.step('Verify large payload post was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Post>(response, largePostData);
          });
        });
      });
    });

    test('Create post with special characters', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialPostData = TestDataGenerators.createTestPost({
          title: TestDataGenerators.createSpecialCharacters(),
          body: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/posts', {
            data: specialPostData
          });
          
          await test.step('Verify special characters post was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Post>(response, specialPostData);
          });
        });
      });
    });

    test('Create post with empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldPostData = TestDataGenerators.createTestPost({
          title: '',
          body: 'Body with empty title'
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/posts', {
            data: emptyFieldPostData
          });
          
          await test.step('Verify empty fields post was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Post>(response, emptyFieldPostData);
          });
        });
      });
    });
  });

  test.describe('PUT Operations', () => {
    test('TC004: Update post successfully', async ({ request }) => {
      await test.step('Prepare update data for existing post', async () => {
        const updatedPostData: UpdatePostRequest = {
          id: 1,
          title: 'Updated Post Title',
          body: 'Updated Post Body',
          userId: 1
        };

        await test.step('Send PUT request to update post', async () => {
          const response = await request.put('/posts/1', {
            data: updatedPostData
          });
          
          await test.step('Verify post was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Post>(response, updatedPostData);
          });
        });
      });
    });

    test('Update post with large payload', async ({ request }) => {
      await test.step('Prepare large payload update data', async () => {
        const largeUpdatedPostData: UpdatePostRequest = {
          id: 1,
          title: TestDataGenerators.createLargePayload(1000),
          body: TestDataGenerators.createLargePayload(5000),
          userId: 1
        };

        await test.step('Send PUT request with large payload', async () => {
          const response = await request.put('/posts/1', {
            data: largeUpdatedPostData
          });
          
          await test.step('Verify large payload post was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Post>(response, largeUpdatedPostData);
          });
        });
      });
    });
  });

  test.describe('DELETE Operations', () => {
    test('TC005: Delete post successfully', async ({ request }) => {
      await test.step('Send DELETE request to remove post', async () => {
        const response = await request.delete('/posts/1');
        
        await test.step('Verify post was deleted successfully', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Negative Scenarios', () => {
    test('TC006: Get post by invalid ID returns 404', async ({ request }) => {
      await test.step('Send GET request with invalid post ID', async () => {
        const response = await request.get('/posts/999999');
        
        await test.step('Verify 404 Not Found response', async () => {
          await ApiAssertions.assertNotFound(response);
        });
      });
    });

    test('TC007: Create post with missing required fields', async ({ request }) => {
      await test.step('Prepare incomplete post data (missing title)', async () => {
        const incompletePostData = {
          body: 'Test Post Body',
          userId: 1
          // Missing title field
        };

        await test.step('Send POST request with incomplete data', async () => {
          const response = await request.post('/posts', {
            data: incompletePostData
          });
          
          await test.step('Verify response (JSONPlaceholder accepts incomplete data)', async () => {
            // JSONPlaceholder doesn't validate required fields strictly
            expect([200, 201, 400]).toContain(response.status());
          });
        });
      });
    });

    test('TC008: Update non-existent post returns 500', async ({ request }) => {
      await test.step('Prepare update data for non-existent post', async () => {
        const updatedPostData: UpdatePostRequest = {
          id: 999999,
          title: 'Updated Post Title',
          body: 'Updated Post Body',
          userId: 1
        };

        await test.step('Send PUT request to non-existent post', async () => {
          const response = await request.put('/posts/999999', {
            data: updatedPostData
          });
          
          await test.step('Verify 500 Server Error response', async () => {
            await ApiAssertions.assertServerError(response);
          });
        });
      });
    });

    test('TC009: Delete non-existent post returns 200', async ({ request }) => {
      await test.step('Send DELETE request to non-existent post', async () => {
        const response = await request.delete('/posts/999999');
        
        await test.step('Verify 200 response (JSONPlaceholder behavior)', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });

    test('TC010: Invalid HTTP method returns 200', async ({ request }) => {
      await test.step('Send PATCH request (unsupported method)', async () => {
        const response = await request.patch('/posts/1', {
          data: { title: 'Patched Title' }
        });
        
        await test.step('Verify 200 response (JSONPlaceholder behavior)', async () => {
          // JSONPlaceholder doesn't support PATCH but returns 200 instead of 405
          await ApiAssertions.assertStatus(response, 200);
        });
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('TC011: Handle large payload successfully', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeTitle = TestDataGenerators.createLargePayload(1000);
        const largeBody = TestDataGenerators.createLargePayload(5000);
        
        const largePostData = TestDataGenerators.createTestPost({
          title: largeTitle,
          body: largeBody
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/posts', {
            data: largePostData
          });
          
          await test.step('Verify large payload was handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Post>(response, largePostData);
          });
        });
      });
    });

    test('TC012: Handle boundary values', async ({ request }) => {
      await test.step('Test first post (boundary: ID=1)', async () => {
        const firstResponse = await request.get('/posts/1');
        await ApiAssertions.assertStatus(firstResponse, 200);
        
        const firstPost = await firstResponse.json();
        expect(firstPost.id).toBe(1);
      });
      
      await test.step('Test last post (boundary: ID=100)', async () => {
        const lastResponse = await request.get('/posts/100');
        await ApiAssertions.assertStatus(lastResponse, 200);
        
        const lastPost = await lastResponse.json();
        expect(lastPost.id).toBe(100);
      });
    });

    test('TC013: Handle special characters in payload', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialPostData = TestDataGenerators.createTestPost({
          title: TestDataGenerators.createSpecialCharacters(),
          body: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/posts', {
            data: specialPostData
          });
          
          await test.step('Verify special characters were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Post>(response, specialPostData);
          });
        });
      });
    });

    test('TC014: Handle empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldPostData = TestDataGenerators.createTestPost({
          title: '',
          body: 'Body with empty title'
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/posts', {
            data: emptyFieldPostData
          });
          
          await test.step('Verify empty fields were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Post>(response, emptyFieldPostData);
          });
        });
      });
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('TC017: Create multiple posts with test data', async ({ request }) => {
      await test.step('Load external test data from JSON file', async () => {
        for (const postData of postsData) {
          await test.step(`Create post: "${postData.title}"`, async () => {
            const response = await request.post('/posts', {
              data: postData
            });
            
            await test.step('Verify post creation from external data', async () => {
              await ApiAssertions.assertCreatedResource<Post>(response, postData);
            });
          });
        }
      });
    });
  });

  test.describe('Response Validation', () => {
    test('TC019: Validate response headers', async ({ request }) => {
      await test.step('Send GET request to posts endpoint', async () => {
        const response = await request.get('/posts');
        
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

    test('TC020: Validate response schema', async ({ request }) => {
      await test.step('Send GET request to specific post', async () => {
        const response = await request.get('/posts/1');
        
        await test.step('Verify basic response validation', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify post-specific schema validation', async () => {
          await ApiAssertions.assertSchema<Post>(response, {
            id: 'number',
            title: 'string',
            body: 'string',
            userId: 'number'
          });
        });
      });
    });
  });

  test.describe('API Helper Methods', () => {
    test('Use API helper methods for CRUD operations', async ({ request, testPostData }) => {
      await test.step('Initialize API helpers', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Test CREATE operation using helper', async () => {
          const createdPost = await apiHelpers.createPost(testPostData);
          expect(createdPost).toHaveProperty('id');
          expect(createdPost.title).toBe(testPostData.title);
          expect(createdPost.body).toBe(testPostData.body);
          expect(createdPost.userId).toBe(testPostData.userId);
        });

        await test.step('Test READ operation using helper', async () => {
          // Get existing post using helper (since JSONPlaceholder doesn't persist created posts)
          const retrievedPost = await apiHelpers.getPostById(1);
          expect(retrievedPost.id).toBe(1);
        });

        await test.step('Test UPDATE operation using helper', async () => {
          const updatedPostData: UpdatePostRequest = {
            id: 1,
            title: 'Updated via Helper',
            body: 'Updated body via helper',
            userId: 1
          };
          const updatedPost = await apiHelpers.updatePost(1, updatedPostData);
          expect(updatedPost.title).toBe('Updated via Helper');
        });

        await test.step('Test DELETE operation using helper', async () => {
          await apiHelpers.deletePost(1);
        });
      });
    });

    test('Use API helper for filtered queries', async ({ request }) => {
      await test.step('Initialize API helpers and test filtered queries', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Get posts filtered by user ID', async () => {
          const postsByUser = await apiHelpers.getPostsByUserId(1);
          expect(Array.isArray(postsByUser)).toBe(true);
          
          await test.step('Verify all posts belong to specified user', async () => {
            for (const post of postsByUser) {
              expect(post.userId).toBe(1);
            }
          });
        });
      });
    });
  });
});
