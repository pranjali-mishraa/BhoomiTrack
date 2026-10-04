import { useEffect, useState } from "react";

import PageHeader from "../components/layout/PageHeader";
import SectionCard from "../components/common/SectionCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import StatusBadge from "../components/common/StatusBadge";

import {
  createNotification,
  getNotificationById,
  getNotifications,
  type CreateNotificationPayload,
  type Notification,
} from "../services/notificationService";

import type { NotificationType } from "../types/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] =
    useState<CreateNotificationPayload>({
      projectId: 0,
      notificationType:
        "SECTION_11_PRELIMINARY",
      notificationNumber: "",
      issueDate: "",
      publicationDate: "",
      gazetteNumber: "",
      description: "",
      remarks: "",
    });

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getNotifications();

      if (!response.success) {
        setError(response.message);
        return;
      }

      setNotifications(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleViewDetails = async (id: number) => {
    try {
      setDetailsLoading(true);
      setError(null);

      const response =
        await getNotificationById(id);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setSelectedNotification(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load notification details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.projectId || form.projectId <= 0) {
      setError("Please enter a valid project ID.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response =
        await createNotification(form);

      if (!response.success) {
        setError(response.message);
        return;
      }

      setShowForm(false);

      setForm({
        projectId: 0,
        notificationType:
          "SECTION_11_PRELIMINARY",
        notificationNumber: "",
        issueDate: "",
        publicationDate: "",
        gazetteNumber: "",
        description: "",
        remarks: "",
      });

      await loadNotifications();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to publish the notification. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (
    key: keyof CreateNotificationPayload,
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
        title="Statutory Notifications"
        description="Manage Section 11, Section 19 and other statutory land acquisition notifications."
        actions={
          <button
            type="button"
            onClick={() =>
              setShowForm((current) => !current)
            }
            className="bg-[#123b63] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d2d4b]"
          >
            {showForm
              ? "Close Form"
              : "Publish Notification"}
          </button>
        }
      />

      {error && (
        <ErrorState
          message={error}
          onRetry={loadNotifications}
        />
      )}

      {showForm && (
        <SectionCard
          title="Publish Statutory Notification"
          description="Enter the notification details as recorded in the official gazette."
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

              <FormSelect
                label="Notification Type"
                value={form.notificationType}
                options={notificationTypes}
                onChange={(value) =>
                  updateForm(
                    "notificationType",
                    value as NotificationType
                  )
                }
              />

              <FormInput
                label="Notification Number"
                value={form.notificationNumber}
                onChange={(value) =>
                  updateForm(
                    "notificationNumber",
                    value
                  )
                }
                placeholder="e.g. SEC11-GZ-2026-089"
                required
              />

              <FormInput
                label="Issue Date"
                type="date"
                value={form.issueDate}
                onChange={(value) =>
                  updateForm("issueDate", value)
                }
                required
              />

              <FormInput
                label="Publication Date"
                type="date"
                value={form.publicationDate}
                onChange={(value) =>
                  updateForm(
                    "publicationDate",
                    value
                  )
                }
                required
              />

              <FormInput
                label="Gazette Number"
                value={form.gazetteNumber}
                onChange={(value) =>
                  updateForm(
                    "gazetteNumber",
                    value
                  )
                }
                placeholder="Official gazette number"
                required
              />
            </div>

            <FormTextarea
              label="Description"
              value={form.description}
              onChange={(value) =>
                updateForm("description", value)
              }
              placeholder="Describe the statutory notification..."
              required
            />

            <FormTextarea
              label="Remarks"
              value={form.remarks ?? ""}
              onChange={(value) =>
                updateForm("remarks", value)
              }
              placeholder="Additional remarks (optional)"
            />

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
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
                  ? "Publishing..."
                  : "Publish Notification"}
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {loading ? (
        <LoadingState message="Loading statutory notifications..." />
      ) : (
        <SectionCard
          title="Notification Register"
          description={`${notifications.length} notification(s) available`}
        >
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No statutory notifications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Notification
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Issue Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Publication Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Gazette No.
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {notifications.map(
                    (notification) => (
                      <tr
                        key={notification.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-[#123b63]">
                            {
                              notification.notificationNumber
                            }
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            ID: {notification.id}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {notification.projectId}
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge
                            status={
                              notification.notificationType
                            }
                          />
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatDate(
                            notification.issueDate
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatDate(
                            notification.publicationDate
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {notification.gazetteNumber}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewDetails(
                                notification.id
                              )
                            }
                            className="border border-[#123b63] bg-white px-3 py-1.5 text-xs font-medium text-[#123b63] hover:bg-slate-50"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {detailsLoading && (
        <LoadingState message="Loading notification details..." />
      )}

      {selectedNotification &&
        !detailsLoading && (
          <SectionCard
            title="Notification Details"
            actions={
              <button
                type="button"
                onClick={() =>
                  setSelectedNotification(null)
                }
                className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            }
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              <DetailItem
                label="Notification Number"
                value={
                  selectedNotification.notificationNumber
                }
              />

              <DetailItem
                label="Project ID"
                value={
                  selectedNotification.projectId
                }
              />

              <DetailItem
                label="Notification Type"
                value={
                  <StatusBadge
                    status={
                      selectedNotification.notificationType
                    }
                  />
                }
              />

              <DetailItem
                label="Issue Date"
                value={formatDate(
                  selectedNotification.issueDate
                )}
              />

              <DetailItem
                label="Publication Date"
                value={formatDate(
                  selectedNotification.publicationDate
                )}
              />

              <DetailItem
                label="Gazette Number"
                value={
                  selectedNotification.gazetteNumber
                }
              />
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedNotification.description}
              </p>
            </div>

            {selectedNotification.remarks && (
              <div className="mt-5 border-t border-slate-200 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Remarks
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedNotification.remarks}
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
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#123b63]"
      />
    </label>
  );
};

interface FormSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

const FormSelect = ({
  label,
  value,
  options,
  onChange,
}: FormSelectProps) => {
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
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
};

interface FormTextareaProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const FormTextarea = ({
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: FormTextareaProps) => {
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

      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        required={required}
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
  value: React.ReactNode;
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

const notificationTypes: NotificationType[] = [
  "SECTION_11_PRELIMINARY",
  "SECTION_19_FINAL_DECLARATION",
  "SECTION_21_PUBLIC_NOTICE",
  "SECTION_40_URGENCY_CLAUSE",
];

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
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

export default Notifications;