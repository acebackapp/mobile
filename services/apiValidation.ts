/**
 * API Response Runtime Validation
 *
 * Provides Zod schemas for validating API responses at runtime,
 * catching type mismatches early and logging validation errors to Sentry.
 */

import { z } from 'zod';
import { captureError } from '@/lib/sentry';
import { apiRequest, type ApiRequestOptions } from '@/services/baseService';

// =============================================================================
// Validation Error
// =============================================================================

/**
 * Custom error class for API response validation failures.
 * Contains detailed information about what fields failed validation.
 */
export class ValidationError extends Error {
  readonly operation: string;
  readonly issues: z.ZodIssue[];
  readonly rawData: unknown;

  constructor(
    message: string,
    operation: string,
    issues: z.ZodIssue[],
    rawData: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
    this.operation = operation;
    this.issues = issues;
    this.rawData = rawData;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  /**
   * Serialize the error to a JSON-compatible object
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      operation: this.operation,
      issues: this.issues,
    };
  }
}

/**
 * Type guard to check if an unknown value is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// =============================================================================
// Base Schemas
// =============================================================================

/**
 * Location schema for GPS coordinates
 */
export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type LocationResponse = z.infer<typeof locationSchema>;

// =============================================================================
// Disc Schemas
// =============================================================================

/**
 * Schema for validating Disc API responses
 */
export const discSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  weight: z.number().optional(),
  color: z.string().optional(),
  photo_url: z.string().optional(),
  qr_code_id: z.string().nullable().optional(),
  owner_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DiscResponse = z.infer<typeof discSchema>;

/**
 * Schema for validating array of Disc responses
 */
export const discArraySchema = z.array(discSchema);

export type DiscArrayResponse = z.infer<typeof discArraySchema>;

// =============================================================================
// Recovery Event Schemas
// =============================================================================

/**
 * Schema for validating RecoveryEvent API responses
 */
export const recoveryEventSchema = z.object({
  id: z.string(),
  disc_id: z.string(),
  status: z.string(),
  finder_id: z.string().optional(),
  owner_id: z.string(),
  location: locationSchema.optional(),
  scheduled_time: z.string().optional(),
  message: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type RecoveryEventResponse = z.infer<typeof recoveryEventSchema>;

/**
 * Schema for validating array of RecoveryEvent responses
 */
export const recoveryEventArraySchema = z.array(recoveryEventSchema);

export type RecoveryEventArrayResponse = z.infer<
  typeof recoveryEventArraySchema
>;

// =============================================================================
// Recovery Message Schemas
// =============================================================================

/**
 * Schema for validating RecoveryMessage API responses
 */
export const recoveryMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  sender_id: z.string(),
  created_at: z.string(),
});

export type RecoveryMessageResponse = z.infer<typeof recoveryMessageSchema>;

/**
 * Schema for validating array of RecoveryMessage responses
 */
export const recoveryMessageArraySchema = z.array(recoveryMessageSchema);

export type RecoveryMessageArrayResponse = z.infer<
  typeof recoveryMessageArraySchema
>;

// =============================================================================
// User Profile Schemas
// =============================================================================

/**
 * Schema for validating UserProfile API responses
 */
export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  display_name: z.string().optional(),
  avatar_url: z.string().optional(),
  phone: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfileResponse = z.infer<typeof userProfileSchema>;

// =============================================================================
// Validation Helper
// =============================================================================

/**
 * Validate an API response against a Zod schema.
 *
 * On validation failure:
 * - Logs the error to Sentry with context
 * - Throws a ValidationError with detailed information
 *
 * @param data - The raw API response data
 * @param schema - The Zod schema to validate against
 * @param operation - Name of the API operation (for error context)
 * @returns The parsed and typed data
 * @throws {ValidationError} When validation fails
 */
export function validateApiResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  operation: string
): T {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  // Log validation error to Sentry with context
  const validationError = new ValidationError(
    `API response validation failed for operation: ${operation}`,
    operation,
    result.error.issues,
    data
  );

  // Capture to Sentry with additional context
  captureError(validationError, {
    operation,
    issues: result.error.issues,
    // Don't include full rawData to avoid PII in logs
    // but include the structure for debugging
    responseShape:
      data !== null && typeof data === 'object'
        ? Object.keys(data as Record<string, unknown>)
        : typeof data,
  });

  throw validationError;
}

// =============================================================================
// Validated API Request
// =============================================================================

/**
 * Make an API request with runtime response validation.
 *
 * This is a wrapper around apiRequest that validates the response
 * against a Zod schema before returning it.
 *
 * @param endpoint - The API endpoint
 * @param options - Request options (method, body, etc.)
 * @param schema - Zod schema to validate the response against
 * @returns Promise resolving to the validated response data
 * @throws {ApiError} When the API request fails
 * @throws {ValidationError} When response validation fails
 */
export async function apiRequestValidated<T>(
  endpoint: string,
  options: ApiRequestOptions,
  schema: z.ZodSchema<T>
): Promise<T> {
  const data = await apiRequest<unknown>(endpoint, options);
  return validateApiResponse(data, schema, options.operation ?? endpoint);
}
