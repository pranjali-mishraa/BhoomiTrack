import { apiClient } from "../api/client";
import type { ApiResponse } from "../types/api";

export type DocumentType =
  | "SECTION_11_GAZETTE"
  | "SECTION_19_GAZETTE"
  | "PANCHNAMA"
  | "VALUATION_REPORT"
  | "COURT_ORDER"
  | "NOC"
  | "OTHER";

export type DocumentEntityType =
  | "PROJECT"
  | "PROPOSAL"
  | "LAND_PARCEL"
  | "NOTIFICATION"
  | "AWARD"
  | "COMPENSATION"
  | "POSSESSION"
  | "RR_FAMILY";

export interface DocumentRecord {
  id: number;
  fileName?: string;
  documentType?: DocumentType;
  entityType?: DocumentEntityType;
  entityId?: number;
  description?: string;
  uploadedBy?: string;
  createdAt?: string;
}

export interface UploadDocumentPayload {
  file: File;
  documentType: DocumentType;
  entityType: DocumentEntityType;
  entityId: number;
  description?: string;
  uploadedBy?: string;
}

export const uploadDocument = async (
  documentData: UploadDocumentPayload
): Promise<ApiResponse<DocumentRecord>> => {
  const formData = new FormData();

  formData.append("file", documentData.file);
  formData.append("documentType", documentData.documentType);
  formData.append("entityType", documentData.entityType);
  formData.append("entityId", String(documentData.entityId));

  if (documentData.description) {
    formData.append("description", documentData.description);
  }

  if (documentData.uploadedBy) {
    formData.append("uploadedBy", documentData.uploadedBy);
  }

  const response = await apiClient.post<ApiResponse<DocumentRecord>>(
    "/api/documents/upload",
    formData
  );

  return response.data;
};

export const downloadDocument = async (
  id: number
): Promise<Blob> => {
  const response = await apiClient.get<Blob>(
    `/api/documents/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const getDocumentsByEntity = async (
  entityType: DocumentEntityType,
  entityId: number
): Promise<ApiResponse<DocumentRecord[]>> => {
  const response = await apiClient.get<ApiResponse<DocumentRecord[]>>(
    `/api/documents/entity/${entityType}/${entityId}`
  );

  return response.data;
};