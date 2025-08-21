# Test Cases Documentation

This document outlines the test cases designed for the JSONPlaceholder API automation framework.

## Test Categories

### 1. Positive Scenarios
Tests that validate successful API operations with valid data.

### 2. Negative Scenarios  
Tests that validate proper error handling with invalid data.

### 3. Edge Cases
Tests that validate boundary conditions and unusual scenarios.

---

## Posts Endpoint Tests

### TC001: Get All Posts (Positive)
- **Test Case Name**: Get All Posts Successfully
- **Description**: Verify that GET /posts returns all posts with correct structure
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /posts
  2. Verify response status code is 200
  3. Verify response contains array of posts
  4. Verify each post has required fields (id, title, body, userId)
- **Expected Result**: 
  - Status code: 200
  - Response body contains array of posts
  - Each post has id, title, body, userId fields

### TC002: Get Post by Valid ID (Positive)
- **Test Case Name**: Get Post by Valid ID Successfully
- **Description**: Verify that GET /posts/{id} returns specific post
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /posts/1
  2. Verify response status code is 200
  3. Verify response contains post with id=1
  4. Verify post has all required fields
- **Expected Result**:
  - Status code: 200
  - Response contains post with id=1
  - Post has title, body, userId fields

### TC003: Create New Post (Positive)
- **Test Case Name**: Create New Post Successfully
- **Description**: Verify that POST /posts creates new post
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare post data with title, body, userId
  2. Send POST request to /posts with data
  3. Verify response status code is 201
  4. Verify response contains created post with id
- **Expected Result**:
  - Status code: 201
  - Response contains created post with generated id
  - Post data matches sent data

### TC004: Update Post (Positive)
- **Test Case Name**: Update Post Successfully
- **Description**: Verify that PUT /posts/{id} updates existing post
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare updated post data
  2. Send PUT request to /posts/1 with updated data
  3. Verify response status code is 200
  4. Verify response contains updated post
- **Expected Result**:
  - Status code: 200
  - Response contains updated post
  - Post data reflects changes

### TC005: Delete Post (Positive)
- **Test Case Name**: Delete Post Successfully
- **Description**: Verify that DELETE /posts/{id} deletes post
- **Precondition**: API is accessible
- **Steps**:
  1. Send DELETE request to /posts/1
  2. Verify response status code is 200
- **Expected Result**:
  - Status code: 200

---

## Comments Endpoint Tests

### TC021: Get All Comments (Positive)
- **Test Case Name**: Get All Comments Successfully
- **Description**: Verify that GET /comments returns all comments with correct structure
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /comments
  2. Verify response status code is 200
  3. Verify response contains array of comments
  4. Verify each comment has required fields (id, postId, name, email, body)
- **Expected Result**: 
  - Status code: 200
  - Response body contains array of comments
  - Each comment has id, postId, name, email, body fields

### TC022: Get Comment by Valid ID (Positive)
- **Test Case Name**: Get Comment by Valid ID Successfully
- **Description**: Verify that GET /comments/{id} returns specific comment
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /comments/1
  2. Verify response status code is 200
  3. Verify response contains comment with id=1
- **Expected Result**:
  - Status code: 200
  - Response contains comment with id=1

### TC023: Create New Comment (Positive)
- **Test Case Name**: Create New Comment Successfully
- **Description**: Verify that POST /comments creates new comment
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare comment data with postId, name, email, body
  2. Send POST request to /comments with data
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created comment with generated id

### TC024: Get Comments by Post ID (Positive)
- **Test Case Name**: Get Comments by Post ID Successfully
- **Description**: Verify that GET /comments?postId={id} returns comments for specific post
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /comments?postId=1
  2. Verify response status code is 200
  3. Verify all returned comments have postId=1
- **Expected Result**:
  - Status code: 200
  - All comments have postId=1

---

## Albums Endpoint Tests

### TC025: Get All Albums (Positive)
- **Test Case Name**: Get All Albums Successfully
- **Description**: Verify that GET /albums returns all albums with correct structure
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /albums
  2. Verify response status code is 200
  3. Verify response contains array of albums
  4. Verify each album has required fields (id, userId, title)
