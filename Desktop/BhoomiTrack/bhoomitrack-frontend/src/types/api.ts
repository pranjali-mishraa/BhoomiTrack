// ==================== ENVELOPES ====================

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
  }
  
  export interface PageResponse<T> {
    content: T[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  }

  // ==================== ENUMS ====================

export type ProjectType =
| "HIGHWAY"
| "RAILWAY"
| "METRO"
| "AIRPORT"
| "PORT"
| "INDUSTRIAL_CORRIDOR"
| "SMART_CITY"
| "RENEWABLE_ENERGY"
| "IRRIGATION"
| "DEFENSE"
| "OTHER";

export type ProjectStatus =
| "DRAFT"
| "PROPOSAL_SUBMITTED"
| "PROPOSAL_APPROVED"
| "SURVEY_IN_PROGRESS"
| "SECTION_11_ISSUED"
| "SECTION_19_ISSUED"
| "AWARD_DECLARED"
| "COMPENSATION_IN_PROGRESS"
| "POSSESSION_IN_PROGRESS"
| "IN_PROGRESS"
| "COMPLETED"
| "CANCELLED";

export type LandType =
| "PRIVATE"
| "GOVERNMENT"
| "COMMUNITY"
| "FOREST"
| "TRIBAL";

export type AcquisitionStatus =
| "IDENTIFIED"
| "FIELD_VERIFIED"
| "SECTION_11_NOTIFIED"
| "SECTION_19_DECLARED"
| "AWARD_DECLARED"
| "COMPENSATION_PAID"
| "POSSESSION_TAKEN"
| "ACQUIRED"
| "DISPUTED";

export type VerificationStatus =
| "PENDING"
| "VERIFIED"
| "REJECTED"
| "DISPUTED";

export type NotificationType =
| "SECTION_11_PRELIMINARY"
| "SECTION_19_FINAL_DECLARATION"
| "SECTION_21_PUBLIC_NOTICE"
| "SECTION_40_URGENCY_CLAUSE";

export type PaymentStatus =
| "PENDING"
| "APPROVED"
| "DISBURSED"
| "FAILED";

export type FamilyCategory =
| "DISPLACED"
| "AFFECTED"
| "TITLE_HOLDER"
| "TENANT"
| "AGRICULTURAL_LABOURER";

export type RehabilitationStatus =
| "IDENTIFIED"
| "ELIGIBLE"
| "ASSISTANCE_DISBURSED"
| "REHABILITATED"
| "COMPLETED";


// ==================== ENTITIES ====================

export interface Project {
    id: number;
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
    createdAt: string;
    updatedAt: string;
  }

  export interface Proposal {
    id: number;
    proposalNumber: string;
    projectId: number;
    projectName: string;
    landRequired: number;
    landUnit: string;
    villages: string;
    district: string;
    state: string;
    purpose: string;
    status:
      | "DRAFT"
      | "SUBMITTED"
      | "APPROVED"
      | "REJECTED"
      | "RETURNED";
    proposedTimelineMonths?: number;
    affectedFamiliesCount?: number;
    estimatedCompensation?: number;
    remarks?: string;
    createdAt: string;
  }

  export interface LandParcel {
    id: number;
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
    acquisitionStatus: AcquisitionStatus;
    verificationStatus: VerificationStatus;
    verifiedBy?: string;
    verifiedAt?: string;
  }
  