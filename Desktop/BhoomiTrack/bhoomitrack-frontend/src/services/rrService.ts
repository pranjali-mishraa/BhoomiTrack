import { apiClient } from "../api/client";

import type {
  ApiResponse,
  FamilyCategory,
  RehabilitationStatus,
} from "../types/api";

export interface CreateRrFamilyPayload {
  projectId: number;
  familyHeadName: string;
  familyMemberCount: number;
  category: FamilyCategory;
  socialCategory: string;
  village: string;
  district: string;
  state: string;
  entitlementDetails: string;
  assistanceAmount: number;
  alternativeSiteAllotted: boolean;
  alternativeSiteDetails?: string;
  remarks?: string;
}

export interface UpdateRrStatusPayload {
  status: RehabilitationStatus;
  assistanceProvided: number;
  remarks?: string;
}

export const createRrFamily = async (
  familyData: CreateRrFamilyPayload
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    "/api/rr/families",
    familyData
  );

  return response.data;
};

export const updateRrFamilyStatus = async (
  id: number,
  statusData: UpdateRrStatusPayload
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `/api/rr/families/${id}/status`,
    statusData
  );

  return response.data;
};