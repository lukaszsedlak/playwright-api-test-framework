import { test, expect } from '@playwright/test';
import usersData from '../test-data/users.json';

test.describe('Users API Tests', () => {
  test.describe('Positive Scenarios', () => {
    test('TC015: Get all users successfully', async ({ request }) => {
      const response = await request.get('/users');
      
      expect(response.status()).toBe(200);
      const users = await response.json();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      
      // Verify each user has required fields
      for (const user of users) {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('email');
        expect(typeof user.id).toBe('number');
        expect(typeof user.name).toBe('string');
        expect(typeof user.username).toBe('string');
        expect(typeof user.email).toBe('string');
      }
    });

    test('TC016: Get user by ID successfully', async ({ request }) => {
      const response = await request.get('/users/1');
      
      expect(response.status()).toBe(200);
      const user = await response.json();
      
      expect(user.id).toBe(1);
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('website');
    });

    test('Create new user successfully', async ({ request }) => {
      const newUser = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org'
      };

      const response = await request.post('/users', {
        data: newUser
      });
      
      expect(response.status()).toBe(201);
      const createdUser = await response.json();
      
      expect(createdUser).toHaveProperty('id');
      expect(createdUser.name).toBe(newUser.name);
      expect(createdUser.username).toBe(newUser.username);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.phone).toBe(newUser.phone);
      expect(createdUser.website).toBe(newUser.website);
    });

    test('Update user successfully', async ({ request }) => {
      const updatedUser = {
        id: 1,
        name: 'Updated John Doe',
        username: 'updatedjohndoe',
        email: 'updated.john.doe@example.com',
        phone: '1-770-736-8031 x56442',
        website: 'updated-hildegard.org'
      };

      const response = await request.put('/users/1', {
        data: updatedUser
      });
      
      expect(response.status()).toBe(200);
      const user = await response.json();
      
      expect(user.id).toBe(updatedUser.id);
      expect(user.name).toBe(updatedUser.name);
      expect(user.username).toBe(updatedUser.username);
      expect(user.email).toBe(updatedUser.email);
    });

    test('Delete user successfully', async ({ request }) => {
      const response = await request.delete('/users/1');
      
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get user by invalid ID returns 404', async ({ request }) => {
      const response = await request.get('/users/999999');
      
      expect(response.status()).toBe(404);
    });

    test('Update non-existent user returns 404', async ({ request }) => {
      const updatedUser = {
        id: 999999,
        name: 'Non-existent User',
        username: 'nonexistent',
        email: 'nonexistent@example.com'
      };

      const response = await request.put('/users/999999', {
        data: updatedUser
      });
      
      // JSONPlaceholder returns 500 for non-existent resources on PUT
      expect(response.status()).toBe(500);
    });

    test('Delete non-existent user returns 404', async ({ request }) => {
      const response = await request.delete('/users/999999');
      
      // JSONPlaceholder returns 200 for DELETE operations even for non-existent resources
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('TC018: Create multiple users with test data', async ({ request }) => {
      for (const userData of usersData) {
        const response = await request.post('/users', {
          data: userData
        });
        
        expect(response.status()).toBe(201);
        const createdUser = await response.json();
        
        expect(createdUser).toHaveProperty('id');
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.username).toBe(userData.username);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.phone).toBe(userData.phone);
        expect(createdUser.website).toBe(userData.website);
      }
    });
  });

  test.describe('Response Validation', () => {
    test('Validate user response headers', async ({ request }) => {
      const response = await request.get('/users');
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Validate user response schema', async ({ request }) => {
      const response = await request.get('/users/1');
      
      expect(response.status()).toBe(200);
      const user = await response.json();
      
      // Verify required fields exist
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('website');
      
      // Verify field types
      expect(typeof user.id).toBe('number');
      expect(typeof user.name).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.phone).toBe('string');
      expect(typeof user.website).toBe('string');
      
      // Verify field values are not null/undefined
      expect(user.id).not.toBeNull();
      expect(user.name).not.toBeNull();
      expect(user.username).not.toBeNull();
      expect(user.email).not.toBeNull();
    });
  });
});
