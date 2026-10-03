import { apiClient } from "../api/client";

import type {
  AcquisitionStatus,
  ApiResponse,
  LandParcel,
  LandType,
  PageResponse,
  VerificationStatus,
} from "../types/api";

// ==================== REQUEST TYPES ====================

export interface LandParcelListParams {
  projectId?: number;
  district?: string;
  status?: AcquisitionStatus;
  village?: string;
  page?: number;
  size?: number;
}

export interface CreateLandParcelPayload {
  projectId: number;
  parcelNumber: string;
  surveyNumber: string;
  khasraNumber?: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  area: number;
  areaUnit: string;
  landType: LandType;
  ownerName: string;
  ownerContact?: string;
  ownerAadhaarMasked?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

export interface VerifyLandParcelPayload {
  verificationStatus: VerificationStatus;
  verifiedBy: string;
  remarks?: string;
}

export interface UpdateLandParcelStatusPayload {
  status: AcquisitionStatus;
  remarks?: string;
}

// ==================== GET ALL LAND PARCELS ====================

export const getLandParcels = async (
  params: LandParcelListParams = {}
): Promise<ApiResponse<PageResponse<LandParcel>>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<LandParcel>>
  >("/api/land-parcels", {
    params,
  });

  return response.data;
};

// ==================== REGISTER LAND PARCEL ====================

export const createLandParcel = async (
  parcelData: CreateLandParcelPayload
): Promise<ApiResponse<LandParcel>> => {
  const response = await apiClient.post<ApiResponse<LandParcel>>(
    "/api/land-parcels",
    parcelData
  );

  return response.data;
};

// ==================== VERIFY LAND PARCEL ====================

export const verifyLandParcel = async (
  id: number,
  verificationData: VerifyLandParcelPayload
): Promise<ApiResponse<LandParcel>> => {
  const response = await apiClient.patch<ApiResponse<LandParcel>>(
    `/api/land-parcels/${id}/verify`,
    verificationData
  );

  return response.data;
};

// ==================== UPDATE ACQUISITION STATUS ====================

export const updateLandParcelStatus = async (
  id: number,
  statusData: UpdateLandParcelStatusPayload
): Promise<ApiResponse<LandParcel>> => {
  const response = await apiClient.patch<ApiResponse<LandParcel>>(
    `/api/land-parcels/${id}/status`,
    statusData
  );

  return response.data;
};