- **Expected Result**: 
  - Status code: 200
  - Response body contains array of albums
  - Each album has id, userId, title fields

### TC026: Get Album by Valid ID (Positive)
- **Test Case Name**: Get Album by Valid ID Successfully
- **Description**: Verify that GET /albums/{id} returns specific album
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /albums/1
  2. Verify response status code is 200
  3. Verify response contains album with id=1
- **Expected Result**:
  - Status code: 200
  - Response contains album with id=1

### TC027: Create New Album (Positive)
- **Test Case Name**: Create New Album Successfully
- **Description**: Verify that POST /albums creates new album
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare album data with userId, title
  2. Send POST request to /albums with data
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created album with generated id

### TC028: Get Albums by User ID (Positive)
- **Test Case Name**: Get Albums by User ID Successfully
- **Description**: Verify that GET /albums?userId={id} returns albums for specific user
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /albums?userId=1
  2. Verify response status code is 200
  3. Verify all returned albums have userId=1
- **Expected Result**:
  - Status code: 200
  - All albums have userId=1

---

## Photos Endpoint Tests

### TC029: Get All Photos (Positive)
- **Test Case Name**: Get All Photos Successfully
- **Description**: Verify that GET /photos returns all photos with correct structure
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /photos
  2. Verify response status code is 200
  3. Verify response contains array of photos
  4. Verify each photo has required fields (id, albumId, title, url, thumbnailUrl)
- **Expected Result**: 
  - Status code: 200
  - Response body contains array of photos
  - Each photo has id, albumId, title, url, thumbnailUrl fields

### TC030: Get Photo by Valid ID (Positive)
- **Test Case Name**: Get Photo by Valid ID Successfully
- **Description**: Verify that GET /photos/{id} returns specific photo
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /photos/1
  2. Verify response status code is 200
  3. Verify response contains photo with id=1
- **Expected Result**:
  - Status code: 200
  - Response contains photo with id=1

### TC031: Create New Photo (Positive)
- **Test Case Name**: Create New Photo Successfully
- **Description**: Verify that POST /photos creates new photo
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare photo data with albumId, title, url, thumbnailUrl
  2. Send POST request to /photos with data
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created photo with generated id

### TC032: Get Photos by Album ID (Positive)
- **Test Case Name**: Get Photos by Album ID Successfully
- **Description**: Verify that GET /photos?albumId={id} returns photos for specific album
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /photos?albumId=1
  2. Verify response status code is 200
  3. Verify all returned photos have albumId=1
- **Expected Result**:
  - Status code: 200
  - All photos have albumId=1

---

## Todos Endpoint Tests

### TC033: Get All Todos (Positive)
- **Test Case Name**: Get All Todos Successfully
- **Description**: Verify that GET /todos returns all todos with correct structure
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /todos
  2. Verify response status code is 200
  3. Verify response contains array of todos
  4. Verify each todo has required fields (id, userId, title, completed)
- **Expected Result**: 
  - Status code: 200
  - Response body contains array of todos
  - Each todo has id, userId, title, completed fields

### TC034: Get Todo by Valid ID (Positive)
- **Test Case Name**: Get Todo by Valid ID Successfully
- **Description**: Verify that GET /todos/{id} returns specific todo
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /todos/1
  2. Verify response status code is 200
  3. Verify response contains todo with id=1
- **Expected Result**:
  - Status code: 200
  - Response contains todo with id=1

### TC035: Create New Todo (Positive)
- **Test Case Name**: Create New Todo Successfully
- **Description**: Verify that POST /todos creates new todo
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare todo data with userId, title, completed
  2. Send POST request to /todos with data
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created todo with generated id

### TC036: Get Todos by User ID (Positive)
- **Test Case Name**: Get Todos by User ID Successfully
- **Description**: Verify that GET /todos?userId={id} returns todos for specific user
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /todos?userId=1
  2. Verify response status code is 200
  3. Verify all returned todos have userId=1
- **Expected Result**:
  - Status code: 200
  - All todos have userId=1

