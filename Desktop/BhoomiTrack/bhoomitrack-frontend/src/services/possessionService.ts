import { apiClient } from "../api/client";

import type {
  AcquisitionStatus,
  ApiResponse,
} from "../types/api";

// ==================== TYPES ====================

export interface Possession {
  id: number;

  projectId: number;
  parcelId: number;

  possessionDate: string;
  possessionOfficer: string;
  inspectionReference: string;

  status: AcquisitionStatus;

  remarks?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePossessionPayload {
  projectId: number;
  parcelId: number;

  possessionDate: string;
  possessionOfficer: string;
  inspectionReference: string;

  remarks?: string;
}

export interface UpdatePossessionStatusPayload {
  status: AcquisitionStatus;
  possessionDate: string;
  remarks?: string;
}

// ==================== SCHEDULE POSSESSION ====================

export const createPossession = async (
  possessionData: CreatePossessionPayload
): Promise<ApiResponse<Possession>> => {
  const response = await apiClient.post<ApiResponse<Possession>>(
    "/api/possession",
    possessionData
  );

  return response.data;
};

// ==================== MARK POSSESSION TAKEN ====================

export const updatePossessionStatus = async (
  id: number,
  statusData: UpdatePossessionStatusPayload
): Promise<ApiResponse<Possession>> => {
  const response = await apiClient.patch<ApiResponse<Possession>>(
    `/api/possession/${id}/status`,
    statusData
  );

  return response.data;
};