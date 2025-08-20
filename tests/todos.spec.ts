import { test, expect } from '@playwright/test';
import todosData from '../test-data/todos.json';

test.describe('Todos API Tests', () => {
  test.describe('Positive Scenarios', () => {
    test('Get all todos successfully', async ({ request }) => {
      const response = await request.get('/todos');
      
      expect(response.status()).toBe(200);
      const todos = await response.json();
      
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
      
      // Verify each todo has required fields
      for (const todo of todos) {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('userId');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('completed');
        expect(typeof todo.id).toBe('number');
        expect(typeof todo.userId).toBe('number');
        expect(typeof todo.title).toBe('string');
        expect(typeof todo.completed).toBe('boolean');
      }
    });

    test('Get todo by valid ID successfully', async ({ request }) => {
      const response = await request.get('/todos/1');
      
      expect(response.status()).toBe(200);
      const todo = await response.json();
      
      expect(todo.id).toBe(1);
      expect(todo).toHaveProperty('userId');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('completed');
    });

    test('Create new todo successfully', async ({ request }) => {
      const newTodo = {
        userId: 1,
        title: 'Test Todo',
        completed: false
      };

      const response = await request.post('/todos', {
        data: newTodo
      });
      
      expect(response.status()).toBe(201);
      const createdTodo = await response.json();
      
      expect(createdTodo).toHaveProperty('id');
      expect(createdTodo.userId).toBe(newTodo.userId);
      expect(createdTodo.title).toBe(newTodo.title);
      expect(createdTodo.completed).toBe(newTodo.completed);
    });

    test('Update todo successfully', async ({ request }) => {
      const updatedTodo = {
        id: 1,
        userId: 1,
        title: 'Updated Todo',
        completed: true
      };

      const response = await request.put('/todos/1', {
        data: updatedTodo
      });
      
      expect(response.status()).toBe(200);
      const todo = await response.json();
      
      expect(todo.id).toBe(updatedTodo.id);
      expect(todo.userId).toBe(updatedTodo.userId);
      expect(todo.title).toBe(updatedTodo.title);
      expect(todo.completed).toBe(updatedTodo.completed);
    });

    test('Delete todo successfully', async ({ request }) => {
      const response = await request.delete('/todos/1');
      
      expect(response.status()).toBe(200);
    });

    test('Get todos by user ID', async ({ request }) => {
      const response = await request.get('/todos?userId=1');
      
      expect(response.status()).toBe(200);
      const todos = await response.json();
      
      expect(Array.isArray(todos)).toBe(true);
      for (const todo of todos) {
        expect(todo.userId).toBe(1);
      }
    });

    test('Get completed todos', async ({ request }) => {
      const response = await request.get('/todos?completed=true');
      
      expect(response.status()).toBe(200);
      const todos = await response.json();
      
      expect(Array.isArray(todos)).toBe(true);
      for (const todo of todos) {
        expect(todo.completed).toBe(true);
      }
    });

    test('Get incomplete todos', async ({ request }) => {
      const response = await request.get('/todos?completed=false');
      
      expect(response.status()).toBe(200);
      const todos = await response.json();
      
      expect(Array.isArray(todos)).toBe(true);
      for (const todo of todos) {
        expect(todo.completed).toBe(false);
      }
    });
  });

  test.describe('Negative Scenarios', () => {
    test('Get todo by invalid ID returns 404', async ({ request }) => {
      const response = await request.get('/todos/999999');
      
      expect(response.status()).toBe(404);
    });

    test('Create todo with missing required fields', async ({ request }) => {
      const incompleteTodo = {
        userId: 1
        // Missing title and completed fields
      };

      const response = await request.post('/todos', {
        data: incompleteTodo
      });
      
      // JSONPlaceholder doesn't validate required fields strictly
      expect([200, 201, 400]).toContain(response.status());
    });

    test('Update non-existent todo returns 500', async ({ request }) => {
      const updatedTodo = {
        id: 999999,
        userId: 1,
        title: 'Updated Todo',
        completed: true
      };

      const response = await request.put('/todos/999999', {
        data: updatedTodo
      });
      
      // JSONPlaceholder returns 500 for non-existent resources on PUT
      expect(response.status()).toBe(500);
    });

    test('Delete non-existent todo returns 200', async ({ request }) => {
      const response = await request.delete('/todos/999999');
      
      // JSONPlaceholder returns 200 for DELETE operations even for non-existent resources
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Edge Cases', () => {
    test('Handle large payload successfully', async ({ request }) => {
      const largeTitle = 'A'.repeat(1000);
      
      const largeTodo = {
        userId: 1,
        title: largeTitle,
        completed: false
      };

      const response = await request.post('/todos', {
        data: largeTodo
      });
      
      expect(response.status()).toBe(201);
      const createdTodo = await response.json();
      
      expect(createdTodo.title).toBe(largeTitle);
    });

    test('Handle boundary values', async ({ request }) => {
      // Test first todo
      const firstResponse = await request.get('/todos/1');
      expect(firstResponse.status()).toBe(200);
      
      // Test last todo (assuming 200 todos exist)
      const lastResponse = await request.get('/todos/200');
      expect(lastResponse.status()).toBe(200);
      
      const firstTodo = await firstResponse.json();
      const lastTodo = await lastResponse.json();
      
      expect(firstTodo.id).toBe(1);
      expect(lastTodo.id).toBe(200);
    });

    test('Handle special characters in payload', async ({ request }) => {
      const specialTodo = {
        userId: 1,
        title: 'Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
        completed: false
      };

      const response = await request.post('/todos', {
        data: specialTodo
      });
      
      expect(response.status()).toBe(201);
      const createdTodo = await response.json();
      
      expect(createdTodo.title).toBe(specialTodo.title);
    });

    test('Handle empty fields', async ({ request }) => {
      const emptyFieldTodo = {
        userId: 1,
        title: '',
        completed: true
      };

      const response = await request.post('/todos', {
        data: emptyFieldTodo
      });
      
      // JSONPlaceholder accepts empty fields
      expect(response.status()).toBe(201);
      const createdTodo = await response.json();
      
      expect(createdTodo.title).toBe('');
    });

    test('Handle boolean edge cases', async ({ request }) => {
      // Test with completed: true
      const completedTodo = {
        userId: 1,
        title: 'Completed Todo',
        completed: true
      };

      const completedResponse = await request.post('/todos', {
        data: completedTodo
      });
      
      expect(completedResponse.status()).toBe(201);
      const createdCompletedTodo = await completedResponse.json();
      expect(createdCompletedTodo.completed).toBe(true);

      // Test with completed: false
      const incompleteTodo = {
        userId: 1,
        title: 'Incomplete Todo',
        completed: false
      };

      const incompleteResponse = await request.post('/todos', {
        data: incompleteTodo
      });
      
      expect(incompleteResponse.status()).toBe(201);
      const createdIncompleteTodo = await incompleteResponse.json();
      expect(createdIncompleteTodo.completed).toBe(false);
    });
  });

  test.describe('Data-Driven Tests', () => {
    test('Create multiple todos with test data', async ({ request }) => {
      for (const todoData of todosData) {
        const response = await request.post('/todos', {
          data: todoData
        });
        
        expect(response.status()).toBe(201);
        const createdTodo = await response.json();
        
        expect(createdTodo).toHaveProperty('id');
        expect(createdTodo.userId).toBe(todoData.userId);
        expect(createdTodo.title).toBe(todoData.title);
        expect(createdTodo.completed).toBe(todoData.completed);
      }
    });
  });

  test.describe('Response Validation', () => {
    test('Validate response headers', async ({ request }) => {
      const response = await request.get('/todos');
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Validate response schema', async ({ request }) => {
      const response = await request.get('/todos/1');
      
      expect(response.status()).toBe(200);
      const todo = await response.json();
      
      // Verify required fields exist
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('userId');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('completed');
      
      // Verify field types
      expect(typeof todo.id).toBe('number');
      expect(typeof todo.userId).toBe('number');
      expect(typeof todo.title).toBe('string');
      expect(typeof todo.completed).toBe('boolean');
      
      // Verify field values are not null/undefined
      expect(todo.id).not.toBeNull();
      expect(todo.userId).not.toBeNull();
      expect(todo.title).not.toBeNull();
      expect(todo.completed).not.toBeNull();
    });
  });
});
