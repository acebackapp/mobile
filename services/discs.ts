/**
 * Disc service - CRUD operations for disc management
 *
 * All API responses are validated at runtime using Zod schemas
 * to catch type mismatches early.
 */

import { apiRequest } from '@/services/baseService';
import { ApiErrorCode, isApiError } from '@/services/ApiError';
import {
  apiRequestValidated,
  discSchema,
  discArraySchema,
  type DiscResponse,
  type DiscArrayResponse,
} from '@/services/apiValidation';

// Re-export the Disc type from the schema for use in components
export type Disc = DiscResponse;

export interface CreateDiscData {
  name: string;
  brand?: string;
  weight?: number;
  color?: string;
}

export interface UpdateDiscData {
  name?: string;
  brand?: string;
  weight?: number;
  color?: string;
}

export interface PhotoData {
  uri: string;
  type: string;
}

export const discService = {
  /**
   * Get all discs for the current user
   * Validates response against discArraySchema
   */
  async getAll(): Promise<Disc[]> {
    return apiRequestValidated<DiscArrayResponse>(
      '/functions/v1/discs',
      {
        method: 'GET',
        operation: 'get-discs',
      },
      discArraySchema
    );
  },

  /**
   * Get a single disc by ID
   * Returns null if the disc is not found
   * Validates response against discSchema
   */
  async getById(id: string): Promise<Disc | null> {
    try {
      return await apiRequestValidated<DiscResponse>(
        `/functions/v1/discs/${id}`,
        {
          method: 'GET',
          operation: 'get-disc',
        },
        discSchema
      );
    } catch (error) {
      if (isApiError(error) && error.code === ApiErrorCode.NOT_FOUND) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new disc
   * Validates response against discSchema
   */
  async create(data: CreateDiscData): Promise<Disc> {
    return apiRequestValidated<DiscResponse>(
      '/functions/v1/discs',
      {
        method: 'POST',
        body: data,
        operation: 'create-disc',
      },
      discSchema
    );
  },

  /**
   * Update an existing disc
   * Validates response against discSchema
   */
  async update(id: string, data: UpdateDiscData): Promise<Disc> {
    return apiRequestValidated<DiscResponse>(
      `/functions/v1/discs/${id}`,
      {
        method: 'PATCH',
        body: data,
        operation: 'update-disc',
      },
      discSchema
    );
  },

  /**
   * Delete a disc
   * No response validation needed for DELETE
   */
  async delete(id: string): Promise<void> {
    await apiRequest(`/functions/v1/discs/${id}`, {
      method: 'DELETE',
      operation: 'delete-disc',
    });
  },

  /**
   * Link a QR code to a disc
   * Validates response against discSchema
   */
  async linkQrCode(discId: string, qrCodeId: string): Promise<Disc> {
    return apiRequestValidated<DiscResponse>(
      `/functions/v1/discs/${discId}/qr`,
      {
        method: 'POST',
        body: { qr_code_id: qrCodeId },
        operation: 'link-qr-code',
      },
      discSchema
    );
  },

  /**
   * Unlink a QR code from a disc
   * Validates response against discSchema
   */
  async unlinkQrCode(discId: string): Promise<Disc> {
    return apiRequestValidated<DiscResponse>(
      `/functions/v1/discs/${discId}/qr`,
      {
        method: 'DELETE',
        operation: 'unlink-qr-code',
      },
      discSchema
    );
  },

  /**
   * Upload a photo for a disc
   * Validates response against discSchema
   */
  async uploadPhoto(discId: string, photoData: PhotoData): Promise<Disc> {
    return apiRequestValidated<DiscResponse>(
      `/functions/v1/discs/${discId}/photo`,
      {
        method: 'POST',
        body: photoData,
        operation: 'upload-disc-photo',
      },
      discSchema
    );
  },
};
