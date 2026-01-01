/**
 * Service layer exports
 * Provides a clean API for making backend requests
 */

export { ApiError, ApiErrorCode, isApiError } from '@/services/ApiError';
export type { ApiErrorOptions } from '@/services/ApiError';

export { getSession, apiRequest, createApiError } from '@/services/baseService';
export type { ApiRequestOptions } from '@/services/baseService';

export { discService } from '@/services/discs';
export type {
  Disc,
  CreateDiscData,
  UpdateDiscData,
  PhotoData,
} from '@/services/discs';

export { recoveryService } from '@/services/recovery';
export type {
  Location,
  RecoveryEvent,
  MeetupData,
  RecoveryMessage,
} from '@/services/recovery';

// API Validation exports
export {
  ValidationError,
  isValidationError,
  validateApiResponse,
  apiRequestValidated,
  // Schemas
  discSchema,
  discArraySchema,
  recoveryEventSchema,
  recoveryEventArraySchema,
  recoveryMessageSchema,
  recoveryMessageArraySchema,
  userProfileSchema,
  locationSchema,
} from '@/services/apiValidation';
export type {
  DiscResponse,
  DiscArrayResponse,
  RecoveryEventResponse,
  RecoveryEventArrayResponse,
  RecoveryMessageResponse,
  RecoveryMessageArrayResponse,
  UserProfileResponse,
  LocationResponse,
} from '@/services/apiValidation';
