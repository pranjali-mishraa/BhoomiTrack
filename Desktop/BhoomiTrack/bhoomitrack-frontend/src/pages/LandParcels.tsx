import { useEffect, useState } from "react";

import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import {
  getLandParcels,
  updateLandParcelStatus,
  verifyLandParcel,
  type LandParcelListParams,
} from "../services/landParcelService";

import type {
  AcquisitionStatus,
  LandParcel,
  PageResponse,
  VerificationStatus,
} from "../types/api";

const LandParcels = () => {
  const [parcels, setParcels] =
    useState<PageResponse<LandParcel> | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] =
    useState<LandParcelListParams>({
      page: 0,
      size: 10,
    });

  const loadParcels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getLandParcels(filters);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setParcels(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load land parcels. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParcels();
  }, [filters]);

  const handleFilterChange = (
    key: keyof LandParcelListParams,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]:
        key === "projectId" && value
          ? Number(value)
          : value || undefined,
      page: 0,
    }));
  };

  const handleVerify = async (parcel: LandParcel) => {
    const verificationStatus = window.prompt(
      "Enter verification status: VERIFIED, REJECTED, or DISPUTED",
      "VERIFIED"
    );

    if (!verificationStatus) {
      return;
    }

    const normalizedStatus =
      verificationStatus.toUpperCase() as VerificationStatus;

    if (
      !["VERIFIED", "REJECTED", "DISPUTED"].includes(
        normalizedStatus
      )
    ) {
      window.alert(
        "Invalid verification status."
      );
      return;
    }

    const verifiedBy = window.prompt(
      "Enter verifying officer name:"
    );

    if (!verifiedBy) {
      return;
    }

    const remarks =
      window.prompt("Remarks (optional):") ?? "";

    try {
      setActionLoading(parcel.id);
      setError(null);

      const response = await verifyLandParcel(
        parcel.id,
        {
          verificationStatus: normalizedStatus,
          verifiedBy,
          remarks,
        }
      );

      if (!response.success) {
        setError(response.message);
        return;
      }

      await loadParcels();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to verify the land parcel. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (
    parcel: LandParcel
  ) => {
    const status = window.prompt(
      `Enter acquisition status:\n\n${acquisitionStatuses.join(
        ", "
      )}`,
      parcel.acquisitionStatus
    );

    if (!status) {
      return;
    }

    const normalizedStatus =
      status.toUpperCase() as AcquisitionStatus;

    if (
      !acquisitionStatuses.includes(normalizedStatus)
    ) {
      window.alert(
        "Invalid acquisition status."
      );
      return;
    }

    const remarks =
      window.prompt("Remarks (optional):") ?? "";

    try {
      setActionLoading(parcel.id);
      setError(null);

      const response =
        await updateLandParcelStatus(
          parcel.id,
          {
            status: normalizedStatus,
            remarks,
          }
        );

      if (!response.success) {
        setError(response.message);
        return;
      }

      await loadParcels();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to update the parcel status. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Land Parcels"
        description="Monitor identified land parcels, field verification and acquisition progress."
      />

      <SectionCard title="Search & Filters">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterInput
            label="Project ID"
            type="number"
            value={
              filters.projectId !== undefined
                ? String(filters.projectId)
                : ""
            }
            placeholder="Enter project ID"
            onChange={(value) =>
              handleFilterChange("projectId", value)
            }
          />

          <FilterInput
            label="District"
            value={filters.district ?? ""}
            placeholder="Enter district"
            onChange={(value) =>
              handleFilterChange("district", value)
            }
          />

          <FilterInput
            label="Village"
            value={filters.village ?? ""}
            placeholder="Enter village"
            onChange={(value) =>
              handleFilterChange("village", value)
            }
          />

          <FilterSelect
            label="Acquisition Status"
            value={filters.status ?? ""}
            options={acquisitionStatuses}
            onChange={(value) =>
              handleFilterChange("status", value)
            }
          />
        </div>
      </SectionCard>

      {loading && (
        <LoadingState message="Loading land parcels..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={loadParcels}
        />
      )}

      {!loading && !error && parcels && (
        <SectionCard
          title="Land Parcel Register"
          description={`${parcels.page.totalElements} parcel(s) found`}
        >
          {parcels.content.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No land parcels found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Parcel
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Survey / Khasra
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Village
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      District
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Area
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Land Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {parcels.content.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
  <div className="text-sm font-semibold text-[#123b63]">
    {parcel.parcelNumber}
  </div>
</td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        <div>
                          {parcel.surveyNumber}
                        </div>

                        {parcel.khasraNumber && (
                          <div className="mt-1 text-xs text-slate-400">
                            Khasra:{" "}
                            {parcel.khasraNumber}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {parcel.village}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {parcel.district}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {parcel.area} {parcel.areaUnit}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatLabel(parcel.landType)}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {parcel.ownerName}

                        {parcel.ownerContact && (
                          <div className="mt-1 text-xs text-slate-400">
                            {parcel.ownerContact}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={parcel.acquisitionStatus}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <ParcelActions
                          parcel={parcel}
                          loading={
                            actionLoading === parcel.id
                          }
                          onVerify={handleVerify}
                          onStatusUpdate={
                            handleStatusUpdate
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {parcels.page.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Page {parcels.page.number + 1} of{" "}
                {parcels.page.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={parcels.page.number === 0}
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      page: Math.max(
                        0,
                        (current.page ?? 0) - 1
                      ),
                    }))
                  }
                  className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    parcels.page.number >=
                    parcels.page.totalPages - 1
                  }
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      page: (current.page ?? 0) + 1,
                    }))
                  }
                  className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
};

interface ParcelActionsProps {
  parcel: LandParcel;
  loading: boolean;
  onVerify: (parcel: LandParcel) => void;
  onStatusUpdate: (parcel: LandParcel) => void;
}

const ParcelActions = ({
  parcel,
  loading,
  onVerify,
  onStatusUpdate,
}: ParcelActionsProps) => {
  if (loading) {
    return (
      <span className="text-xs text-slate-500">
        Processing...
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onVerify(parcel)}
        className="border border-[#123b63] bg-white px-3 py-1.5 text-xs font-medium text-[#123b63] hover:bg-slate-50"
      >
        Verify
      </button>

      <button
        type="button"
        onClick={() => onStatusUpdate(parcel)}
        className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Update Status
      </button>
    </div>
  );
};

interface FilterInputProps {
  label: string;
  value: string;
  type?: "text" | "number";
  placeholder?: string;
  onChange: (value: string) => void;
}

const FilterInput = ({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
}: FilterInputProps) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#123b63]"
      />
    </label>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#123b63]"
      >
        <option value="">All</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
};

const acquisitionStatuses: AcquisitionStatus[] = [
  "IDENTIFIED",
  "FIELD_VERIFIED",
  "SECTION_11_NOTIFIED",
  "SECTION_19_DECLARED",
  "AWARD_DECLARED",
  "COMPENSATION_PAID",
  "POSSESSION_TAKEN",
  "ACQUIRED",
  "DISPUTED",
];

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export default LandParcels;