### TC037: Get Completed Todos (Positive)
- **Test Case Name**: Get Completed Todos Successfully
- **Description**: Verify that GET /todos?completed=true returns only completed todos
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /todos?completed=true
  2. Verify response status code is 200
  3. Verify all returned todos have completed=true
- **Expected Result**:
  - Status code: 200
  - All todos have completed=true

### TC038: Get Incomplete Todos (Positive)
- **Test Case Name**: Get Incomplete Todos Successfully
- **Description**: Verify that GET /todos?completed=false returns only incomplete todos
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /todos?completed=false
  2. Verify response status code is 200
  3. Verify all returned todos have completed=false
- **Expected Result**:
  - Status code: 200
  - All todos have completed=false

---

## Users Endpoint Tests

### TC015: Get All Users (Positive)
- **Test Case Name**: Get All Users Successfully
- **Description**: Verify that GET /users returns all users
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /users
  2. Verify response status code is 200
  3. Verify response contains array of users
- **Expected Result**:
  - Status code: 200
  - Response contains array of users

### TC016: Get User by ID (Positive)
- **Test Case Name**: Get User by ID Successfully
- **Description**: Verify that GET /users/{id} returns specific user
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /users/1
  2. Verify response status code is 200
  3. Verify response contains user with id=1
- **Expected Result**:
  - Status code: 200
  - Response contains user with id=1

### TC017: Create New User (Positive)
- **Test Case Name**: Create New User Successfully
- **Description**: Verify that POST /users creates new user
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare user data with name, username, email, phone, website
  2. Send POST request to /users with data
  3. Verify response status code is 201
  4. Verify response contains created user with id
- **Expected Result**:
  - Status code: 201
  - Response contains created user with generated id
  - User data matches sent data

### TC018: Create User with Large Payload (Positive)
- **Test Case Name**: Create User with Large Payload Successfully
- **Description**: Verify that API handles large payloads for user creation
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare user data with very long name and email fields
  2. Send POST request to /users with large payload
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created user

### TC019: Create User with Special Characters (Positive)
- **Test Case Name**: Create User with Special Characters Successfully
- **Description**: Verify that API handles special characters in user data
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare user data with special characters in name and username
  2. Send POST request to /users with special characters
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created user with special characters preserved

### TC020: Create User with Empty Fields (Positive)
- **Test Case Name**: Create User with Empty Fields Successfully
- **Description**: Verify that API handles empty fields in user data
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare user data with empty name and website fields
  2. Send POST request to /users with empty fields
  3. Verify response behavior
- **Expected Result**:
  - API accepts empty fields (JSONPlaceholder behavior)
  - Response contains created user

### TC021: Update User (Positive)
- **Test Case Name**: Update User Successfully
- **Description**: Verify that PUT /users/{id} updates existing user
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare updated user data
  2. Send PUT request to /users/1 with updated data
  3. Verify response status code is 200
  4. Verify response contains updated user
- **Expected Result**:
  - Status code: 200
  - Response contains updated user
  - User data reflects changes

### TC022: Update User with Large Payload (Positive)
- **Test Case Name**: Update User with Large Payload Successfully
- **Description**: Verify that API handles large payloads for user updates
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare user data with very long name and email fields
  2. Send PUT request to /users/1 with large payload
  3. Verify response status code is 200
- **Expected Result**:
  - Status code: 200
  - Response contains updated user

### TC023: Delete User (Positive)
- **Test Case Name**: Delete User Successfully
- **Description**: Verify that DELETE /users/{id} deletes user
- **Precondition**: API is accessible
- **Steps**:
  1. Send DELETE request to /users/1
  2. Verify response status code is 200
- **Expected Result**:
  - Status code: 200

---

## Negative Scenarios (Common across all endpoints)

### TC006: Get Resource by Invalid ID (Negative)
- **Test Case Name**: Get Resource by Invalid ID Returns 404
- **Description**: Verify that GET /{resource}/999999 returns 404
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /{resource}/999999
  2. Verify response status code is 404
- **Expected Result**:
  - Status code: 404

