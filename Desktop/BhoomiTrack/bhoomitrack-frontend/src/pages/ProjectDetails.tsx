import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import { getProjectById } from "../services/projectService";

import type { Project } from "../types/api";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = async () => {
    if (!id) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      setError("Invalid project ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getProjectById(projectId);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setProject(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load project details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Project Details"
          description="View detailed information about the selected project."
        />

        <LoadingState message="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Project Details"
          description="View detailed information about the selected project."
        />

        <ErrorState
          message={
            error ?? "Project details are unavailable."
          }
          onRetry={loadProject}
        />

        <Link
          to="/projects"
          className="inline-block border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.projectName}
        description={`Project Code: ${project.projectCode}`}
        actions={
          <Link
            to="/projects"
            className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Projects
          </Link>
        }
      />

      <SectionCard title="Project Overview">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem
            label="Project Code"
            value={project.projectCode}
          />

          <DetailItem
            label="Project Type"
            value={formatLabel(project.projectType)}
          />

          <DetailItem
            label="Status"
            value={<StatusBadge status={project.status} />}
          />

          <DetailItem
            label="Implementing Agency"
            value={project.implementingAgency}
          />

          <DetailItem
            label="Ministry / Department"
            value={project.ministryDepartment || "—"}
          />

          <DetailItem
            label="State"
            value={project.state}
          />

          <DetailItem
            label="District"
            value={project.district}
          />

          <DetailItem
            label="Land Requirement"
            value={`${project.estimatedLandRequirement} ${project.requiredLandUnit}`}
          />

          <DetailItem
            label="Project Start Date"
            value={formatDate(project.projectStartDate)}
          />

          <DetailItem
            label="Expected Completion"
            value={formatDate(project.expectedCompletionDate)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Project Description">
        <p className="text-sm leading-6 text-slate-600">
          {project.description || "No description provided."}
        </p>
      </SectionCard>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: ReactNode;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div className="border-b border-slate-100 pb-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 text-sm font-medium text-slate-800">
        {value}
      </div>
    </div>
  );
};

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

const formatDate = (value?: string) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default ProjectDetails;