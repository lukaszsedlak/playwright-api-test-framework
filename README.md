# Playwright API Test Framework

A lightweight, maintainable API automation framework built with Node.js and Playwright for testing the JSONPlaceholder public API.

## 🎯 Objective

This framework demonstrates comprehensive API testing capabilities including:
- Positive and negative test scenarios
- Edge case testing
- Data-driven testing
- Error handling and validation
- Automated test reporting

## 🚀 Features

- **Comprehensive Test Coverage**: 20+ test cases covering positive, negative, and edge scenarios
- **Data-Driven Testing**: External JSON test data files for scalable testing
- **Multiple Reporters**: HTML, JSON, and console output
- **Error Handling**: Proper validation of HTTP status codes and error responses
- **Schema Validation**: Response structure and data type validation
- **CI/CD Ready**: Configured for continuous integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lukaszsedlak/playwright-api-test-framework.git
   cd playwright-api-test-framework
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (optional, for UI testing):
   ```bash
   npm run install:browsers
   ```

## 🏃‍♂️ Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests with detailed output
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### View Test Reports
```bash
# Open HTML report
npm run report
```

## 📁 Project Structure

```
playwright-api-test-framework/
├── tests/                          # Test files
│   ├── posts.spec.ts              # Posts endpoint tests
│   ├── comments.spec.ts           # Comments endpoint tests
│   ├── albums.spec.ts             # Albums endpoint tests
│   ├── photos.spec.ts             # Photos endpoint tests
│   ├── todos.spec.ts              # Todos endpoint tests
│   └── users.spec.ts              # Users endpoint tests
├── test-data/                      # External test data
│   ├── posts.json                 # Test data for posts
│   ├── comments.json              # Test data for comments
│   ├── albums.json                # Test data for albums
│   ├── photos.json                # Test data for photos
│   ├── todos.json                 # Test data for todos
│   └── users.json                 # Test data for users
├── docs/                          # Documentation
│   └── test-cases.md              # Detailed test case documentation
├── playwright-report/             # HTML test reports
├── test-results/                  # JSON test results
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # This file
```

## 🧪 Test Categories

### 1. Positive Scenarios
- ✅ GET requests (all resources, by ID)
- ✅ POST requests (create new resources)
- ✅ PUT requests (update existing resources)
- ✅ DELETE requests (remove resources)
- ✅ Query parameter filtering (by userId, postId, albumId, completed status)
- ✅ Response validation (status codes, headers, schema)

### 2. Negative Scenarios
- ❌ Invalid resource IDs (404 errors)
- ❌ Missing required fields
- ❌ Unsupported HTTP methods (405 errors)
- ❌ Malformed requests

### 3. Edge Cases
- 🔄 Large payloads
- 🔄 Boundary values
- 🔄 Special characters
- 🔄 Empty fields
- 🔄 Invalid URL formats (photos)
- 🔄 Boolean edge cases (todos)

### 4. Data-Driven Tests
- 📊 Multiple test scenarios using external JSON files
- 📊 Scalable test data management
- 📊 6 different resource types with unique data structures

## 📊 Test Data Structure

### Posts Test Data (`test-data/posts.json`)
```json
[
  {
    "title": "Test Post Title",
    "body": "Test Post Body",
    "userId": 1
  }
]
```

### Comments Test Data (`test-data/comments.json`)
```json
[
  {
    "postId": 1,
    "name": "Test Comment",
    "email": "test@example.com",
    "body": "This is a test comment"
  }
]
```

### Albums Test Data (`test-data/albums.json`)
```json
[
  {
    "userId": 1,
    "title": "Test Album"
  }
]
```

### Photos Test Data (`test-data/photos.json`)
```json
[
  {
    "albumId": 1,
    "title": "Test Photo",
    "url": "https://via.placeholder.com/600/92c952",
    "thumbnailUrl": "https://via.placeholder.com/150/92c952"
  }
]
```

### Todos Test Data (`test-data/todos.json`)
```json
[
  {
    "userId": 1,
    "title": "Test Todo",
    "completed": false
  }
]
```

