import { apiClient } from "../api/client";

import type {
  ApiResponse,
  NotificationType,
} from "../types/api";

// ==================== TYPES ====================

export interface Notification {
  id: number;
  projectId: number;
  notificationType: NotificationType;
  notificationNumber: string;
  issueDate: string;
  publicationDate: string;
  gazetteNumber: string;
  description: string;
  remarks?: string;
  createdAt?: string;
}

export interface CreateNotificationPayload {
  projectId: number;
  notificationType: NotificationType;
  notificationNumber: string;
  issueDate: string;
  publicationDate: string;
  gazetteNumber: string;
  description: string;
  remarks?: string;
}

// ==================== CREATE NOTIFICATION ====================

export const createNotification = async (
  notificationData: CreateNotificationPayload
): Promise<ApiResponse<Notification>> => {
  const response = await apiClient.post<ApiResponse<Notification>>(
    "/api/notifications",
    notificationData
  );

  return response.data;
};

// ==================== GET ALL NOTIFICATIONS ====================

export const getNotifications = async (): Promise<
  ApiResponse<Notification[]>
> => {
  const response = await apiClient.get<ApiResponse<Notification[]>>(
    "/api/notifications"
  );

  return response.data;
};

// ==================== GET NOTIFICATION BY ID ====================

export const getNotificationById = async (
  id: number
): Promise<ApiResponse<Notification>> => {
  const response = await apiClient.get<ApiResponse<Notification>>(
    `/api/notifications/${id}`
  );

  return response.data;
};
