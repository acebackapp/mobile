/**
 * Recovery service - operations for disc recovery flow
 *
 * All API responses are validated at runtime using Zod schemas
 * to catch type mismatches early.
 */

import { ApiErrorCode, isApiError } from '@/services/ApiError';
import {
  apiRequestValidated,
  recoveryEventSchema,
  recoveryEventArraySchema,
  recoveryMessageSchema,
  recoveryMessageArraySchema,
  type LocationResponse,
  type RecoveryEventResponse,
  type RecoveryEventArrayResponse,
  type RecoveryMessageResponse,
  type RecoveryMessageArrayResponse,
} from '@/services/apiValidation';

// Re-export types from the schema for use in components
export type Location = LocationResponse;
export type RecoveryEvent = RecoveryEventResponse;
export type RecoveryMessage = RecoveryMessageResponse;

export interface MeetupData {
  location: Location;
  scheduled_time: string;
  message?: string;
}

export const recoveryService = {
  /**
   * Get recovery event details by ID
   * Returns null if the event is not found
   * Validates response against recoveryEventSchema
   */
  async getDetails(eventId: string): Promise<RecoveryEvent | null> {
    try {
      return await apiRequestValidated<RecoveryEventResponse>(
        `/functions/v1/recovery/${eventId}`,
        {
          method: 'GET',
          operation: 'get-recovery-details',
        },
        recoveryEventSchema
      );
    } catch (error) {
      if (isApiError(error) && error.code === ApiErrorCode.NOT_FOUND) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get all active recovery events for the current user
   * Validates response against recoveryEventArraySchema
   */
  async getActiveEvents(): Promise<RecoveryEvent[]> {
    return apiRequestValidated<RecoveryEventArrayResponse>(
      '/functions/v1/recovery/active',
      {
        method: 'GET',
        operation: 'get-active-recovery-events',
      },
      recoveryEventArraySchema
    );
  },

  /**
   * Report a disc as found via QR code scan
   * Validates response against recoveryEventSchema
   */
  async reportFound(
    qrCodeId: string,
    location?: Location
  ): Promise<RecoveryEvent> {
    const body: { qr_code_id: string; location?: Location } = {
      qr_code_id: qrCodeId,
    };
    if (location) {
      body.location = location;
    }

    return apiRequestValidated<RecoveryEventResponse>(
      '/functions/v1/recovery/report',
      {
        method: 'POST',
        body,
        operation: 'report-disc-found',
      },
      recoveryEventSchema
    );
  },

  /**
   * Propose a meetup for disc recovery
   * Validates response against recoveryEventSchema
   */
  async proposeMeetup(
    eventId: string,
    meetupData: MeetupData
  ): Promise<RecoveryEvent> {
    return apiRequestValidated<RecoveryEventResponse>(
      `/functions/v1/recovery/${eventId}/meetup`,
      {
        method: 'POST',
        body: meetupData,
        operation: 'propose-meetup',
      },
      recoveryEventSchema
    );
  },

  /**
   * Accept a proposed meetup
   * Validates response against recoveryEventSchema
   */
  async acceptMeetup(eventId: string): Promise<RecoveryEvent> {
    return apiRequestValidated<RecoveryEventResponse>(
      `/functions/v1/recovery/${eventId}/accept`,
      {
        method: 'POST',
        operation: 'accept-meetup',
      },
      recoveryEventSchema
    );
  },

  /**
   * Decline a proposed meetup
   * Validates response against recoveryEventSchema
   */
  async declineMeetup(
    eventId: string,
    reason?: string
  ): Promise<RecoveryEvent> {
    const body: { reason?: string } = {};
    if (reason) {
      body.reason = reason;
    }

    return apiRequestValidated<RecoveryEventResponse>(
      `/functions/v1/recovery/${eventId}/decline`,
      {
        method: 'POST',
        body,
        operation: 'decline-meetup',
      },
      recoveryEventSchema
    );
  },

  /**
   * Mark the recovery as complete
   * Validates response against recoveryEventSchema
   */
  async completeRecovery(eventId: string): Promise<RecoveryEvent> {
    return apiRequestValidated<RecoveryEventResponse>(
      `/functions/v1/recovery/${eventId}/complete`,
      {
        method: 'POST',
        operation: 'complete-recovery',
      },
      recoveryEventSchema
    );
  },

  /**
   * Cancel the recovery event
   * Validates response against recoveryEventSchema
   */
  async cancelRecovery(
    eventId: string,
    reason?: string
  ): Promise<RecoveryEvent> {
    const body: { reason?: string } = {};
    if (reason) {
      body.reason = reason;
    }

    return apiRequestValidated<RecoveryEventResponse>(
      `/functions/v1/recovery/${eventId}/cancel`,
      {
        method: 'POST',
        body,
        operation: 'cancel-recovery',
      },
      recoveryEventSchema
    );
  },

  /**
   * Send a message in the recovery chat
   * Validates response against recoveryMessageSchema
   */
  async sendMessage(
    eventId: string,
    content: string
  ): Promise<RecoveryMessage> {
    return apiRequestValidated<RecoveryMessageResponse>(
      `/functions/v1/recovery/${eventId}/messages`,
      {
        method: 'POST',
        body: { content },
        operation: 'send-recovery-message',
      },
      recoveryMessageSchema
    );
  },

  /**
   * Get all messages for a recovery event
   * Validates response against recoveryMessageArraySchema
   */
  async getMessages(eventId: string): Promise<RecoveryMessage[]> {
    return apiRequestValidated<RecoveryMessageArrayResponse>(
      `/functions/v1/recovery/${eventId}/messages`,
      {
        method: 'GET',
        operation: 'get-recovery-messages',
      },
      recoveryMessageArraySchema
    );
  },
};
