import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import {
  getProjects,
  type ProjectListParams,
} from "../services/projectService";

import type {
  PageResponse,
  Project,
  ProjectStatus,
  ProjectType,
} from "../types/api";

const Projects = () => {
  const [projects, setProjects] =
    useState<PageResponse<Project> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProjectListParams>({
    page: 0,
    size: 10,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProjects(filters);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setProjects(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const handleFilterChange = (
    key: keyof ProjectListParams,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value || undefined,
      page: 0,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="View and monitor registered land acquisition projects."
        actions={
          <button
            type="button"
            className="bg-[#123b63] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0d2d4b]"
          >
            Register Project
          </button>
        }
      />

      <SectionCard title="Search & Filters">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterInput
            label="State"
            value={filters.state ?? ""}
            onChange={(value) =>
              handleFilterChange("state", value)
            }
            placeholder="Enter state"
          />

          <FilterInput
            label="District"
            value={filters.district ?? ""}
            onChange={(value) =>
              handleFilterChange("district", value)
            }
            placeholder="Enter district"
          />

          <FilterSelect
            label="Status"
            value={filters.status ?? ""}
            onChange={(value) =>
              handleFilterChange("status", value)
            }
            options={projectStatuses}
          />

          <FilterSelect
            label="Project Type"
            value={filters.projectType ?? ""}
            onChange={(value) =>
              handleFilterChange("projectType", value)
            }
            options={projectTypes}
          />
        </div>
      </SectionCard>

      {loading && (
        <LoadingState message="Loading projects..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={loadProjects}
        />
      )}

      {!loading && !error && projects && (
        <SectionCard
          title="Registered Projects"
          description={`${projects.page.totalElements} project(s) found`}
        >
          {projects.content.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No projects found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project Code
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project Name
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      State
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      District
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Land Requirement
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {projects.content.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-[#123b63] hover:underline"
                        >
                          {project.projectCode}
                        </Link>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {project.projectName}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatLabel(project.projectType)}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {project.state}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {project.district}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {project.estimatedLandRequirement}{" "}
                        {project.requiredLandUnit}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={project.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {projects.page.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Page {projects.page.number + 1} of{" "}
                {projects.page.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={projects.page.number === 0}
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
                    projects.page.number >=
                    projects.page.totalPages - 1
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

interface FilterInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const FilterInput = ({
  label,
  value,
  placeholder,
  onChange,
}: FilterInputProps) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>

      <input
        type="text"
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

const projectStatuses: ProjectStatus[] = [
  "DRAFT",
  "PROPOSAL_SUBMITTED",
  "PROPOSAL_APPROVED",
  "SURVEY_IN_PROGRESS",
  "SECTION_11_ISSUED",
  "SECTION_19_ISSUED",
  "AWARD_DECLARED",
  "COMPENSATION_IN_PROGRESS",
  "POSSESSION_IN_PROGRESS",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const projectTypes: ProjectType[] = [
  "HIGHWAY",
  "RAILWAY",
  "METRO",
  "AIRPORT",
  "PORT",
  "INDUSTRIAL_CORRIDOR",
  "SMART_CITY",
  "RENEWABLE_ENERGY",
  "IRRIGATION",
  "DEFENSE",
  "OTHER",
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

export default Projects;