import { apiClient } from "../api/client";

import type {
  ApiResponse,
  FamilyCategory,
  PaymentStatus,
} from "../types/api";

// ==================== TYPES ====================

export interface Compensation {
  id: number;
  projectId: number;
  parcelId: number;

  beneficiaryName: string;
  beneficiaryType: FamilyCategory;

  bankAccountNumberMasked: string;
  ifscCode: string;

  assessedAmount: number;
  approvedAmount?: number;

  paidAmount?: number;
  paymentDate?: string;

  transactionReference?: string;
  paymentMode?: string;

  paymentStatus: PaymentStatus;

  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompensationPayload {
  projectId: number;
  parcelId: number;

  beneficiaryName: string;
  beneficiaryType: FamilyCategory;

  bankAccountNumberMasked: string;
  ifscCode: string;

  assessedAmount: number;
  approvedAmount?: number;

  remarks?: string;
}

export interface MarkCompensationPaidPayload {
  paidAmount: number;
  paymentDate: string;
  transactionReference: string;
  paymentMode: string;
  remarks?: string;
}

// ==================== CREATE COMPENSATION ASSESSMENT ====================

export const createCompensation = async (
  compensationData: CreateCompensationPayload
): Promise<ApiResponse<Compensation>> => {
  const response = await apiClient.post<ApiResponse<Compensation>>(
    "/api/compensation",
    compensationData
  );

  return response.data;
};

// ==================== APPROVE COMPENSATION ====================

export const approveCompensation = async (
  id: number
): Promise<ApiResponse<Compensation>> => {
  const response = await apiClient.post<ApiResponse<Compensation>>(
    `/api/compensation/${id}/approve`
  );

  return response.data;
};

// ==================== MARK COMPENSATION AS PAID ====================

export const markCompensationPaid = async (
  id: number,
  paymentData: MarkCompensationPaidPayload
): Promise<ApiResponse<Compensation>> => {
  const response = await apiClient.post<ApiResponse<Compensation>>(
    `/api/compensation/${id}/mark-paid`,
    paymentData
  );

  return response.data;
};