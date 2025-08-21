import { test, expect } from '../utils/test-fixtures';
import { ApiAssertions } from '../utils/assertions';
import { ApiHelpers, TestDataGenerators } from '../utils/api-helpers';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/api-types';
import todosData from '../test-data/todos.json';

test.describe('Todos API Tests', () => {

  test.describe('GET Operations', () => {
    test('Get all todos successfully', async ({ request }) => {
      await test.step('Send GET request to /todos endpoint', async () => {
        const response = await request.get('/todos');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid array with base resource fields', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertBaseResourceArray(response);
        });
        
        await test.step('Verify todo schema matches expected structure', async () => {
          await ApiAssertions.assertSchema<Todo>(response, {
            id: 'number',
            userId: 'number',
            title: 'string',
            completed: 'boolean'
          });
        });
      });
    });

    test('Get todo by valid ID successfully', async ({ request }) => {
      await test.step('Send GET request to /todos/1 endpoint', async () => {
        const response = await request.get('/todos/1');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is a valid object with base resource fields', async () => {
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify specific todo data', async () => {
          const todo = await response.json();
          expect(todo.id).toBe(1);
          expect(todo).toHaveProperty('userId');
          expect(todo).toHaveProperty('title');
          expect(todo).toHaveProperty('completed');
        });
      });
    });

    test('Get todos by user ID', async ({ request }) => {
      await test.step('Send GET request to /todos?userId=1 endpoint', async () => {
        const response = await request.get('/todos?userId=1');
        
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

    test('Get completed todos', async ({ request }) => {
      await test.step('Send GET request to /todos?completed=true endpoint', async () => {
        const response = await request.get('/todos?completed=true');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is filtered array', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertArrayFilteredByField(response, 'completed', true);
        });
      });
    });

    test('Get incomplete todos', async ({ request }) => {
      await test.step('Send GET request to /todos?completed=false endpoint', async () => {
        const response = await request.get('/todos?completed=false');
        
        await test.step('Verify response status and content type', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonContentType(response);
        });
        
        await test.step('Verify response is filtered array', async () => {
          await ApiAssertions.assertJsonArray(response);
          await ApiAssertions.assertArrayFilteredByField(response, 'completed', false);
        });
      });
    });
  });

  test.describe('POST Operations', () => {
    test('Create new todo successfully', async ({ request, testTodoData }) => {
      await test.step('Send POST request to create new todo', async () => {
        const response = await request.post('/todos', {
          data: testTodoData
        });
        
        await test.step('Verify todo was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Todo>(response, testTodoData);
        });
      });
    });

    test('Create todo with large payload', async ({ request }) => {
      await test.step('Prepare large payload test data', async () => {
        const largeTodoData = TestDataGenerators.createTestTodo({
          title: TestDataGenerators.createLargePayload(1000)
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/todos', {
            data: largeTodoData
          });
          
          await test.step('Verify large payload todo was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Todo>(response, largeTodoData);
          });
        });
      });
    });

    test('Create todo with special characters', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialTodoData = TestDataGenerators.createTestTodo({
          title: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/todos', {
            data: specialTodoData
          });
          
          await test.step('Verify special characters todo was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Todo>(response, specialTodoData);
          });
        });
      });
    });

    test('Create todo with empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldTodoData = TestDataGenerators.createTestTodo({
          title: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/todos', {
            data: emptyFieldTodoData
          });
          
          await test.step('Verify empty fields todo was created successfully', async () => {
            await ApiAssertions.assertCreatedResource<Todo>(response, emptyFieldTodoData);
          });
        });
      });
    });

    test('Create todo with boolean edge cases', async ({ request }) => {
      await test.step('Test with completed: true', async () => {
        const completedTodoData = TestDataGenerators.createTestTodo({
          completed: true
        });

        const completedResponse = await request.post('/todos', {
          data: completedTodoData
        });
        
        await test.step('Verify completed todo was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Todo>(completedResponse, completedTodoData);
        });
      });

      await test.step('Test with completed: false', async () => {
        const incompleteTodoData = TestDataGenerators.createTestTodo({
          completed: false
        });

        const incompleteResponse = await request.post('/todos', {
          data: incompleteTodoData
        });
        
        await test.step('Verify incomplete todo was created successfully', async () => {
          await ApiAssertions.assertCreatedResource<Todo>(incompleteResponse, incompleteTodoData);
        });
      });
    });
  });

  test.describe('PUT Operations', () => {
    test('Update todo successfully', async ({ request }) => {
      await test.step('Prepare update data for existing todo', async () => {
        const updatedTodoData: UpdateTodoRequest = {
          id: 1,
          userId: 1,
          title: 'Updated Todo',
          completed: true
        };

        await test.step('Send PUT request to update todo', async () => {
          const response = await request.put('/todos/1', {
            data: updatedTodoData
          });
          
          await test.step('Verify todo was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Todo>(response, updatedTodoData);
          });
        });
      });
    });

    test('Update todo with large payload', async ({ request }) => {
      await test.step('Prepare large payload update data', async () => {
        const largeUpdatedTodoData: UpdateTodoRequest = {
          id: 1,
          userId: 1,
          title: TestDataGenerators.createLargePayload(1000),
          completed: false
        };

        await test.step('Send PUT request with large payload', async () => {
          const response = await request.put('/todos/1', {
            data: largeUpdatedTodoData
          });
          
          await test.step('Verify large payload todo was updated successfully', async () => {
            await ApiAssertions.assertUpdatedResource<Todo>(response, largeUpdatedTodoData);
          });
        });
      });
    });
  });

  test.describe('DELETE Operations', () => {
    test('Delete todo successfully', async ({ request }) => {
      await test.step('Send DELETE request to remove todo', async () => {
        const response = await request.delete('/todos/1');
        
        await test.step('Verify todo was deleted successfully', async () => {
          await ApiAssertions.assertDeleted(response);
        });
      });
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get todo by invalid ID returns 404', async ({ request }) => {
      await test.step('Send GET request with invalid todo ID', async () => {
        const response = await request.get('/todos/999999');
        
        await test.step('Verify 404 Not Found response', async () => {
          await ApiAssertions.assertNotFound(response);
        });
      });
    });

    test('Create todo with missing required fields', async ({ request }) => {
      await test.step('Prepare incomplete todo data (missing title and completed)', async () => {
        const incompleteTodoData = {
          userId: 1
          // Missing title and completed fields
        };

        await test.step('Send POST request with incomplete data', async () => {
          const response = await request.post('/todos', {
            data: incompleteTodoData
          });
          
          await test.step('Verify response (JSONPlaceholder accepts incomplete data)', async () => {
            // JSONPlaceholder doesn't validate required fields strictly
            expect([200, 201, 400]).toContain(response.status());
          });
        });
      });
    });

    test('Update non-existent todo returns 500', async ({ request }) => {
      await test.step('Prepare update data for non-existent todo', async () => {
        const updatedTodoData: UpdateTodoRequest = {
          id: 999999,
          userId: 1,
          title: 'Updated Todo',
          completed: true
        };

        await test.step('Send PUT request to non-existent todo', async () => {
          const response = await request.put('/todos/999999', {
            data: updatedTodoData
          });
          
          await test.step('Verify 500 Server Error response', async () => {
            await ApiAssertions.assertServerError(response);
          });
        });
      });
    });

    test('Delete non-existent todo returns 200', async ({ request }) => {
      await test.step('Send DELETE request to non-existent todo', async () => {
        const response = await request.delete('/todos/999999');
        
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
        
        const largeTodoData = TestDataGenerators.createTestTodo({
          title: largeTitle
        });

        await test.step('Send POST request with large payload', async () => {
          const response = await request.post('/todos', {
            data: largeTodoData
          });
          
          await test.step('Verify large payload was handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Todo>(response, largeTodoData);
          });
        });
      });
    });

    test('Handle boundary values', async ({ request }) => {
      await test.step('Test first todo (boundary: ID=1)', async () => {
        const firstResponse = await request.get('/todos/1');
        await ApiAssertions.assertStatus(firstResponse, 200);
        
        const firstTodo = await firstResponse.json();
        expect(firstTodo.id).toBe(1);
      });
      
      await test.step('Test last todo (boundary: ID=200)', async () => {
        const lastResponse = await request.get('/todos/200');
        await ApiAssertions.assertStatus(lastResponse, 200);
        
        const lastTodo = await lastResponse.json();
        expect(lastTodo.id).toBe(200);
      });
    });

    test('Handle special characters in payload', async ({ request }) => {
      await test.step('Prepare special characters test data', async () => {
        const specialTodoData = TestDataGenerators.createTestTodo({
          title: TestDataGenerators.createSpecialCharacters()
        });

        await test.step('Send POST request with special characters', async () => {
          const response = await request.post('/todos', {
            data: specialTodoData
          });
          
          await test.step('Verify special characters were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Todo>(response, specialTodoData);
          });
        });
      });
    });

    test('Handle empty fields', async ({ request }) => {
      await test.step('Prepare empty fields test data', async () => {
        const emptyFieldTodoData = TestDataGenerators.createTestTodo({
          title: ''
        });

        await test.step('Send POST request with empty fields', async () => {
          const response = await request.post('/todos', {
            data: emptyFieldTodoData
          });
          
          await test.step('Verify empty fields were handled successfully', async () => {
            await ApiAssertions.assertCreatedResource<Todo>(response, emptyFieldTodoData);
          });
        });
      });
    });

    test('Handle boolean edge cases', async ({ request }) => {
      await test.step('Test with completed: true', async () => {
        const completedTodoData = TestDataGenerators.createTestTodo({
          completed: true
        });

        const completedResponse = await request.post('/todos', {
          data: completedTodoData
        });
        
        await test.step('Verify completed todo was handled successfully', async () => {
          await ApiAssertions.assertCreatedResource<Todo>(completedResponse, completedTodoData);
        });
      });

      await test.step('Test with completed: false', async () => {
        const incompleteTodoData = TestDataGenerators.createTestTodo({
          completed: false
        });

        const incompleteResponse = await request.post('/todos', {
          data: incompleteTodoData
        });
        
        await test.step('Verify incomplete todo was handled successfully', async () => {
          await ApiAssertions.assertCreatedResource<Todo>(incompleteResponse, incompleteTodoData);
        });
      });
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple todos with test data', async ({ request }) => {
      await test.step('Load external test data from JSON file', async () => {
        for (const todoData of todosData) {
          await test.step(`Create todo: "${todoData.title}"`, async () => {
            const response = await request.post('/todos', {
              data: todoData
            });
            
            await test.step('Verify todo creation from external data', async () => {
              await ApiAssertions.assertCreatedResource<Todo>(response, todoData);
            });
          });
        }
      });
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      await test.step('Send GET request to todos endpoint', async () => {
        const response = await request.get('/todos');
        
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
      await test.step('Send GET request to specific todo', async () => {
        const response = await request.get('/todos/1');
        
        await test.step('Verify basic response validation', async () => {
          await ApiAssertions.assertStatus(response, 200);
          await ApiAssertions.assertJsonObject(response);
          await ApiAssertions.assertBaseResourceFields(response);
        });
        
        await test.step('Verify todo-specific schema validation', async () => {
          await ApiAssertions.assertSchema<Todo>(response, {
            id: 'number',
            userId: 'number',
            title: 'string',
            completed: 'boolean'
          });
        });
      });
    });
  });

  test.describe('API Helper Methods', () => {
    test('Use API helper methods for CRUD operations', async ({ request, testTodoData }) => {
      await test.step('Initialize API helpers', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Test CREATE operation using helper', async () => {
          const createdTodo = await apiHelpers.createTodo(testTodoData);
          expect(createdTodo).toHaveProperty('id');
          expect(createdTodo.userId).toBe(testTodoData.userId);
          expect(createdTodo.title).toBe(testTodoData.title);
          expect(createdTodo.completed).toBe(testTodoData.completed);
        });

        await test.step('Test READ operation using helper', async () => {
          // Get existing todo using helper (since JSONPlaceholder doesn't persist created todos)
          const retrievedTodo = await apiHelpers.getTodoById(1);
          expect(retrievedTodo.id).toBe(1);
        });

        await test.step('Test UPDATE operation using helper', async () => {
          const updatedTodoData: UpdateTodoRequest = {
            id: 1,
            userId: 1,
            title: 'Updated via Helper',
            completed: true
          };
          const updatedTodo = await apiHelpers.updateTodo(1, updatedTodoData);
          expect(updatedTodo.title).toBe('Updated via Helper');
        });

        await test.step('Test DELETE operation using helper', async () => {
          await apiHelpers.deleteTodo(1);
        });
      });
    });

    test('Use API helper for filtered queries', async ({ request }) => {
      await test.step('Initialize API helpers and test filtered queries', async () => {
        const apiHelpers = new ApiHelpers(request);
        
        await test.step('Get todos filtered by user ID', async () => {
          const todosByUser = await apiHelpers.getTodosByUserId(1);
          expect(Array.isArray(todosByUser)).toBe(true);
          
          await test.step('Verify all todos belong to specified user', async () => {
            for (const todo of todosByUser) {
              expect(todo.userId).toBe(1);
            }
          });
        });

        await test.step('Get todos filtered by completion status', async () => {
          const completedTodos = await apiHelpers.getTodosByCompletionStatus(true);
          expect(Array.isArray(completedTodos)).toBe(true);
          
          await test.step('Verify all todos have correct completion status', async () => {
            for (const todo of completedTodos) {
              expect(todo.completed).toBe(true);
            }
          });
        });
      });
    });
  });
});