### Users Test Data (`test-data/users.json`)
```json
[
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org"
  }
]
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Base URL**: `https://jsonplaceholder.typicode.com`
- **Reporters**: HTML, JSON, and console output
- **Timeout**: 30 seconds for tests, 10 seconds for expectations
- **Headers**: Default JSON content-type headers

### Environment Variables
The framework is configured to work with the JSONPlaceholder API out of the box. For different environments, you can modify the `baseURL` in `playwright.config.ts`.

## 📈 Test Reports

### HTML Report
- Interactive test results
- Screenshots and traces (if applicable)
- Test execution timeline
- Failed test details

### JSON Report
- Machine-readable test results
- Located in `test-results/results.json`
- Suitable for CI/CD integration

### Console Output
- Real-time test execution status
- Detailed error messages
- Test summary

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Bitbucket Pipelines Example
```yaml
pipelines:
  default:
    - step:
        name: API Tests
        image: node:18
        caches:
          - node
        script:
          - npm ci
          - npm test
        artifacts:
          - playwright-report/**
```

## 📋 Test Cases Documentation

Detailed test case documentation is available in [`docs/test-cases.md`](docs/test-cases.md), including:
- Test case names and descriptions
- Preconditions and steps
- Expected results
- Test categories (Positive, Negative, Edge Cases)

## 🔍 API Endpoints Tested

### Posts Endpoint (`/posts`)
- `GET /posts` - Get all posts
- `GET /posts/{id}` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post

### Comments Endpoint (`/comments`)
- `GET /comments` - Get all comments
- `GET /comments/{id}` - Get comment by ID
- `GET /comments?postId={id}` - Get comments by post ID
- `POST /comments` - Create new comment
- `PUT /comments/{id}` - Update comment
- `DELETE /comments/{id}` - Delete comment

### Albums Endpoint (`/albums`)
- `GET /albums` - Get all albums
- `GET /albums/{id}` - Get album by ID
- `GET /albums?userId={id}` - Get albums by user ID
- `POST /albums` - Create new album
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Delete album

### Photos Endpoint (`/photos`)
- `GET /photos` - Get all photos
- `GET /photos/{id}` - Get photo by ID
- `GET /photos?albumId={id}` - Get photos by album ID
- `POST /photos` - Create new photo
- `PUT /photos/{id}` - Update photo
- `DELETE /photos/{id}` - Delete photo

### Todos Endpoint (`/todos`)
- `GET /todos` - Get all todos
- `GET /todos/{id}` - Get todo by ID
- `GET /todos?userId={id}` - Get todos by user ID
- `GET /todos?completed={boolean}` - Get todos by completion status
- `POST /todos` - Create new todo
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

### Users Endpoint (`/users`)
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

## ⚠️ Assumptions and Limitations

### Assumptions
1. **JSONPlaceholder API**: The framework is designed for the JSONPlaceholder API
2. **HTTP Status Codes**: Standard REST API status codes are expected
3. **JSON Responses**: All responses are expected to be JSON format
4. **No Authentication**: The API doesn't require authentication

### Known Limitations
1. **Mock API**: JSONPlaceholder is a mock API, so actual persistence doesn't occur
2. **Limited Validation**: The mock API doesn't validate required fields strictly
3. **No Rate Limiting**: The mock API doesn't implement rate limiting
4. **Fixed Data**: The API returns predefined data, not dynamic responses
5. **Non-Standard Error Responses**: Some error scenarios return different status codes than expected:
   - PUT requests to non-existent resources return 500 instead of 404
   - DELETE requests to non-existent resources return 200 instead of 404
   - Unsupported HTTP methods (like PATCH) return 200 instead of 405

### Notes
- Some negative test cases may behave differently with the mock API compared to real APIs
- The framework is designed to be easily adaptable for real APIs with proper validation
- Test data can be easily modified in the `test-data/` directory


## 📞 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Framework Version**: 1.0.0  
**Last Updated**: 2024  
**Target API**: JSONPlaceholder (https://jsonplaceholder.typicode.com)
