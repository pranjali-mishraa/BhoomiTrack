import { apiClient } from "../api/client";

import type {
  AcquisitionStatus,
  ApiResponse,
  GeoJsonFeatureCollection,
} from "../types/api";

// ==================== RESPONSE TYPES ====================

export interface GisAcquisitionSummary {
  totalAreaAcres: number;
  acquiredAreaAcres: number;
  pendingAreaAcres: number;
  acquisitionPercentage: number;
  statusBreakdown: Record<AcquisitionStatus | string, number>;
}

// ==================== PROJECT PARCELS GEOJSON ====================

export const getProjectParcelsGeoJson = async (
  projectId: number
): Promise<ApiResponse<GeoJsonFeatureCollection>> => {
  const response = await apiClient.get<
    ApiResponse<GeoJsonFeatureCollection>
  >(`/api/gis/projects/${projectId}/parcels`);

  return response.data;
};

// ==================== PROJECT GIS SUMMARY ====================

export const getProjectGisSummary = async (
  projectId: number
): Promise<ApiResponse<GisAcquisitionSummary>> => {
  const response = await apiClient.get<ApiResponse<GisAcquisitionSummary>>(
    `/api/gis/projects/${projectId}/summary`
  );

  return response.data;
};

// ==================== DISTRICT PARCELS ====================

export const getDistrictParcelsGeoJson = async (
  district: string
): Promise<ApiResponse<GeoJsonFeatureCollection>> => {
  const response = await apiClient.get<
    ApiResponse<GeoJsonFeatureCollection>
  >("/api/gis/parcels/district", {
    params: {
      district,
    },
  });

  return response.data;
};

// ==================== NEARBY PARCEL SEARCH ====================

export interface NearbyParcelParams {
  lat: number;
  lng: number;
  radiusKm: number;
}

export const getNearbyParcels = async ({
  lat,
  lng,
  radiusKm,
}: NearbyParcelParams): Promise<ApiResponse<GeoJsonFeatureCollection>> => {
  const response = await apiClient.get<
    ApiResponse<GeoJsonFeatureCollection>
  >("/api/gis/parcels/nearby", {
    params: {
      lat,
      lng,
      radiusKm,
    },
  });

  return response.data;
};