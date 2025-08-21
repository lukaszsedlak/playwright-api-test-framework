import { test, expect } from '../utils/test-fixtures';
import { ApiAssertions } from '../utils/assertions';
import { ApiHelpers, TestDataGenerators } from '../utils/api-helpers';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/api-types';
import usersData from '../test-data/users.json';

test.describe('Users API Tests', () => {

  test.describe('GET Operations', () => {
    test('TC015: Get all users successfully', async ({ request }) => {
      await test.step('Send GET request to /users endpoint', async () => {
        const response = await request.get('/users');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid array with base resource fields', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertBaseResourceArray(response);
        });
        
        await test.step('Verify user schema matches expected structure', async () => {
          await ApiAssertions.assertSchema<User>(response, {
            id: 'number',
            name: 'string',
            username: 'string',
            email: 'string',
            phone: 'string',
            website: 'string'
          });
        });
      });
    });

    test('TC016: Get user by ID successfully', async ({ request }) => {
      await test.step('Send GET request to /users/1 endpoint', async () => {
        const response = await request.get('/users/1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid object with base resource fields', async () => {
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify specific user data', async () => {
          const user = await response.json();
          expect(user.id).toBe(1);
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('phone');
          expect(user).toHaveProperty('website');
        });
      });
    });
  });

  test.describe('POST Operations', () => {
    test('Create new user successfully', async ({ request, testUserData }) => {
      await test.step('Send POST request to create new user', async () => {
        const response = await request.post('/users', {
          data: testUserData
        });
        
        await test.step('Verify user was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<User>(response, testUserData);
        });
      });
    });

    test('Create user with large payload', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeUserData = TestDataGenerators.createTestUser({
          name: TestDataGenerators.createLargePayload(1000),
          email: TestDataGenerators.createLargePayload(500) + '@example.com'
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/users', {
            data: largeUserData
          });
          
          await test.step('Verify large payload user was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<User>(response, largeUserData);
          });
        });
      });
    });

    test('Create user with special characters', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialUserData = TestDataGenerators.createTestUser({
          name: TestDataGenerators.createSpecialCharacters(),
          username: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/users', {
            data: specialUserData
          });
          
          await test.step('Verify special characters user was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<User>(response, specialUserData);
          });
        });
      });
    });

    test('Create user with empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldUserData = TestDataGenerators.createTestUser({
          name: '',
          website: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/users', {
            data: emptyFieldUserData
          });
          
          await test.step('Verify empty fields user was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<User>(response, emptyFieldUserData);
          });
        });
      });
    });
  });

  test.describe('PUT Operations', () => {
    test('Update user successfully', async ({ request }) => {
      await test.step('Prepare update data for existing user', async () => {
        const updatedUserData: UpdateUserRequest = {
          id: 1,
          name: 'Updated John Doe',
          username: 'updatedjohndoe',
          email: 'updated.john.doe@example.com',
          phone: '1-770-736-8031 x56442',
          website: 'updated-hildegard.org'
        };

        await test.step('Send PUT request to update user', async () => {
          const response = await request.put('/users/1', {
            data: updatedUserData
          });
          
          await test.step('Verify user was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<User>(response, updatedUserData);
          });
        });
      });
    });

    test('Update user with large payload', async ({ request }) => {
      await test.step('Prepare large payload update data', async () => {
        const largeUpdatedUserData: UpdateUserRequest = {
          id: 1,
          name: TestDataGenerators.createLargePayload(1000),
          username: 'largeuser',
          email: TestDataGenerators.createLargePayload(500) + '@example.com',
          phone: '1-770-736-8031 x56442',
          website: 'large-website.org'
        };

        await test.step('Send PUT request with large payload', async () => {
          const response = await request.put('/users/1', {
            data: largeUpdatedUserData
          });
          
          await test.step('Verify large payload user was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<User>(response, largeUpdatedUserData);
          });
        });
      });
    });
  });

  test.describe('DELETE Operations', () => {
    test('Delete user successfully', async ({ request }) => {
      await test.step('Send DELETE request to remove user', async () => {
        const response = await request.delete('/users/1');
        
        await test.step('Verify user was deleted successfully', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get user by invalid ID returns 404', async ({ request }) => {
      await test.step('Send GET request with invalid user ID', async () => {
        const response = await request.get('/users/999999');
        
        await test.step('Verify 404 Not Found response', async () => {
          await ApiAssertions.assertNotFound(response);
        });
      });
    });

    test('Update non-existent user returns 500', async ({ request }) => {
      await test.step('Prepare update data for non-existent user', async () => {
        const updatedUserData: UpdateUserRequest = {
          id: 999999,
          name: 'Non-existent User',
          username: 'nonexistent',
          email: 'nonexistent@example.com',
          phone: '1-770-736-8031 x56442',
          website: 'nonexistent.org'
        };

        await test.step('Send PUT request to non-existent user', async () => {
          const response = await request.put('/users/999999', {
            data: updatedUserData
          });
          
          await test.step('Verify 500 Server Error response', async () => {
            await ApiAssertions.assertServerError(response);
          });
        });
      });
    });

    test('Delete non-existent user returns 200', async ({ request }) => {
      await test.step('Send DELETE request to non-existent user', async () => {
        const response = await request.delete('/users/999999');
        
        await test.step('Verify 200 response (JSONPlaceholder behavior)', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('TC018: Create multiple users with test data', async ({ request }) => {
      await test.step('Load external test data from JSON file', async () => {
        for (const userData of usersData) {
          await test.step(`Create user: "${userData.name}"`, async () => {
            const response = await request.post('/users', {
              data: userData
            });
            
            await test.step('Verify user creation from external data', async () => {
              await ApiAssertions.assertCreatedResource<User>(response, userData);
            });
          });
        }
      });
    });
  });

  test.describe('Response Validation', () => {
    test('Validate user response headers', async ({ request }) => {
      await test.step('Send GET request to users endpoint', async () => {
        const response = await request.get('/users');
        
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

    test('Validate user response schema', async ({ request }) => {
      await test.step('Send GET request to specific user', async () => {
        const response = await request.get('/users/1');
        
        await test.step('Verify basic response validation', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify user-specific schema validation', async () => {
          await ApiAssertions.assertSchema<User>(response, {
            id: 'number',
            name: 'string',
            username: 'string',
            email: 'string',
            phone: 'string',
            website: 'string'
          });
        });
      });
    });
  });

  test.describe('API Helper Methods', () => {
    test('Use API helper methods for CRUD operations', async ({ request, testUserData }) => {
      await test.step('Initialize API helpers', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Test CREATE operation using helper', async () => {
          const createdUser = await apiHelpers.createUser(testUserData);
          expect(createdUser).toHaveProperty('id');
          expect(createdUser.name).toBe(testUserData.name);
          expect(createdUser.username).toBe(testUserData.username);
          expect(createdUser.email).toBe(testUserData.email);
          expect(createdUser.phone).toBe(testUserData.phone);
          expect(createdUser.website).toBe(testUserData.website);
        });

        await test.step('Test READ operation using helper', async () => {
          // Get existing user using helper (since JSONPlaceholder doesn't persist created users)
          const retrievedUser = await apiHelpers.getUserById(1);
          expect(retrievedUser.id).toBe(1);
        });

        await test.step('Test UPDATE operation using helper', async () => {
          const updatedUserData: UpdateUserRequest = {
            id: 1,
            name: 'Updated via Helper',
            username: 'updatedhelper',
            email: 'updated@example.com',
            phone: '1-770-736-8031 x56442',
            website: 'helper.org'
          };
          const updatedUser = await apiHelpers.updateUser(1, updatedUserData);
          expect(updatedUser.name).toBe('Updated via Helper');
        });

        await test.step('Test DELETE operation using helper', async () => {
          await apiHelpers.deleteUser(1);
        });
      });
    });
  });
});
