import { test as base } from '@playwright/test';
import { TestDataGenerators } from './api-helpers';
import { 
  Post, CreatePostRequest,
  Comment, CreateCommentRequest,
  Album, CreateAlbumRequest,
  Photo, CreatePhotoRequest,
  Todo, CreateTodoRequest,
  User, CreateUserRequest
} from '../types/api-types';

// Define fixtures for test data
export type TestFixtures = {
  // Sample data fixtures (shared across tests)
  samplePost: Post;
  sampleComment: Comment;
  sampleAlbum: Album;
  samplePhoto: Photo;
  sampleTodo: Todo;
  sampleUser: User;
  
  // Test data fixtures (fresh for each test)
  testPostData: CreatePostRequest;
  testCommentData: CreateCommentRequest;
  testAlbumData: CreateAlbumRequest;
  testPhotoData: CreatePhotoRequest;
  testTodoData: CreateTodoRequest;
  testUserData: CreateUserRequest;
};

// Extend the base test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Sample data fixtures (shared across tests)
  samplePost: async ({ request }, use) => {
    const response = await request.get('/posts/1');
    const samplePost = await response.json();
    await use(samplePost);
  },

  sampleComment: async ({ request }, use) => {
    const response = await request.get('/comments/1');
    const sampleComment = await response.json();
    await use(sampleComment);
  },

  sampleAlbum: async ({ request }, use) => {
    const response = await request.get('/albums/1');
    const sampleAlbum = await response.json();
    await use(sampleAlbum);
  },

  samplePhoto: async ({ request }, use) => {
    const response = await request.get('/photos/1');
    const samplePhoto = await response.json();
    await use(samplePhoto);
  },

  sampleTodo: async ({ request }, use) => {
    const response = await request.get('/todos/1');
    const sampleTodo = await response.json();
    await use(sampleTodo);
  },

  sampleUser: async ({ request }, use) => {
    const response = await request.get('/users/1');
    const sampleUser = await response.json();
    await use(sampleUser);
  },

  // Test data fixtures (fresh for each test)
  testPostData: async ({}, use) => {
    const testPostData = TestDataGenerators.createTestPost();
    await use(testPostData);
  },

  testCommentData: async ({}, use) => {
    const testCommentData = TestDataGenerators.createTestComment();
    await use(testCommentData);
  },

  testAlbumData: async ({}, use) => {
    const testAlbumData = TestDataGenerators.createTestAlbum();
    await use(testAlbumData);
  },

  testPhotoData: async ({}, use) => {
    const testPhotoData = TestDataGenerators.createTestPhoto();
    await use(testPhotoData);
  },

  testTodoData: async ({}, use) => {
    const testTodoData = TestDataGenerators.createTestTodo();
    await use(testTodoData);
  },

  testUserData: async ({}, use) => {
    const testUserData = TestDataGenerators.createTestUser();
    await use(testUserData);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
