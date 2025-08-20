import { test, expect } from '@playwright/test';
import { ApiAssertions } from '../utils/assertions';
import { ApiHelpers, TestDataGenerators } from '../utils/api-helpers';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../types/api-types';
import commentsData from '../test-data/comments.json';

test.describe('Comments API Tests', () => {
  let sampleComment: Comment;
  let testCommentData: CreateCommentRequest;

  test.beforeAll(async ({ request }) => {
    // Fetch a sample comment for reuse in tests
    const response = await request.get('/comments/1');
    sampleComment = await response.json();
    
    // Initialize test data
    testCommentData = TestDataGenerators.createTestComment();
  });

  test.beforeEach(async () => {
    // Reset test data for each test
    testCommentData = TestDataGenerators.createTestComment();
  });

  test.describe('GET Operations', () => {
    test('Get all comments successfully', async ({ request }) => {
      await test.step('Send GET request to /comments endpoint', async () => {
        const response = await request.get('/comments');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid array with base resource fields', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertBaseResourceArray(response);
        });
        
        await test.step('Verify comment schema matches expected structure', async () => {
          await ApiAssertions.assertSchema<Comment>(response, {
            id: 'number',
            postId: 'number',
            name: 'string',
            email: 'string',
            body: 'string'
          });
        });
      });
    });

    test('Get comment by valid ID successfully', async ({ request }) => {
      await test.step('Send GET request to /comments/1 endpoint', async () => {
        const response = await request.get('/comments/1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid object with base resource fields', async () => {
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify specific comment data', async () => {
          const comment = await response.json();
          expect(comment.id).toBe(1);
          expect(comment).toHaveProperty('postId');
          expect(comment).toHaveProperty('name');
          expect(comment).toHaveProperty('email');
          expect(comment).toHaveProperty('body');
        });
      });
    });

    test('Get comments by post ID', async ({ request }) => {
      await test.step('Send GET request to /comments?postId=1 endpoint', async () => {
        const response = await request.get('/comments?postId=1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is filtered array', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertArrayFilteredByField(response, 'postId', 1);
        });
      });
    });
  });

  test.describe('POST Operations', () => {
    test('Create new comment successfully', async ({ request }) => {
      await test.step('Send POST request to create new comment', async () => {
        const response = await request.post('/comments', {
          data: testCommentData
        });
        
        await test.step('Verify comment was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Comment>(response, testCommentData);
        });
      });
    });

    test('Create comment with large payload', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeCommentData = TestDataGenerators.createTestComment({
          name: TestDataGenerators.createLargePayload(1000),
          body: TestDataGenerators.createLargePayload(5000)
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/comments', {
            data: largeCommentData
          });
          
          await test.step('Verify large payload comment was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Comment>(response, largeCommentData);
          });
        });
      });
    });

    test('Create comment with special characters', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialCommentData = TestDataGenerators.createTestComment({
          name: TestDataGenerators.createSpecialCharacters(),
          body: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/comments', {
            data: specialCommentData
          });
          
          await test.step('Verify special characters comment was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Comment>(response, specialCommentData);
          });
        });
      });
    });

    test('Create comment with empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldCommentData = TestDataGenerators.createTestComment({
          name: '',
          body: 'Comment with empty name'
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/comments', {
            data: emptyFieldCommentData
          });
          
          await test.step('Verify empty fields comment was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Comment>(response, emptyFieldCommentData);
          });
        });
      });
    });
  });

  test.describe('PUT Operations', () => {
    test('Update comment successfully', async ({ request }) => {
      await test.step('Prepare update data for existing comment', async () => {
        const updatedCommentData: UpdateCommentRequest = {
          id: 1,
          postId: 1,
          name: 'Updated Comment',
          email: 'updated@example.com',
          body: 'This is an updated comment'
        };

        await test.step('Send PUT request to update comment', async () => {
          const response = await request.put('/comments/1', {
            data: updatedCommentData
          });
          
          await test.step('Verify comment was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Comment>(response, updatedCommentData);
          });
        });
      });
    });

    test('Update comment with large payload', async ({ request }) => {
      await test.step('Prepare large payload update data', async () => {
        const largeUpdatedCommentData: UpdateCommentRequest = {
          id: 1,
          postId: 1,
          name: TestDataGenerators.createLargePayload(1000),
          email: 'large@example.com',
          body: TestDataGenerators.createLargePayload(5000)
        };

        await test.step('Send PUT request with large payload', async () => {
          const response = await request.put('/comments/1', {
            data: largeUpdatedCommentData
          });
          
          await test.step('Verify large payload comment was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Comment>(response, largeUpdatedCommentData);
          });
        });
      });
    });
  });

  test.describe('DELETE Operations', () => {
    test('Delete comment successfully', async ({ request }) => {
      await test.step('Send DELETE request to remove comment', async () => {
        const response = await request.delete('/comments/1');
        
        await test.step('Verify comment was deleted successfully', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get comment by invalid ID returns 404', async ({ request }) => {
      await test.step('Send GET request with invalid comment ID', async () => {
        const response = await request.get('/comments/999999');
        
        await test.step('Verify 404 Not Found response', async () => {
          await ApiAssertions.assertNotFound(response);
        });
      });
    });

    test('Create comment with missing required fields', async ({ request }) => {
      await test.step('Prepare incomplete comment data (missing name and body)', async () => {
        const incompleteCommentData = {
          postId: 1,
          email: 'test@example.com'
          // Missing name and body fields
        };

        await test.step('Send POST request with incomplete data', async () => {
          const response = await request.post('/comments', {
            data: incompleteCommentData
          });
          
          await test.step('Verify response (JSONPlaceholder accepts incomplete data)', async () => {
            // JSONPlaceholder doesn't validate required fields strictly
            expect([200, 201, 400]).toContain(response.status());
          });
        });
      });
    });

    test('Update non-existent comment returns 500', async ({ request }) => {
      await test.step('Prepare update data for non-existent comment', async () => {
        const updatedCommentData: UpdateCommentRequest = {
          id: 999999,
          postId: 1,
          name: 'Updated Comment',
          email: 'updated@example.com',
          body: 'This is an updated comment'
        };

        await test.step('Send PUT request to non-existent comment', async () => {
          const response = await request.put('/comments/999999', {
            data: updatedCommentData
          });
          
          await test.step('Verify 500 Server Error response', async () => {
            await ApiAssertions.assertServerError(response);
          });
        });
      });
    });

    test('Delete non-existent comment returns 200', async ({ request }) => {
      await test.step('Send DELETE request to non-existent comment', async () => {
        const response = await request.delete('/comments/999999');
        
        await test.step('Verify 200 response (JSONPlaceholder behavior)', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('Handle large payload successfully', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeName = TestDataGenerators.createLargePayload(1000);
        const largeBody = TestDataGenerators.createLargePayload(5000);
        
        const largeCommentData = TestDataGenerators.createTestComment({
          name: largeName,
          body: largeBody
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/comments', {
            data: largeCommentData
          });
          
          await test.step('Verify large payload was handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Comment>(response, largeCommentData);
          });
        });
      });
    });

    test('Handle boundary values', async ({ request }) => {
      await test.step('Test first comment (boundary: ID=1)', async () => {
        const firstResponse = await request.get('/comments/1');
        await ApiAssertions.assertStatus(firstResponse, 200);
        
        const firstComment = await firstResponse.json();
        expect(firstComment.id).toBe(1);
      });
      
      await test.step('Test last comment (boundary: ID=500)', async () => {
        const lastResponse = await request.get('/comments/500');
        await ApiAssertions.assertStatus(lastResponse, 200);
        
        const lastComment = await lastResponse.json();
        expect(lastComment.id).toBe(500);
      });
    });

    test('Handle special characters in payload', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialCommentData = TestDataGenerators.createTestComment({
          name: TestDataGenerators.createSpecialCharacters(),
          body: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/comments', {
            data: specialCommentData
          });
          
          await test.step('Verify special characters were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Comment>(response, specialCommentData);
          });
        });
      });
    });

    test('Handle empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldCommentData = TestDataGenerators.createTestComment({
          name: '',
          body: 'Comment with empty name'
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/comments', {
            data: emptyFieldCommentData
          });
          
          await test.step('Verify empty fields were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Comment>(response, emptyFieldCommentData);
          });
        });
      });
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple comments with test data', async ({ request }) => {
      await test.step('Load external test data from JSON file', async () => {
        for (const commentData of commentsData) {
          await test.step(`Create comment: "${commentData.name}"`, async () => {
            const response = await request.post('/comments', {
              data: commentData
            });
            
            await test.step('Verify comment creation from external data', async () => {
              await ApiAssertions.assertCreatedResource<Comment>(response, commentData);
            });
          });
        }
      });
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      await test.step('Send GET request to comments endpoint', async () => {
        const response = await request.get('/comments');
        
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
      await test.step('Send GET request to specific comment', async () => {
        const response = await request.get('/comments/1');
        
        await test.step('Verify basic response validation', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify comment-specific schema validation', async () => {
          await ApiAssertions.assertSchema<Comment>(response, {
            id: 'number',
            postId: 'number',
            name: 'string',
            email: 'string',
            body: 'string'
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
          const createdComment = await apiHelpers.createComment(testCommentData);
          expect(createdComment).toHaveProperty('id');
          expect(createdComment.postId).toBe(testCommentData.postId);
          expect(createdComment.name).toBe(testCommentData.name);
          expect(createdComment.email).toBe(testCommentData.email);
          expect(createdComment.body).toBe(testCommentData.body);
        });

        await test.step('Test READ operation using helper', async () => {
          // Get existing comment using helper (since JSONPlaceholder doesn't persist created comments)
          const retrievedComment = await apiHelpers.getCommentById(1);
          expect(retrievedComment.id).toBe(1);
        });

        await test.step('Test UPDATE operation using helper', async () => {
          const updatedCommentData: UpdateCommentRequest = {
            id: 1,
            postId: 1,
            name: 'Updated via Helper',
            email: 'updated@example.com',
            body: 'Updated body via helper'
          };
          const updatedComment = await apiHelpers.updateComment(1, updatedCommentData);
          expect(updatedComment.name).toBe('Updated via Helper');
        });

        await test.step('Test DELETE operation using helper', async () => {
          await apiHelpers.deleteComment(1);
        });
      });
    });

    test('Use API helper for filtered queries', async ({ request }) => {
      await test.step('Initialize API helpers and test filtered queries', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Get comments filtered by post ID', async () => {
          const commentsByPost = await apiHelpers.getCommentsByPostId(1);
          expect(Array.isArray(commentsByPost)).toBe(true);
          
          await test.step('Verify all comments belong to specified post', async () => {
            for (const comment of commentsByPost) {
              expect(comment.postId).toBe(1);
            }
          });
        });
      });
    });
  });
});
