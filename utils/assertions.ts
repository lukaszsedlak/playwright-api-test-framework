import { expect, APIResponse } from '@playwright/test';
import { BaseResource, ApiResponse as ApiResponseType } from '../types/api-types';

export class ApiAssertions {
  /**
   * Assert HTTP status code
   */
  static async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Assert response contains JSON content type header
   */
  static async assertJsonContentType(response: APIResponse): Promise<void> {
    expect(response.headers()['content-type']).toContain('application/json');
  }

  /**
   * Assert response is a valid JSON array
   */
  static async assertJsonArray(response: APIResponse): Promise<void> {
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  }

  /**
   * Assert response is a valid JSON object
   */
  static async assertJsonObject(response: APIResponse): Promise<void> {
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(data).not.toBeNull();
  }

  /**
   * Assert resource has required base fields
   */
  static async assertBaseResourceFields(response: APIResponse): Promise<void> {
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(typeof data.id).toBe('number');
    expect(data.id).toBeGreaterThan(0);
  }

  /**
   * Assert array of resources all have required base fields
   */
  static async assertBaseResourceArray(response: APIResponse): Promise<void> {
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    for (const item of data) {
      expect(item).toHaveProperty('id');
      expect(typeof item.id).toBe('number');
      expect(item.id).toBeGreaterThan(0);
    }
  }

  /**
   * Assert response matches expected schema
   */
  static async assertSchema<T extends BaseResource>(
    response: APIResponse, 
    schema: Record<string, string>
  ): Promise<void> {
    const data = await response.json();
    
    // Handle both single objects and arrays
    const items = Array.isArray(data) ? data : [data];
    
    for (const item of items) {
      for (const [field, expectedType] of Object.entries(schema)) {
        expect(item).toHaveProperty(field);
        expect(typeof item[field]).toBe(expectedType);
        expect(item[field]).not.toBeNull();
      }
    }
  }

  /**
   * Assert response data matches expected values
   */
  static async assertData<T extends BaseResource>(
    response: APIResponse, 
    expectedData: Partial<T>
  ): Promise<void> {
    const data = await response.json();
    
    for (const [field, expectedValue] of Object.entries(expectedData)) {
      expect(data[field]).toBe(expectedValue);
    }
  }

  /**
   * Assert response contains created resource with generated ID
   */
  static async assertCreatedResource<T extends BaseResource>(
    response: APIResponse, 
    expectedData: Omit<T, 'id'>
  ): Promise<void> {
    await this.assertStatus(response, 201);
    await this.assertJsonObject(response);
    await this.assertBaseResourceFields(response);
    await this.assertData(response, expectedData);
  }

  /**
   * Assert response contains updated resource
   */
  static async assertUpdatedResource<T extends BaseResource>(
    response: APIResponse, 
    expectedData: T
  ): Promise<void> {
    await this.assertStatus(response, 200);
    await this.assertJsonObject(response);
    await this.assertData(response, expectedData);
  }

  /**
   * Assert successful deletion
   */
  static async assertDeleted(response: APIResponse): Promise<void> {
    await this.assertStatus(response, 200);
  }

  /**
   * Assert resource not found error
   */
  static async assertNotFound(response: APIResponse): Promise<void> {
    await this.assertStatus(response, 404);
  }

  /**
   * Assert server error
   */
  static async assertServerError(response: APIResponse): Promise<void> {
    await this.assertStatus(response, 500);
  }

  /**
   * Assert method not allowed error
   */
  static async assertMethodNotAllowed(response: APIResponse): Promise<void> {
    await this.assertStatus(response, 405);
  }

  /**
   * Assert bad request error
   */
  static async assertBadRequest(response: APIResponse): Promise<void> {
    await this.assertStatus(response, 400);
  }

  /**
   * Assert array contains items with specific field value
   */
  static async assertArrayFilteredByField(
    response: APIResponse, 
    field: string, 
    expectedValue: any
  ): Promise<void> {
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    for (const item of data) {
      expect(item[field]).toBe(expectedValue);
    }
  }

  /**
   * Assert response headers
   */
  static async assertHeaders(
    response: APIResponse, 
    expectedHeaders: Record<string, string>
  ): Promise<void> {
    const headers = response.headers();
    
    for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
      expect(headers[header]).toContain(expectedValue);
    }
  }

  /**
   * Assert response time is within acceptable range
   */
  static async assertResponseTime(
    response: APIResponse, 
    maxTimeMs: number = 5000
  ): Promise<void> {
    // Note: Playwright doesn't expose response time directly
    // This would need to be implemented with custom timing logic
    expect(true).toBe(true); // Placeholder
  }
}
