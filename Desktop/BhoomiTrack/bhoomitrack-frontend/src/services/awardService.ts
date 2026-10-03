import { apiClient } from "../api/client";

import type { ApiResponse } from "../types/api";

// ==================== TYPES ====================

export interface Award {
  id: number;
  projectId: number;
  parcelId: number;
  awardNumber: string;
  awardDate: string;
  assessedAmount: number;
  marketValue: number;
  solatium: number;
  additionalAmount: number;
  competentAuthority: string;
  remarks?: string;
  createdAt?: string;
}

export interface CreateAwardPayload {
  projectId: number;
  parcelId: number;
  awardNumber: string;
  awardDate: string;
  assessedAmount: number;
  marketValue: number;
  solatium: number;
  additionalAmount: number;
  competentAuthority: string;
  remarks?: string;
}

// ==================== DECLARE AWARD ====================

export const createAward = async (
  awardData: CreateAwardPayload
): Promise<ApiResponse<Award>> => {
  const response = await apiClient.post<ApiResponse<Award>>(
    "/api/awards",
    awardData
  );

  return response.data;
};

// ==================== GET ALL AWARDS ====================

export const getAwards = async (): Promise<ApiResponse<Award[]>> => {
  const response = await apiClient.get<ApiResponse<Award[]>>(
    "/api/awards"
  );

  return response.data;
};

// ==================== GET AWARD BY ID ====================

export const getAwardById = async (
  id: number
): Promise<ApiResponse<Award>> => {
  const response = await apiClient.get<ApiResponse<Award>>(
    `/api/awards/${id}`
  );

  return response.data;
};