import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import {
  createAward,
  getAwardById,
  getAwards,
  type Award,
  type CreateAwardPayload,
} from "../services/awardService";

const Awards = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [selectedAward, setSelectedAward] =
    useState<Award | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] =
    useState<CreateAwardPayload>({
      projectId: 0,
      parcelId: 0,
      awardNumber: "",
      awardDate: "",
      assessedAmount: 0,
      marketValue: 0,
      solatium: 0,
      additionalAmount: 0,
      competentAuthority: "",
      remarks: "",
    });

  const loadAwards = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAwards();

      if (!response.success) {
        setError(response.message);
        return;
      }

      setAwards(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load awards. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  const handleViewDetails = async (id: number) => {
    try {
      setDetailsLoading(true);
      setError(null);

      const response = await getAwardById(id);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setSelectedAward(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load award details. Please try again."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (form.projectId <= 0) {
      setError("Please enter a valid project ID.");
      return;
    }

    if (form.parcelId <= 0) {
      setError("Please enter a valid parcel ID.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await createAward(form);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setShowForm(false);

      resetForm();

      await loadAwards();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to create the award. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      projectId: 0,
      parcelId: 0,
      awardNumber: "",
      awardDate: "",
      assessedAmount: 0,
      marketValue: 0,
      solatium: 0,
      additionalAmount: 0,
      competentAuthority: "",
      remarks: "",
    });
  };

  const updateForm = (
    key: keyof CreateAwardPayload,
    value: string | number
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Awards"
        description="Maintain award records and monitor compensation amounts determined during land acquisition."
        actions={
          <button
            type="button"
            onClick={() =>
              setShowForm((current) => !current)
            }
            className="bg-[#123b63] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d2d4b]"
          >
            {showForm ? "Close Form" : "Create Award"}
          </button>
        }
      />

      {error && (
        <ErrorState
          message={error}
          onRetry={loadAwards}
        />
      )}

      {showForm && (
        <SectionCard
          title="Create Award"
          description="Enter the award details as recorded by the competent authority."
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <FormInput
                label="Project ID"
                type="number"
                value={String(form.projectId || "")}
                onChange={(value) =>
                  updateForm(
                    "projectId",
                    Number(value)
                  )
                }
                required
              />

              <FormInput
                label="Parcel ID"
                type="number"
                value={String(form.parcelId || "")}
                onChange={(value) =>
                  updateForm(
                    "parcelId",
                    Number(value)
                  )
                }
                required
              />

              <FormInput
                label="Award Number"
                value={form.awardNumber}
                placeholder="Enter award number"
                onChange={(value) =>
                  updateForm(
                    "awardNumber",
                    value
                  )
                }
                required
              />

              <FormInput
                label="Award Date"
                type="date"
                value={form.awardDate}
                onChange={(value) =>
                  updateForm(
                    "awardDate",
                    value
                  )
                }
                required
              />

              <FormInput
                label="Assessed Amount"
                type="number"
                value={String(
                  form.assessedAmount || ""
                )}
                onChange={(value) =>
                  updateForm(
                    "assessedAmount",
                    Number(value)
                  )
                }
                required
              />

              <FormInput
                label="Market Value"
                type="number"
                value={String(
                  form.marketValue || ""
                )}
                onChange={(value) =>
                  updateForm(
                    "marketValue",
                    Number(value)
                  )
                }
                required
              />

              <FormInput
                label="Solatium"
                type="number"
                value={String(
                  form.solatium || ""
                )}
                onChange={(value) =>
                  updateForm(
                    "solatium",
                    Number(value)
                  )
                }
                required
              />

              <FormInput
                label="Additional Amount"
                type="number"
                value={String(
                  form.additionalAmount || ""
                )}
                onChange={(value) =>
                  updateForm(
                    "additionalAmount",
                    Number(value)
                  )
                }
                required
              />

              <FormInput
                label="Competent Authority"
                value={
                  form.competentAuthority
                }
                placeholder="Authority / Officer"
                onChange={(value) =>
                  updateForm(
                    "competentAuthority",
                    value
                  )
                }
                required
              />
            </div>

            <FormTextarea
              label="Remarks"
              value={form.remarks ?? ""}
              placeholder="Additional remarks (optional)"
              onChange={(value) =>
                updateForm("remarks", value)
              }
            />

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#123b63] px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Creating..."
                  : "Create Award"}
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {loading ? (
        <LoadingState message="Loading awards..." />
      ) : (
        <SectionCard
          title="Award Register"
          description={`${awards.length} award(s) available`}
        >
          {awards.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No award records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Award
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Parcel
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Award Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Assessed Amount
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Market Value
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Solatium
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Authority
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {awards.map((award) => (
                    <tr
                      key={award.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-[#123b63]">
                          {award.awardNumber}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          ID: {award.id}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {award.projectId}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {award.parcelId}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(
                          award.awardDate
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {formatCurrency(
                          award.assessedAmount
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatCurrency(
                          award.marketValue
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatCurrency(
                          award.solatium
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {award.competentAuthority}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewDetails(
                              award.id
                            )
                          }
                          className="border border-[#123b63] bg-white px-3 py-1.5 text-xs font-medium text-[#123b63] hover:bg-slate-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {detailsLoading && (
        <LoadingState message="Loading award details..." />
      )}

      {selectedAward && !detailsLoading && (
        <SectionCard
          title="Award Details"
          actions={
            <button
              type="button"
              onClick={() =>
                setSelectedAward(null)
              }
              className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          }
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              label="Award Number"
              value={selectedAward.awardNumber}
            />

            <DetailItem
              label="Project ID"
              value={selectedAward.projectId}
            />

            <DetailItem
              label="Parcel ID"
              value={selectedAward.parcelId}
            />

            <DetailItem
              label="Award Date"
              value={formatDate(
                selectedAward.awardDate
              )}
            />

            <DetailItem
              label="Assessed Amount"
              value={formatCurrency(
                selectedAward.assessedAmount
              )}
            />

            <DetailItem
              label="Market Value"
              value={formatCurrency(
                selectedAward.marketValue
              )}
            />

            <DetailItem
              label="Solatium"
              value={formatCurrency(
                selectedAward.solatium
              )}
            />

            <DetailItem
              label="Additional Amount"
              value={formatCurrency(
                selectedAward.additionalAmount
              )}
            />

            <DetailItem
              label="Competent Authority"
              value={
                selectedAward.competentAuthority
              }
            />
          </div>

          {selectedAward.remarks && (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Remarks
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedAward.remarks}
              </p>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
};

interface FormInputProps {
  label: string;
  value: string;
  type?: "text" | "number" | "date";
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const FormInput = ({
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  onChange,
}: FormInputProps) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-red-600">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? 0 : undefined}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#123b63]"
      />
    </label>
  );
};

interface FormTextareaProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const FormTextarea = ({
  label,
  value,
  placeholder,
  onChange,
}: FormTextareaProps) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>

      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#123b63]"
      />
    </label>
  );
};

interface DetailItemProps {
  label: string;
  value: ReactNode;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default Awards;