### TC007: Create Resource with Missing Required Fields (Negative)
- **Test Case Name**: Create Resource with Missing Fields Returns 400
- **Description**: Verify that POST /{resource} with missing fields returns error
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare incomplete resource data
  2. Send POST request to /{resource} with incomplete data
  3. Verify response status code is 400
- **Expected Result**:
  - Status code: 400

### TC008: Update Non-existent Resource (Negative)
- **Test Case Name**: Update Non-existent Resource Returns 500
- **Description**: Verify that PUT /{resource}/999999 returns 500
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare resource data
  2. Send PUT request to /{resource}/999999 with data
  3. Verify response status code is 500
- **Expected Result**:
  - Status code: 500

### TC009: Delete Non-existent Resource (Negative)
- **Test Case Name**: Delete Non-existent Resource Returns 200
- **Description**: Verify that DELETE /{resource}/999999 returns 200
- **Precondition**: API is accessible
- **Steps**:
  1. Send DELETE request to /{resource}/999999
  2. Verify response status code is 200
- **Expected Result**:
  - Status code: 200

### TC010: Invalid HTTP Method (Negative)
- **Test Case Name**: Invalid HTTP Method Returns 200
- **Description**: Verify that unsupported HTTP methods return 200
- **Precondition**: API is accessible
- **Steps**:
  1. Send PATCH request to /{resource}/1
  2. Verify response status code is 200
- **Expected Result**:
  - Status code: 200

---

## Edge Cases (Common across all endpoints)

### TC011: Large Payload (Edge Case)
- **Test Case Name**: Handle Large Payload Successfully
- **Description**: Verify that API handles large payloads
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare resource with very long text fields
  2. Send POST request to /{resource} with large payload
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created resource

### TC012: Boundary Values (Edge Case)
- **Test Case Name**: Handle Boundary Values
- **Description**: Verify that API handles boundary values correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /{resource}/1 (first resource)
  2. Send GET request to /{resource}/last (last resource)
  3. Verify both responses are successful
- **Expected Result**:
  - Both requests return status code 200
  - Responses contain valid resource data

### TC013: Special Characters (Edge Case)
- **Test Case Name**: Handle Special Characters in Payload
- **Description**: Verify that API handles special characters correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare resource with special characters in text fields
  2. Send POST request to /{resource} with special characters
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created resource with special characters preserved

### TC014: Empty Fields (Edge Case)
- **Test Case Name**: Handle Empty Fields
- **Description**: Verify that API handles empty fields correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare resource with empty text fields
  2. Send POST request to /{resource} with empty fields
  3. Verify response behavior
- **Expected Result**:
  - Appropriate response (may be 201 or 400 depending on API behavior)

---

## Data-Driven Tests

### TC024: Data-Driven Post Creation
- **Test Case Name**: Create Multiple Posts with Test Data
- **Description**: Verify that multiple posts can be created using external test data
- **Precondition**: API is accessible, test data available
- **Steps**:
  1. Load test data from test-data/posts.json
  2. For each test case, send POST request to /posts
  3. Verify each response is successful
- **Expected Result**:
  - All requests return status code 201
  - Each response contains created post

### TC025: Data-Driven User Creation
- **Test Case Name**: Create Multiple Users with Test Data
- **Description**: Verify that multiple users can be created using external test data
- **Precondition**: API is accessible, test data available
- **Steps**:
  1. Load test data from test-data/users.json
  2. For each test case, send POST request to /users
  3. Verify each response is successful
- **Expected Result**:
  - All requests return status code 201
  - Each response contains created user

### TC026: Data-Driven Comment Creation
- **Test Case Name**: Create Multiple Comments with Test Data
- **Description**: Verify that multiple comments can be created using external test data
- **Precondition**: API is accessible, test data available
- **Steps**:
  1. Load test data from test-data/comments.json
  2. For each test case, send POST request to /comments
  3. Verify each response is successful
- **Expected Result**:
  - All requests return status code 201
  - Each response contains created comment

