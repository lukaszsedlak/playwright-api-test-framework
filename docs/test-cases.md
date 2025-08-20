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

## Negative Scenarios

### TC006: Get Post by Invalid ID (Negative)
- **Test Case Name**: Get Post by Invalid ID Returns 404
- **Description**: Verify that GET /posts/{invalid_id} returns 404
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /posts/999999
  2. Verify response status code is 404
- **Expected Result**:
  - Status code: 404

### TC007: Create Post with Missing Required Fields (Negative)
- **Test Case Name**: Create Post with Missing Fields Returns 400
- **Description**: Verify that POST /posts with missing fields returns error
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare post data missing title field
  2. Send POST request to /posts with incomplete data
  3. Verify response status code is 400
- **Expected Result**:
  - Status code: 400

### TC008: Update Non-existent Post (Negative)
- **Test Case Name**: Update Non-existent Post Returns 500
- **Description**: Verify that PUT /posts/{non_existent_id} returns 500
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare post data
  2. Send PUT request to /posts/999999 with data
  3. Verify response status code is 500
- **Expected Result**:
  - Status code: 500

### TC009: Delete Non-existent Post (Negative)
- **Test Case Name**: Delete Non-existent Post Returns 200
- **Description**: Verify that DELETE /posts/{non_existent_id} returns 200
- **Precondition**: API is accessible
- **Steps**:
  1. Send DELETE request to /posts/999999
  2. Verify response status code is 200
- **Expected Result**:
  - Status code: 200

### TC010: Invalid HTTP Method (Negative)
- **Test Case Name**: Invalid HTTP Method Returns 200
- **Description**: Verify that unsupported HTTP methods return 200
- **Precondition**: API is accessible
- **Steps**:
  1. Send PATCH request to /posts/1
  2. Verify response status code is 200
- **Expected Result**:
  - Status code: 200

---

## Edge Cases

### TC011: Large Payload (Edge Case)
- **Test Case Name**: Handle Large Payload Successfully
- **Description**: Verify that API handles large payloads
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare post with very long title and body
  2. Send POST request to /posts with large payload
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created post

### TC012: Boundary Values (Edge Case)
- **Test Case Name**: Handle Boundary Values
- **Description**: Verify that API handles boundary values correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /posts/1 (first post)
  2. Send GET request to /posts/100 (last post)
  3. Verify both responses are successful
- **Expected Result**:
  - Both requests return status code 200
  - Responses contain valid post data

### TC013: Special Characters (Edge Case)
- **Test Case Name**: Handle Special Characters in Payload
- **Description**: Verify that API handles special characters correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare post with special characters in title and body
  2. Send POST request to /posts with special characters
  3. Verify response status code is 201
- **Expected Result**:
  - Status code: 201
  - Response contains created post with special characters preserved

### TC014: Empty Fields (Edge Case)
- **Test Case Name**: Handle Empty Fields
- **Description**: Verify that API handles empty fields correctly
- **Precondition**: API is accessible
- **Steps**:
  1. Prepare post with empty title field
  2. Send POST request to /posts with empty field
  3. Verify response behavior
- **Expected Result**:
  - Appropriate response (may be 201 or 400 depending on API behavior)

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

---

## Data-Driven Tests

### TC017: Data-Driven Post Creation
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

### TC018: Data-Driven User Creation
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

---

## Response Validation Tests

### TC019: Response Headers Validation
- **Test Case Name**: Validate Response Headers
- **Description**: Verify that API responses include correct headers
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /posts
  2. Verify Content-Type header is application/json
  3. Verify other relevant headers are present
- **Expected Result**:
  - Content-Type: application/json
  - Other headers as expected

### TC020: Response Schema Validation
- **Test Case Name**: Validate Response Schema
- **Description**: Verify that API responses match expected schema
- **Precondition**: API is accessible
- **Steps**:
  1. Send GET request to /posts/1
  2. Verify response contains required fields
  3. Verify field types are correct
- **Expected Result**:
  - Response contains all required fields
  - Field types match expected schema
