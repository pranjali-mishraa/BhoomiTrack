import { useEffect, useState } from "react";

import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import {
  getNationalDashboard,
  type NationalDashboard as NationalDashboardData,
} from "../services/dashboardService";

const NationalDashboard = () => {
  const [dashboard, setDashboard] =
    useState<NationalDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getNationalDashboard();

      if (!response.success) {
        setError(response.message);
        return;
      }

      setDashboard(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load the national dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="National Dashboard"
          description="National overview of land acquisition progress."
        />

        <LoadingState message="Loading national dashboard..." />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="National Dashboard"
          description="National overview of land acquisition progress."
        />

        <ErrorState
          message={
            error ?? "National dashboard data is unavailable."
          }
          onRetry={loadDashboard}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="National Dashboard"
        description="National overview of land acquisition progress."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric
          label="Total Projects"
          value={dashboard.totalProjects}
        />

        <DashboardMetric
          label="Hectares Required"
          value={formatNumber(dashboard.totalHectaresRequired)}
        />

        <DashboardMetric
          label="Hectares Acquired"
          value={formatNumber(dashboard.totalHectaresAcquired)}
        />

        <DashboardMetric
          label="Delayed Projects"
          value={dashboard.delayedProjectCount}
          alert
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="Land Acquisition">
          <div className="space-y-5">
            <MetricRow
              label="Total land required"
              value={`${formatNumber(
                dashboard.totalHectaresRequired
              )} ha`}
            />

            <MetricRow
              label="Total land acquired"
              value={`${formatNumber(
                dashboard.totalHectaresAcquired
              )} ha`}
            />
          </div>
        </SectionCard>

        <SectionCard title="Financial Overview">
          <div className="space-y-5">
            <MetricRow
              label="Budget outlay"
              value={formatCurrency(
                dashboard.totalBudgetOutlay
              )}
            />

            <MetricRow
              label="Compensation disbursed"
              value={formatCurrency(
                dashboard.totalCompensationDisbursed
              )}
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Displacement & Rehabilitation">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <MetricRow
            label="Displaced families"
            value={formatNumber(
              dashboard.totalDisplacedFamilies
            )}
          />

          <MetricRow
            label="Rehabilitated families"
            value={formatNumber(
              dashboard.totalRehabilitatedFamilies
            )}
          />
        </div>
      </SectionCard>
    </div>
  );
};

interface DashboardMetricProps {
  label: string;
  value: string | number;
  alert?: boolean;
}

const DashboardMetric = ({
  label,
  value,
  alert = false,
}: DashboardMetricProps) => {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${
          alert ? "text-red-700" : "text-[#123b63]"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

interface MetricRowProps {
  label: string;
  value: string | number;
}

const MetricRow = ({ label, value }: MetricRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <strong className="text-sm font-semibold text-slate-900">
        {value}
      </strong>
    </div>
  );
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default NationalDashboard;