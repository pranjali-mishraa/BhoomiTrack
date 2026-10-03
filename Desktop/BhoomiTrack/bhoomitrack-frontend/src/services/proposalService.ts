import { apiClient } from "../api/client";

import type {
  ApiResponse,
  PageResponse,
  Proposal,
} from "../types/api";

// ==================== REQUEST TYPES ====================

export interface ProposalListParams {
  projectId?: number;
  state?: string;
  district?: string;
  status?: Proposal["status"];
  page?: number;
  size?: number;
}

export interface CreateProposalPayload {
  proposalNumber: string;
  projectId: number;
  projectName: string;
  landRequired: number;
  landUnit: string;
  villages: string;
  district: string;
  state: string;
  purpose: string;
  status: Proposal["status"];
  proposedTimelineMonths?: number;
  affectedFamiliesCount?: number;
  estimatedCompensation?: number;
  remarks?: string;
}

export interface UpdateProposalStatusPayload {
  status: Proposal["status"];
  remarks?: string;
}

// ==================== GET ALL PROPOSALS ====================

export const getProposals = async (
  params: ProposalListParams = {}
): Promise<ApiResponse<PageResponse<Proposal>>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Proposal>>>(
    "/api/proposals",
    {
      params,
    }
  );

  return response.data;
};

// ==================== GET PROPOSAL BY ID ====================

export const getProposalById = async (
  id: number
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.get<ApiResponse<Proposal>>(
    `/api/proposals/${id}`
  );

  return response.data;
};

// ==================== CREATE PROPOSAL ====================

export const createProposal = async (
  proposalData: CreateProposalPayload
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.post<ApiResponse<Proposal>>(
    "/api/proposals",
    proposalData
  );

  return response.data;
};

// ==================== UPDATE PROPOSAL ====================

export const updateProposal = async (
  id: number,
  proposalData: Partial<CreateProposalPayload>
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.put<ApiResponse<Proposal>>(
    `/api/proposals/${id}`,
    proposalData
  );

  return response.data;
};

// ==================== UPDATE PROPOSAL STATUS ====================

export const updateProposalStatus = async (
  id: number,
  statusData: UpdateProposalStatusPayload
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.patch<ApiResponse<Proposal>>(
    `/api/proposals/${id}/status`,
    statusData
  );

  return response.data;
};