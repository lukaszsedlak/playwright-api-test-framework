import { test, expect } from '@playwright/test';
import postsData from '../test-data/posts.json';

test.describe('Posts API Tests', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  test.describe('Positive Scenarios', () => {
    test('TC001: Get all posts successfully', async ({ request }) => {
      const response = await request.get('/posts');
      
      expect(response.status()).toBe(200);
      const posts = await response.json();
      
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
      
      // Verify each post has required fields
      for (const post of posts) {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
        expect(post).toHaveProperty('userId');
        expect(typeof post.id).toBe('number');
        expect(typeof post.title).toBe('string');
        expect(typeof post.body).toBe('string');
        expect(typeof post.userId).toBe('number');
      }
    });

    test('TC002: Get post by valid ID successfully', async ({ request }) => {
      const response = await request.get('/posts/1');
      
      expect(response.status()).toBe(200);
      const post = await response.json();
      
      expect(post.id).toBe(1);
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
    });

    test('TC003: Create new post successfully', async ({ request }) => {
      const newPost = {
        title: 'Test Post Title',
        body: 'Test Post Body',
        userId: 1
      };

      const response = await request.post('/posts', {
        data: newPost
      });
      
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      
      expect(createdPost).toHaveProperty('id');
      expect(createdPost.title).toBe(newPost.title);
      expect(createdPost.body).toBe(newPost.body);
      expect(createdPost.userId).toBe(newPost.userId);
    });

    test('TC004: Update post successfully', async ({ request }) => {
      const updatedPost = {
        id: 1,
        title: 'Updated Post Title',
        body: 'Updated Post Body',
        userId: 1
      };

      const response = await request.put('/posts/1', {
        data: updatedPost
      });
      
      expect(response.status()).toBe(200);
      const post = await response.json();
      
      expect(post.id).toBe(updatedPost.id);
      expect(post.title).toBe(updatedPost.title);
      expect(post.body).toBe(updatedPost.body);
      expect(post.userId).toBe(updatedPost.userId);
    });

    test('TC005: Delete post successfully', async ({ request }) => {
      const response = await request.delete('/posts/1');
      
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Negative Scenarios', () => {
    test('TC006: Get post by invalid ID returns 404', async ({ request }) => {
      const response = await request.get('/posts/999999');
      
      expect(response.status()).toBe(404);
    });

    test('TC007: Create post with missing required fields', async ({ request }) => {
      const incompletePost = {
        body: 'Test Post Body',
        userId: 1
        // Missing title field
      };

      const response = await request.post('/posts', {
        data: incompletePost
      });
      
      // Note: JSONPlaceholder doesn't validate required fields, so this might return 201
      // In a real API, this would typically return 400
      expect([200, 201, 400]).toContain(response.status());
    });

    test('TC008: Update non-existent post returns 404', async ({ request }) => {
      const updatedPost = {
        id: 999999,
        title: 'Updated Post Title',
        body: 'Updated Post Body',
        userId: 1
      };

      const response = await request.put('/posts/999999', {
        data: updatedPost
      });
      
      expect(response.status()).toBe(404);
    });

    test('TC009: Delete non-existent post returns 404', async ({ request }) => {
      const response = await request.delete('/posts/999999');
      
      expect(response.status()).toBe(404);
    });

    test('TC010: Invalid HTTP method returns 405', async ({ request }) => {
      const response = await request.patch('/posts/1', {
        data: { title: 'Patched Title' }
      });
      
      expect(response.status()).toBe(405);
    });
  });

  test.describe('Edge Cases', () => {
    test('TC011: Handle large payload successfully', async ({ request }) => {
      const largeTitle = 'A'.repeat(1000);
      const largeBody = 'B'.repeat(5000);
      
      const largePost = {
        title: largeTitle,
        body: largeBody,
        userId: 1
      };

      const response = await request.post('/posts', {
        data: largePost
      });
      
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      
      expect(createdPost.title).toBe(largeTitle);
      expect(createdPost.body).toBe(largeBody);
    });

    test('TC012: Handle boundary values', async ({ request }) => {
      // Test first post
      const firstResponse = await request.get('/posts/1');
      expect(firstResponse.status()).toBe(200);
      
      // Test last post (assuming 100 posts exist)
      const lastResponse = await request.get('/posts/100');
      expect(lastResponse.status()).toBe(200);
      
      const firstPost = await firstResponse.json();
      const lastPost = await lastResponse.json();
      
      expect(firstPost.id).toBe(1);
      expect(lastPost.id).toBe(100);
    });

    test('TC013: Handle special characters in payload', async ({ request }) => {
      const specialPost = {
        title: 'Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
        body: 'Body with special chars: áéíóú ñ ç ß € £ ¥',
        userId: 1
      };

      const response = await request.post('/posts', {
        data: specialPost
      });
      
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      
      expect(createdPost.title).toBe(specialPost.title);
      expect(createdPost.body).toBe(specialPost.body);
    });

    test('TC014: Handle empty fields', async ({ request }) => {
      const emptyFieldPost = {
        title: '',
        body: 'Body with empty title',
        userId: 1
      };

      const response = await request.post('/posts', {
        data: emptyFieldPost
      });
      
      // JSONPlaceholder accepts empty fields
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      
      expect(createdPost.title).toBe('');
      expect(createdPost.body).toBe(emptyFieldPost.body);
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('TC017: Create multiple posts with test data', async ({ request }) => {
      for (const postData of postsData) {
        const response = await request.post('/posts', {
          data: postData
        });
        
        expect(response.status()).toBe(201);
        const createdPost = await response.json();
        
        expect(createdPost).toHaveProperty('id');
        expect(createdPost.title).toBe(postData.title);
        expect(createdPost.body).toBe(postData.body);
        expect(createdPost.userId).toBe(postData.userId);
      }
    });
  });

  test.describe('Response Validation', () => {
    test('TC019: Validate response headers', async ({ request }) => {
      const response = await request.get('/posts');
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('TC020: Validate response schema', async ({ request }) => {
      const response = await request.get('/posts/1');
      
      expect(response.status()).toBe(200);
      const post = await response.json();
      
      // Verify required fields exist
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
      
      // Verify field types
      expect(typeof post.id).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
      expect(typeof post.userId).toBe('number');
      
      // Verify field values are not null/undefined
      expect(post.id).not.toBeNull();
      expect(post.title).not.toBeNull();
      expect(post.body).not.toBeNull();
      expect(post.userId).not.toBeNull();
    });
  });
});
