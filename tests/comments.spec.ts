import { test, expect } from '@playwright/test';
import commentsData from '../test-data/comments.json';

test.describe('Comments API Tests', () => {
  test.describe('Positive Scenarios', () => {
    test('Get all comments successfully', async ({ request }) => {
      const response = await request.get('/comments');
      
      expect(response.status()).toBe(200);
      const comments = await response.json();
      
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBeGreaterThan(0);
      
      // Verify each comment has required fields
      for (const comment of comments) {
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('postId');
        expect(comment).toHaveProperty('name');
        expect(comment).toHaveProperty('email');
        expect(comment).toHaveProperty('body');
        expect(typeof comment.id).toBe('number');
        expect(typeof comment.postId).toBe('number');
        expect(typeof comment.name).toBe('string');
        expect(typeof comment.email).toBe('string');
        expect(typeof comment.body).toBe('string');
      }
    });

    test('Get comment by valid ID successfully', async ({ request }) => {
      const response = await request.get('/comments/1');
      
      expect(response.status()).toBe(200);
      const comment = await response.json();
      
      expect(comment.id).toBe(1);
      expect(comment).toHaveProperty('postId');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
    });

    test('Create new comment successfully', async ({ request }) => {
      const newComment = {
        postId: 1,
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'This is a test comment'
      };

      const response = await request.post('/comments', {
        data: newComment
      });
      
      expect(response.status()).toBe(201);
      const createdComment = await response.json();
      
      expect(createdComment).toHaveProperty('id');
      expect(createdComment.postId).toBe(newComment.postId);
      expect(createdComment.name).toBe(newComment.name);
      expect(createdComment.email).toBe(newComment.email);
      expect(createdComment.body).toBe(newComment.body);
    });

    test('Update comment successfully', async ({ request }) => {
      const updatedComment = {
        id: 1,
        postId: 1,
        name: 'Updated Comment',
        email: 'updated@example.com',
        body: 'This is an updated comment'
      };

      const response = await request.put('/comments/1', {
        data: updatedComment
      });
      
      expect(response.status()).toBe(200);
      const comment = await response.json();
      
      expect(comment.id).toBe(updatedComment.id);
      expect(comment.postId).toBe(updatedComment.postId);
      expect(comment.name).toBe(updatedComment.name);
      expect(comment.email).toBe(updatedComment.email);
      expect(comment.body).toBe(updatedComment.body);
    });

    test('Delete comment successfully', async ({ request }) => {
      const response = await request.delete('/comments/1');
      
      expect(response.status()).toBe(200);
    });

    test('Get comments by post ID', async ({ request }) => {
      const response = await request.get('/comments?postId=1');
      
      expect(response.status()).toBe(200);
      const comments = await response.json();
      
      expect(Array.isArray(comments)).toBe(true);
      for (const comment of comments) {
        expect(comment.postId).toBe(1);
      }
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get comment by invalid ID returns 404', async ({ request }) => {
      const response = await request.get('/comments/999999');
      
      expect(response.status()).toBe(404);
    });

    test('Create comment with missing required fields', async ({ request }) => {
      const incompleteComment = {
        postId: 1,
        email: 'test@example.com'
        // Missing name and body fields
      };

      const response = await request.post('/comments', {
        data: incompleteComment
      });
      
      // JSONPlaceholder doesn't validate required fields strictly
      expect([200, 201, 400]).toContain(response.status());
    });

    test('Update non-existent comment returns 500', async ({ request }) => {
      const updatedComment = {
        id: 999999,
        postId: 1,
        name: 'Updated Comment',
        email: 'updated@example.com',
        body: 'This is an updated comment'
      };

      const response = await request.put('/comments/999999', {
        data: updatedComment
      });
      
      // JSONPlaceholder returns 500 for non-existent resources on PUT
      expect(response.status()).toBe(500);
    });

    test('Delete non-existent comment returns 200', async ({ request }) => {
      const response = await request.delete('/comments/999999');
      
      // JSONPlaceholder returns 200 for DELETE operations even for non-existent resources
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Edge Cases', () => {
    test('Handle large payload successfully', async ({ request }) => {
      const largeName = 'A'.repeat(1000);
      const largeBody = 'B'.repeat(5000);
      
      const largeComment = {
        postId: 1,
        name: largeName,
        email: 'large@example.com',
        body: largeBody
      };

      const response = await request.post('/comments', {
        data: largeComment
      });
      
      expect(response.status()).toBe(201);
      const createdComment = await response.json();
      
      expect(createdComment.name).toBe(largeName);
      expect(createdComment.body).toBe(largeBody);
    });

    test('Handle boundary values', async ({ request }) => {
      // Test first comment
      const firstResponse = await request.get('/comments/1');
      expect(firstResponse.status()).toBe(200);
      
      // Test last comment (assuming 500 comments exist)
      const lastResponse = await request.get('/comments/500');
      expect(lastResponse.status()).toBe(200);
      
      const firstComment = await firstResponse.json();
      const lastComment = await lastResponse.json();
      
      expect(firstComment.id).toBe(1);
      expect(lastComment.id).toBe(500);
    });

    test('Handle special characters in payload', async ({ request }) => {
      const specialComment = {
        postId: 1,
        name: 'Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
        email: 'special@example.com',
        body: 'Body with special chars: áéíóú ñ ç ß € £ ¥'
      };

      const response = await request.post('/comments', {
        data: specialComment
      });
      
      expect(response.status()).toBe(201);
      const createdComment = await response.json();
      
      expect(createdComment.name).toBe(specialComment.name);
      expect(createdComment.body).toBe(specialComment.body);
    });

    test('Handle empty fields', async ({ request }) => {
      const emptyFieldComment = {
        postId: 1,
        name: '',
        email: 'empty@example.com',
        body: 'Comment with empty name'
      };

      const response = await request.post('/comments', {
        data: emptyFieldComment
      });
      
      // JSONPlaceholder accepts empty fields
      expect(response.status()).toBe(201);
      const createdComment = await response.json();
      
      expect(createdComment.name).toBe('');
      expect(createdComment.body).toBe(emptyFieldComment.body);
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple comments with test data', async ({ request }) => {
      for (const commentData of commentsData) {
        const response = await request.post('/comments', {
          data: commentData
        });
        
        expect(response.status()).toBe(201);
        const createdComment = await response.json();
        
        expect(createdComment).toHaveProperty('id');
        expect(createdComment.postId).toBe(commentData.postId);
        expect(createdComment.name).toBe(commentData.name);
        expect(createdComment.email).toBe(commentData.email);
        expect(createdComment.body).toBe(commentData.body);
      }
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      const response = await request.get('/comments');
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Validate response schema', async ({ request }) => {
      const response = await request.get('/comments/1');
      
      expect(response.status()).toBe(200);
      const comment = await response.json();
      
      // Verify required fields exist
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('postId');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
      
      // Verify field types
      expect(typeof comment.id).toBe('number');
      expect(typeof comment.postId).toBe('number');
      expect(typeof comment.name).toBe('string');
      expect(typeof comment.email).toBe('string');
      expect(typeof comment.body).toBe('string');
      
      // Verify field values are not null/undefined
      expect(comment.id).not.toBeNull();
      expect(comment.postId).not.toBeNull();
      expect(comment.name).not.toBeNull();
      expect(comment.email).not.toBeNull();
      expect(comment.body).not.toBeNull();
    });
  });
});