### TC027: Data-Driven Album Creation
- **Test Case Name**: Create Multiple Albums with Test Data
- **Description**: Verify that multiple albums can be created using external test data
- **Precondition**: API is accessible, test data available
- **Steps**:
  1. Load test data from test-data/albums.json
  2. For each test case, send POST request to /albums
  3. Verify each response is successful
- **Expected Result**:
  - All requests return status code 201
  - Each response contains created album

### TC028: Data-Driven Photo Creation
- **Test Case Name**: Create Multiple Photos with Test Data
- **Description**: Verify that multiple photos can be created using external test data
- **Precondition**: API is accessible, test data available
- **Steps**:
  1. Load test data from test-data/photos.json
  2. For each test case, send POST request to /photos
  3. Verify each response is successful
- **Expected Result**:
  - All requests return status code 201
  - Each response contains created photo

### TC029: Data-Driven Todo Creation
- **Test Case Name**: Create Multiple Todos with Test Data
- **Description**: Verify that multiple todos can be created using external test data
- **Precondition**: API is accessible, test data available
- **Steps**:
  1. Load test data from test-data/todos.json
  2. For each test case, send POST request to /todos
  3. Verify each response is successful
- **Expected Result**:
  - All requests return status code 201
  - Each response contains created todo

---

## Response Validation Tests

### TC030: Response Headers Validation
- **Test Case Name**: Validate Response Headers
- **Description**: Verify that API responses include correct headers
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /{resource}
  2. Verify Content-Type header is application/json
  3. Verify other relevant headers are present
- **Expected Result**:
  - Content-Type: application/json
  - Other headers as expected

### TC031: Response Schema Validation
- **Test Case Name**: Validate Response Schema
- **Description**: Verify that API responses match expected schema
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /{resource}/1
  2. Verify response contains required fields
  3. Verify field types are correct
- **Expected Result**:
  - Response contains all required fields
  - Field types match expected schema

---

## Resource-Specific Edge Cases

### TC032: Photo URL Validation (Photos Endpoint)
- **Test Case Name**: Handle Invalid URL Formats
- **Description**: Verify that API handles invalid URL formats in photo endpoints
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare photo data with invalid URLs
  2. Send POST request to /photos with invalid URLs
  3. Verify response behavior
- **Expected Result**:
  - API accepts invalid URLs (JSONPlaceholder behavior)
  - Response contains created photo with invalid URLs

### TC033: Todo Boolean Validation (Todos Endpoint)
- **Test Case Name**: Handle Boolean Edge Cases
- **Description**: Verify that API handles boolean completed field correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Create todo with completed: true
  2. Create todo with completed: false
  3. Verify both responses are successful
- **Expected Result**:
  - Both requests return status code 201
  - Boolean values are preserved correctly

---

## API Helper Method Tests

### TC034: API Helper CRUD Operations (Posts)
- **Test Case Name**: Use API Helper Methods for CRUD Operations
- **Description**: Verify that API helper methods work correctly for posts CRUD operations
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Test CREATE operation using helper
  3. Test READ operation using helper
  4. Test UPDATE operation using helper
  5. Test DELETE operation using helper
- **Expected Result**:
  - All CRUD operations work correctly
  - Helper methods return expected data

### TC035: API Helper Filtered Queries (Posts)
- **Test Case Name**: Use API Helper for Filtered Queries
- **Description**: Verify that API helper methods work correctly for filtered queries
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Get posts filtered by user ID using helper
  3. Verify all posts belong to specified user
- **Expected Result**:
  - Filtered queries work correctly
  - All returned posts belong to specified user

### TC036: API Helper CRUD Operations (Comments)
- **Test Case Name**: Use API Helper Methods for CRUD Operations
- **Description**: Verify that API helper methods work correctly for comments CRUD operations
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Test CREATE operation using helper
  3. Test READ operation using helper
  4. Test UPDATE operation using helper
  5. Test DELETE operation using helper
- **Expected Result**:
  - All CRUD operations work correctly
  - Helper methods return expected data

