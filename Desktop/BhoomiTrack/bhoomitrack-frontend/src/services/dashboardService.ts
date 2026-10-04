import { apiClient } from "../api/client";
import type { ApiResponse } from "../types/api";

export interface NationalDashboard {
  totalProjects: number;
  totalHectaresRequired: number;
  totalHectaresAcquired: number;
  totalBudgetOutlay: number;
  totalCompensationDisbursed: number;
  totalDisplacedFamilies: number;
  totalRehabilitatedFamilies: number;
  delayedProjectCount: number;
}

export interface ProjectDashboard {
  projectId: number;
  percentageLandAcquired: number;
  percentageCompensationDisbursed: number;
  percentagePossession: number;
  parcelBreakdown: Record<string, number>;
  milestoneDelays: number;
}

export interface StateDashboard {
  [key: string]: unknown;
}

export interface DistrictDashboard {
  [key: string]: unknown;
}

export const getNationalDashboard = async (): Promise<
  ApiResponse<NationalDashboard>
> => {
  const response = await apiClient.get<ApiResponse<NationalDashboard>>(
    "/api/dashboard/national"
  );

  return response.data;
};

export const getProjectDashboard = async (
  projectId: number
): Promise<ApiResponse<ProjectDashboard>> => {
  const response = await apiClient.get<ApiResponse<ProjectDashboard>>(
    `/api/dashboard/project/${projectId}`
  );

  return response.data;
};

export const getStateDashboard = async (
  stateName: string
): Promise<ApiResponse<StateDashboard>> => {
  const response = await apiClient.get<ApiResponse<StateDashboard>>(
    `/api/dashboard/state/${encodeURIComponent(stateName)}`
  );

  return response.data;
};

export const getDistrictDashboard = async (
  districtName: string
): Promise<ApiResponse<DistrictDashboard>> => {
  const response = await apiClient.get<ApiResponse<DistrictDashboard>>(
    `/api/dashboard/district/${encodeURIComponent(districtName)}`
  );

  return response.data;
};