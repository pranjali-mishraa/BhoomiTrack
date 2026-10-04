import { apiClient } from "../api/client";
import type { ApiResponse, PageResponse } from "../types/api";

export interface AuditRecord {
  id: number;
  entityName: string;
  entityId: number;
  action?: string;
  oldState?: string;
  newState?: string;
  performedBy?: string;
  remarks?: string;
  timestamp?: string;
}

export interface AuditListParams {
  page?: number;
  size?: number;
}

export const getAuditTrail = async (
  params: AuditListParams = {}
): Promise<ApiResponse<PageResponse<AuditRecord>>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<AuditRecord>>
  >("/api/audit", {
    params,
  });

  return response.data;
};

export const getEntityAuditHistory = async (
  entityName: string,
  entityId: number
): Promise<ApiResponse<AuditRecord[]>> => {
  const response = await apiClient.get<ApiResponse<AuditRecord[]>>(
    `/api/audit/${encodeURIComponent(entityName)}/${entityId}`
  );

  return response.data;
};