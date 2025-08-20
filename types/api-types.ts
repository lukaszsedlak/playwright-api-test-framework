// Base interface for all resources
export interface BaseResource {
  id: number;
}

// Post interfaces
export interface Post extends BaseResource {
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequest extends Post {}

// Comment interfaces
export interface Comment extends BaseResource {
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface CreateCommentRequest {
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface UpdateCommentRequest extends Comment {}

// Album interfaces
export interface Album extends BaseResource {
  userId: number;
  title: string;
}

export interface CreateAlbumRequest {
  userId: number;
  title: string;
}

export interface UpdateAlbumRequest extends Album {}

// Photo interfaces
export interface Photo extends BaseResource {
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface CreatePhotoRequest {
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface UpdatePhotoRequest extends Photo {}

// Todo interfaces
export interface Todo extends BaseResource {
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

export interface UpdateTodoRequest extends Todo {}

// User interfaces
export interface User extends BaseResource {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface UpdateUserRequest extends User {}

// Error response interface
export interface ErrorResponse {
  message?: string;
  status?: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Query parameters
export interface QueryParams {
  [key: string]: string | number | boolean;
}
