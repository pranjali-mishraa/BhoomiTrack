import { apiClient } from "../api/client";
import type { ApiResponse } from "../types/api";

export type MilestoneStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED";

export interface LifecycleMilestone {
  id: number;
  milestoneName: string;
  plannedDate: string;
  actualDate?: string;
  delayDays: number;
  status: MilestoneStatus;
}

export const initializeProjectLifecycle = async (
  projectId: number
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    `/api/projects/${projectId}/milestones/initialize-lifecycle`
  );

  return response.data;
};

export const getProjectMilestones = async (
  projectId: number
): Promise<ApiResponse<LifecycleMilestone[]>> => {
  const response = await apiClient.get<ApiResponse<LifecycleMilestone[]>>(
    `/api/projects/${projectId}/milestones`
  );

  return response.data;
};