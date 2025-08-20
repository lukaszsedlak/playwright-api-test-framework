import { APIRequestContext } from '@playwright/test';
import { 
  Post, 
  CreatePostRequest, 
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  Album,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  Photo,
  CreatePhotoRequest,
  UpdatePhotoRequest,
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  QueryParams
} from '../types/api-types';

export class ApiHelpers {
  constructor(private request: APIRequestContext) {}

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: QueryParams): string {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, String(value));
    }
    
    return queryParams.toString();
  }

  // Posts API helpers
  async getAllPosts(): Promise<Post[]> {
    const response = await this.request.get('/posts');
    return response.json();
  }

  async getPostById(id: number): Promise<Post> {
    const response = await this.request.get(`/posts/${id}`);
    return response.json();
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    const response = await this.request.post('/posts', { data: postData });
    return response.json();
  }

  async updatePost(id: number, postData: UpdatePostRequest): Promise<Post> {
    const response = await this.request.put(`/posts/${id}`, { data: postData });
    return response.json();
  }

  async deletePost(id: number): Promise<void> {
    await this.request.delete(`/posts/${id}`);
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const response = await this.request.get(`/posts?${this.buildQueryString({ userId })}`);
    return response.json();
  }

  // Comments API helpers
  async getAllComments(): Promise<Comment[]> {
    const response = await this.request.get('/comments');
    return response.json();
  }

  async getCommentById(id: number): Promise<Comment> {
    const response = await this.request.get(`/comments/${id}`);
    return response.json();
  }

  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    const response = await this.request.post('/comments', { data: commentData });
    return response.json();
  }

  async updateComment(id: number, commentData: UpdateCommentRequest): Promise<Comment> {
    const response = await this.request.put(`/comments/${id}`, { data: commentData });
    return response.json();
  }

  async deleteComment(id: number): Promise<void> {
    await this.request.delete(`/comments/${id}`);
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const response = await this.request.get(`/comments?${this.buildQueryString({ postId })}`);
    return response.json();
  }

  // Albums API helpers
  async getAllAlbums(): Promise<Album[]> {
    const response = await this.request.get('/albums');
    return response.json();
  }

  async getAlbumById(id: number): Promise<Album> {
    const response = await this.request.get(`/albums/${id}`);
    return response.json();
  }

  async createAlbum(albumData: CreateAlbumRequest): Promise<Album> {
    const response = await this.request.post('/albums', { data: albumData });
    return response.json();
  }

  async updateAlbum(id: number, albumData: UpdateAlbumRequest): Promise<Album> {
    const response = await this.request.put(`/albums/${id}`, { data: albumData });
    return response.json();
  }

  async deleteAlbum(id: number): Promise<void> {
    await this.request.delete(`/albums/${id}`);
  }

  async getAlbumsByUserId(userId: number): Promise<Album[]> {
    const response = await this.request.get(`/albums?${this.buildQueryString({ userId })}`);
    return response.json();
  }

  // Photos API helpers
  async getAllPhotos(): Promise<Photo[]> {
    const response = await this.request.get('/photos');
    return response.json();
  }

  async getPhotoById(id: number): Promise<Photo> {
    const response = await this.request.get(`/photos/${id}`);
    return response.json();
  }

  async createPhoto(photoData: CreatePhotoRequest): Promise<Photo> {
    const response = await this.request.post('/photos', { data: photoData });
    return response.json();
  }

  async updatePhoto(id: number, photoData: UpdatePhotoRequest): Promise<Photo> {
    const response = await this.request.put(`/photos/${id}`, { data: photoData });
    return response.json();
  }

  async deletePhoto(id: number): Promise<void> {
    await this.request.delete(`/photos/${id}`);
  }

  async getPhotosByAlbumId(albumId: number): Promise<Photo[]> {
    const response = await this.request.get(`/photos?${this.buildQueryString({ albumId })}`);
    return response.json();
  }

  // Todos API helpers
  async getAllTodos(): Promise<Todo[]> {
    const response = await this.request.get('/todos');
    return response.json();
  }

  async getTodoById(id: number): Promise<Todo> {
    const response = await this.request.get(`/todos/${id}`);
    return response.json();
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const response = await this.request.post('/todos', { data: todoData });
    return response.json();
  }

  async updateTodo(id: number, todoData: UpdateTodoRequest): Promise<Todo> {
    const response = await this.request.put(`/todos/${id}`, { data: todoData });
    return response.json();
  }

  async deleteTodo(id: number): Promise<void> {
    await this.request.delete(`/todos/${id}`);
  }

  async getTodosByUserId(userId: number): Promise<Todo[]> {
    const response = await this.request.get(`/todos?${this.buildQueryString({ userId })}`);
    return response.json();
  }

  async getTodosByCompletionStatus(completed: boolean): Promise<Todo[]> {
    const response = await this.request.get(`/todos?${this.buildQueryString({ completed })}`);
    return response.json();
  }

  // Users API helpers
  async getAllUsers(): Promise<User[]> {
    const response = await this.request.get('/users');
    return response.json();
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.request.get(`/users/${id}`);
    return response.json();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await this.request.post('/users', { data: userData });
    return response.json();
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await this.request.put(`/users/${id}`, { data: userData });
    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    await this.request.delete(`/users/${id}`);
  }

  // Generic helpers for testing
  async testInvalidId(resource: string, id: number = 999999): Promise<void> {
    await this.request.get(`/${resource}/${id}`);
  }

  async testUnsupportedMethod(resource: string, id: number = 1): Promise<void> {
    await this.request.patch(`/${resource}/${id}`, { data: {} });
  }
}

// Test data generators
export class TestDataGenerators {
  static createTestPost(overrides: Partial<CreatePostRequest> = {}): CreatePostRequest {
    return {
      title: 'Test Post Title',
      body: 'Test Post Body',
      userId: 1,
      ...overrides
    };
  }

  static createTestComment(overrides: Partial<CreateCommentRequest> = {}): CreateCommentRequest {
    return {
      postId: 1,
      name: 'Test Comment',
      email: 'test@example.com',
      body: 'This is a test comment',
      ...overrides
    };
  }

  static createTestAlbum(overrides: Partial<CreateAlbumRequest> = {}): CreateAlbumRequest {
    return {
      userId: 1,
      title: 'Test Album',
      ...overrides
    };
  }

  static createTestPhoto(overrides: Partial<CreatePhotoRequest> = {}): CreatePhotoRequest {
    return {
      albumId: 1,
      title: 'Test Photo',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
      ...overrides
    };
  }

  static createTestTodo(overrides: Partial<CreateTodoRequest> = {}): CreateTodoRequest {
    return {
      userId: 1,
      title: 'Test Todo',
      completed: false,
      ...overrides
    };
  }

  static createTestUser(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
    return {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      ...overrides
    };
  }

  static createLargePayload(size: number = 1000): string {
    return 'A'.repeat(size);
  }

  static createSpecialCharacters(): string {
    return 'Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>? áéíóú ñ ç ß € £ ¥';
  }
}
