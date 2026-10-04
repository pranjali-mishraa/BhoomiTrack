import { apiClient } from "../api/client";
import type { ApiResponse } from "../types/api";

export type ReportData = Record<string, unknown>;

export const getStateWiseReport = async (): Promise<
  ApiResponse<ReportData>
> => {
  const response = await apiClient.get<ApiResponse<ReportData>>(
    "/api/reports/state-wise"
  );

  return response.data;
};

export const getDistrictWiseReport = async (): Promise<
  ApiResponse<ReportData>
> => {
  const response = await apiClient.get<ApiResponse<ReportData>>(
    "/api/reports/district-wise"
  );

  return response.data;
};

export const getCompensationReport = async (): Promise<
  ApiResponse<ReportData>
> => {
  const response = await apiClient.get<ApiResponse<ReportData>>(
    "/api/reports/compensation"
  );

  return response.data;
};

export const getPossessionReport = async (): Promise<
  ApiResponse<ReportData>
> => {
  const response = await apiClient.get<ApiResponse<ReportData>>(
    "/api/reports/possession"
  );

  return response.data;
};

export const getRrReport = async (): Promise<ApiResponse<ReportData>> => {
  const response = await apiClient.get<ApiResponse<ReportData>>(
    "/api/reports/rr"
  );

  return response.data;
};

export const getDelayReport = async (): Promise<
  ApiResponse<ReportData>
> => {
  const response = await apiClient.get<ApiResponse<ReportData>>(
    "/api/reports/delays"
  );

  return response.data;
};
