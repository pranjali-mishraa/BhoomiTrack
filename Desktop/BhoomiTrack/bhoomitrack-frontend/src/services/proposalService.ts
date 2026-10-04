import { apiClient } from "../api/client";

import type {
  ApiResponse,
  PageResponse,
  Proposal,
} from "../types/api";

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

export interface UpdateProposalPayload {
  proposalNumber?: string;
  projectId?: number;
  projectName?: string;
  landRequired?: number;
  landUnit?: string;
  villages?: string;
  district?: string;
  state?: string;
  purpose?: string;
  status?: Proposal["status"];
  proposedTimelineMonths?: number;
  affectedFamiliesCount?: number;
  estimatedCompensation?: number;
  remarks?: string;
}

export interface ProposalActionPayload {
  remarks?: string;
}

export interface ProposalHistoryRecord {
  id: number;
  proposalId?: number;
  action?: string;
  fromStatus?: Proposal["status"];
  toStatus?: Proposal["status"];
  remarks?: string;
  performedBy?: string;
  timestamp?: string;
}

export const getProposals = async (
  params: ProposalListParams = {}
): Promise<ApiResponse<PageResponse<Proposal>>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<Proposal>>
  >("/api/proposals", {
    params,
  });

  return response.data;
};

export const getProposalById = async (
  id: number
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.get<ApiResponse<Proposal>>(
    `/api/proposals/${id}`
  );

  return response.data;
};

export const createProposal = async (
  proposalData: CreateProposalPayload
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.post<ApiResponse<Proposal>>(
    "/api/proposals",
    proposalData
  );

  return response.data;
};

export const updateProposal = async (
  id: number,
  proposalData: UpdateProposalPayload
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.put<ApiResponse<Proposal>>(
    `/api/proposals/${id}`,
    proposalData
  );

  return response.data;
};

export const submitProposal = async (
  id: number,
  actionData: ProposalActionPayload = {}
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.post<ApiResponse<Proposal>>(
    `/api/proposals/${id}/submit`,
    actionData
  );

  return response.data;
};

export const approveProposal = async (
  id: number,
  actionData: ProposalActionPayload = {}
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.post<ApiResponse<Proposal>>(
    `/api/proposals/${id}/approve`,
    actionData
  );

  return response.data;
};

export const returnProposal = async (
  id: number,
  actionData: ProposalActionPayload = {}
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.post<ApiResponse<Proposal>>(
    `/api/proposals/${id}/return`,
    actionData
  );

  return response.data;
};

export const rejectProposal = async (
  id: number,
  actionData: ProposalActionPayload = {}
): Promise<ApiResponse<Proposal>> => {
  const response = await apiClient.post<ApiResponse<Proposal>>(
    `/api/proposals/${id}/reject`,
    actionData
  );

  return response.data;
};

export const getProposalHistory = async (
  id: number
): Promise<ApiResponse<ProposalHistoryRecord[]>> => {
  const response = await apiClient.get<
    ApiResponse<ProposalHistoryRecord[]>
  >(`/api/proposals/${id}/history`);

  return response.data;
};