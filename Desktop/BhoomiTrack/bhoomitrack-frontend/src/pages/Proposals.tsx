import { useEffect, useState } from "react";


import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import {
  approveProposal,
  getProposals,
  rejectProposal,
  returnProposal,
  submitProposal,
  type ProposalListParams,
} from "../services/proposalService";

import type {
  PageResponse,
  Proposal,
} from "../types/api";

const Proposals = () => {
  const [proposals, setProposals] =
    useState<PageResponse<Proposal> | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] =
    useState<ProposalListParams>({
      page: 0,
      size: 10,
    });

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProposals(filters);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setProposals(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load proposals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [filters]);

  const handleFilterChange = (
    key: keyof ProposalListParams,
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

  const handleAction = async (
    id: number,
    action: "submit" | "approve" | "return" | "reject"
  ) => {
    const confirmationMessages = {
      submit: "Submit this proposal for approval?",
      approve: "Approve this proposal?",
      return: "Return this proposal for correction?",
      reject: "Reject this proposal?",
    };

    const confirmed = window.confirm(
      confirmationMessages[action]
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setError(null);

      let response;

      switch (action) {
        case "submit":
          response = await submitProposal(id);
          break;

        case "approve":
          response = await approveProposal(id);
          break;

        case "return":
          response = await returnProposal(id);
          break;

        case "reject":
          response = await rejectProposal(id);
          break;
      }

      if (!response.success) {
        setError(response.message);
        return;
      }

      await loadProposals();
    } catch (err) {
      console.error(err);

      setError(
        `Unable to ${action} the proposal. Please try again.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proposals"
        description="Review and monitor land requisition proposals submitted for acquisition."
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
            label="State"
            value={filters.state ?? ""}
            placeholder="Enter state"
            onChange={(value) =>
              handleFilterChange("state", value)
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

          <FilterSelect
            label="Status"
            value={filters.status ?? ""}
            options={proposalStatuses}
            onChange={(value) =>
              handleFilterChange("status", value)
            }
          />
        </div>
      </SectionCard>

      {loading && (
        <LoadingState message="Loading proposals..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={loadProposals}
        />
      )}

      {!loading && !error && proposals && (
        <SectionCard
          title="Land Acquisition Proposals"
          description={`${proposals.page.totalElements} proposal(s) found`}
        >
          {proposals.content.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No proposals found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Proposal No.
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Land Required
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      District
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      State
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
                  {proposals.content.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#123b63]">
                        {proposal.proposalNumber}
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-800">
                          {proposal.projectName}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          Project ID: {proposal.projectId}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {proposal.landRequired}{" "}
                        {proposal.landUnit}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {proposal.district}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {proposal.state}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={proposal.status}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <ProposalActions
                          proposal={proposal}
                          loading={
                            actionLoading === proposal.id
                          }
                          onAction={handleAction}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {proposals.page.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Page {proposals.page.number + 1} of{" "}
                {proposals.page.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={proposals.page.number === 0}
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
                    proposals.page.number >=
                    proposals.page.totalPages - 1
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

interface ProposalActionsProps {
  proposal: Proposal;
  loading: boolean;
  onAction: (
    id: number,
    action:
      | "submit"
      | "approve"
      | "return"
      | "reject"
  ) => void;
}

const ProposalActions = ({
  proposal,
  loading,
  onAction,
}: ProposalActionsProps) => {
  if (loading) {
    return (
      <span className="text-xs text-slate-500">
        Processing...
      </span>
    );
  }

  switch (proposal.status) {
    case "DRAFT":
      return (
        <button
          type="button"
          onClick={() =>
            onAction(proposal.id, "submit")
          }
          className="border border-[#123b63] bg-white px-3 py-1.5 text-xs font-medium text-[#123b63] hover:bg-slate-50"
        >
          Submit
        </button>
      );

    case "SUBMITTED":
      return (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              onAction(proposal.id, "approve")
            }
            className="border border-green-600 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
          >
            Approve
          </button>

          <button
            type="button"
            onClick={() =>
              onAction(proposal.id, "return")
            }
            className="border border-amber-500 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
          >
            Return
          </button>

          <button
            type="button"
            onClick={() =>
              onAction(proposal.id, "reject")
            }
            className="border border-red-500 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Reject
          </button>
        </div>
      );

    case "RETURNED":
      return (
        <button
          type="button"
          onClick={() =>
            onAction(proposal.id, "submit")
          }
          className="border border-[#123b63] bg-white px-3 py-1.5 text-xs font-medium text-[#123b63] hover:bg-slate-50"
        >
          Resubmit
        </button>
      );

    default:
      return (
        <span className="text-xs text-slate-400">
          No actions available
        </span>
      );
  }
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

const proposalStatuses: Proposal["status"][] = [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "RETURNED",
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

export default Proposals;