### TC037: API Helper Filtered Queries (Comments)
- **Test Case Name**: Use API Helper for Filtered Queries
- **Description**: Verify that API helper methods work correctly for filtered queries
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Get comments filtered by post ID using helper
  3. Verify all comments belong to specified post
- **Expected Result**:
  - Filtered queries work correctly
  - All returned comments belong to specified post

### TC038: API Helper CRUD Operations (Albums)
- **Test Case Name**: Use API Helper Methods for CRUD Operations
- **Description**: Verify that API helper methods work correctly for albums CRUD operations
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Test CREATE operation using helper
  3. Test READ operation using helper
  4. Test UPDATE operation using helper
  5. Test DELETE operation using helper
- **Expected Result**:
  - All CRUD operations work correctly
  - Helper methods return expected data

### TC039: API Helper Filtered Queries (Albums)
- **Test Case Name**: Use API Helper for Filtered Queries
- **Description**: Verify that API helper methods work correctly for filtered queries
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Get albums filtered by user ID using helper
  3. Verify all albums belong to specified user
- **Expected Result**:
  - Filtered queries work correctly
  - All returned albums belong to specified user

### TC040: API Helper CRUD Operations (Photos)
- **Test Case Name**: Use API Helper Methods for CRUD Operations
- **Description**: Verify that API helper methods work correctly for photos CRUD operations
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Test CREATE operation using helper
  3. Test READ operation using helper
  4. Test UPDATE operation using helper
  5. Test DELETE operation using helper
- **Expected Result**:
  - All CRUD operations work correctly
  - Helper methods return expected data

### TC041: API Helper Filtered Queries (Photos)
- **Test Case Name**: Use API Helper for Filtered Queries
- **Description**: Verify that API helper methods work correctly for filtered queries
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Get photos filtered by album ID using helper
  3. Verify all photos belong to specified album
- **Expected Result**:
  - Filtered queries work correctly
  - All returned photos belong to specified album

### TC042: API Helper CRUD Operations (Todos)
- **Test Case Name**: Use API Helper Methods for CRUD Operations
- **Description**: Verify that API helper methods work correctly for todos CRUD operations
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Test CREATE operation using helper
  3. Test READ operation using helper
  4. Test UPDATE operation using helper
  5. Test DELETE operation using helper
- **Expected Result**:
  - All CRUD operations work correctly
  - Helper methods return expected data

### TC043: API Helper Filtered Queries (Todos)
- **Test Case Name**: Use API Helper for Filtered Queries
- **Description**: Verify that API helper methods work correctly for filtered queries
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Get todos filtered by user ID and completion status using helper
  3. Verify all todos match specified criteria
- **Expected Result**:
  - Filtered queries work correctly
  - All returned todos match specified criteria

### TC044: API Helper CRUD Operations (Users)
- **Test Case Name**: Use API Helper Methods for CRUD Operations
- **Description**: Verify that API helper methods work correctly for users CRUD operations
- **Precondition**: API is accessible
- **Steps**:
  1. Initialize API helpers
  2. Test CREATE operation using helper
  3. Test READ operation using helper
  4. Test UPDATE operation using helper
  5. Test DELETE operation using helper
- **Expected Result**:
  - All CRUD operations work correctly
  - Helper methods return expected data

---

## Test Summary

**Total Test Cases**: 138  
**Resource Endpoints Covered**: 6 (Posts, Comments, Albums, Photos, Todos, Users)  
**Test Categories**: Positive, Negative, Edge Cases, Data-Driven, Response Validation, API Helper Methods  
**Data-Driven Tests**: 6 (one per resource)  
**Query Parameter Tests**: 8 (filtering by various criteria)  
**Schema Validation Tests**: 6 (one per resource)  
**Error Handling Tests**: 5 (common across all resources)  
**Edge Case Tests**: 6 (common across all resources) + 2 (resource-specific)  
**API Helper Method Tests**: 12 (CRUD operations + filtered queries for each resource)

### Test Distribution by Resource:
- **Posts**: 24 tests
- **Comments**: 23 tests  
- **Albums**: 23 tests
- **Photos**: 25 tests
- **Todos**: 27 tests
- **Users**: 16 tests
