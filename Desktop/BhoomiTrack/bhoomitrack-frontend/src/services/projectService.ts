import { apiClient } from "../api/client";

import type {
  ApiResponse,
  PageResponse,
  Project,
  ProjectStatus,
  ProjectType,
} from "../types/api";

// ==================== REQUEST TYPES ====================

export interface ProjectListParams {
  state?: string;
  district?: string;
  status?: ProjectStatus;
  projectType?: ProjectType;
  page?: number;
  size?: number;
}

export interface CreateProjectPayload {
  projectCode: string;
  projectName: string;
  projectType: ProjectType;
  description?: string;
  implementingAgency: string;
  ministryDepartment?: string;
  state: string;
  district: string;
  estimatedLandRequirement: number;
  requiredLandUnit: string;
  projectStartDate?: string;
  expectedCompletionDate?: string;
  status: ProjectStatus;
}

export interface UpdateProjectStatusPayload {
  status: ProjectStatus;
  remarks?: string;
}

// ==================== GET ALL PROJECTS ====================

export const getProjects = async (
  params: ProjectListParams = {}
): Promise<ApiResponse<PageResponse<Project>>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Project>>>(
    "/api/projects",
    {
      params,
    }
  );

  return response.data;
};

// ==================== GET PROJECT BY ID ====================

export const getProjectById = async (
  id: number
): Promise<ApiResponse<Project>> => {
  const response = await apiClient.get<ApiResponse<Project>>(
    `/api/projects/${id}`
  );

  return response.data;
};

// ==================== CREATE PROJECT ====================

export const createProject = async (
  projectData: CreateProjectPayload
): Promise<ApiResponse<Project>> => {
  const response = await apiClient.post<ApiResponse<Project>>(
    "/api/projects",
    projectData
  );

  return response.data;
};

// ==================== UPDATE PROJECT ====================

export const updateProject = async (
  id: number,
  projectData: Partial<CreateProjectPayload>
): Promise<ApiResponse<Project>> => {
  const response = await apiClient.put<ApiResponse<Project>>(
    `/api/projects/${id}`,
    projectData
  );

  return response.data;
};

// ==================== UPDATE PROJECT STATUS ====================

export const updateProjectStatus = async (
  id: number,
  statusData: UpdateProjectStatusPayload
): Promise<ApiResponse<Project>> => {
  const response = await apiClient.patch<ApiResponse<Project>>(
    `/api/projects/${id}/status`,
    statusData
  );

  return response.data;
};