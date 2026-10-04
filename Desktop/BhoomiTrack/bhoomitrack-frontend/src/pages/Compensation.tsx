import { useState } from "react";
import type { FormEvent } from "react";

import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import ErrorState from "../components/common/ErrorState";

import {
  approveCompensation,
  createCompensation,
  markCompensationPaid,
} from "../services/compensationService";

import type {
  FamilyCategory,
  PaymentStatus,
} from "../types/api";

import type {
  Compensation,
  CreateCompensationPayload,
  MarkCompensationPaidPayload,
} from "../services/compensationService";

const familyCategories: FamilyCategory[] = [
  "DISPLACED",
  "AFFECTED",
  "TITLE_HOLDER",
  "TENANT",
  "AGRICULTURAL_LABOURER",
];

const paymentModes = [
  "RTGS",
  "NEFT",
  "BANK_TRANSFER",
];

const CompensationPage = () => {
  const [records, setRecords] = useState<Compensation[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<Compensation | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateCompensationPayload>({
    projectId: 0,
    parcelId: 0,
    beneficiaryName: "",
    beneficiaryType: "TITLE_HOLDER",
    bankAccountNumberMasked: "",
    ifscCode: "",
    assessedAmount: 0,
    approvedAmount: undefined,
    remarks: "",
  });

  const [paymentForm, setPaymentForm] =
    useState<MarkCompensationPaidPayload>({
      paidAmount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      transactionReference: "",
      paymentMode: "RTGS",
      remarks: "",
    });

  const updateForm = (
    field: keyof CreateCompensationPayload,
    value: string | number | undefined
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await createCompensation({
        ...form,
        projectId: Number(form.projectId),
        parcelId: Number(form.parcelId),
        assessedAmount: Number(form.assessedAmount),
        approvedAmount: form.approvedAmount,
      });

      const created = response.data;

      setRecords((previous) => [created, ...previous]);
      setSelectedRecord(created);

      setForm({
        projectId: 0,
        parcelId: 0,
        beneficiaryName: "",
        beneficiaryType: "TITLE_HOLDER",
        bankAccountNumberMasked: "",
        ifscCode: "",
        assessedAmount: 0,
        approvedAmount: undefined,
        remarks: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to create compensation record."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    setError("");

    try {
      const response = await approveCompensation(id);
      const updated = response.data;

      setRecords((previous) =>
        previous.map((record) =>
          record.id === updated.id ? updated : record
        )
      );

      setSelectedRecord(updated);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to approve compensation."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaid = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedRecord) return;

    setActionLoading(true);
    setError("");

    try {
      const response = await markCompensationPaid(
        selectedRecord.id,
        {
          ...paymentForm,
          paidAmount: Number(paymentForm.paidAmount),
        }
      );

      const updated = response.data;

      setRecords((previous) =>
        previous.map((record) =>
          record.id === updated.id ? updated : record
        )
      );

      setSelectedRecord(updated);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to mark compensation as paid."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatStatus = (status: PaymentStatus) => {
    return status
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
          Acquisition Process / Compensation
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Compensation Management
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Create compensation assessments, approve eligible
          payments and record disbursement details.
        </p>
      </div>

      {error && <ErrorState message={error} />}

      <SectionCard
        title="Create Compensation Record"
        description="Enter beneficiary and assessed compensation details."
      >
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div>
            <label className="form-label">
              Project ID *
            </label>

            <input
              type="number"
              min="1"
              required
              value={form.projectId || ""}
              onChange={(event) =>
                updateForm(
                  "projectId",
                  Number(event.target.value)
                )
              }
              className="form-input"
              placeholder="Enter project ID"
            />
          </div>

          <div>
            <label className="form-label">
              Land Parcel ID *
            </label>

            <input
              type="number"
              min="1"
              required
              value={form.parcelId || ""}
              onChange={(event) =>
                updateForm(
                  "parcelId",
                  Number(event.target.value)
                )
              }
              className="form-input"
              placeholder="Enter parcel ID"
            />
          </div>

          <div>
            <label className="form-label">
              Beneficiary Name *
            </label>

            <input
              type="text"
              required
              value={form.beneficiaryName}
              onChange={(event) =>
                updateForm(
                  "beneficiaryName",
                  event.target.value
                )
              }
              className="form-input"
              placeholder="Enter beneficiary name"
            />
          </div>

          <div>
            <label className="form-label">
              Beneficiary Type *
            </label>

            <select
              required
              value={form.beneficiaryType}
              onChange={(event) =>
                updateForm(
                  "beneficiaryType",
                  event.target.value as FamilyCategory
                )
              }
              className="form-input"
            >
              {familyCategories.map((category) => (
                <option key={category} value={category}>
                  {category
                    .toLowerCase()
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1)
                    )
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">
              Bank Account Number (Masked) *
            </label>

            <input
              type="text"
              required
              value={form.bankAccountNumberMasked}
              onChange={(event) =>
                updateForm(
                  "bankAccountNumberMasked",
                  event.target.value
                )
              }
              className="form-input"
              placeholder="XXXXXX1234"
            />
          </div>

          <div>
            <label className="form-label">
              IFSC Code *
            </label>

            <input
              type="text"
              required
              value={form.ifscCode}
              onChange={(event) =>
                updateForm(
                  "ifscCode",
                  event.target.value.toUpperCase()
                )
              }
              className="form-input"
              placeholder="SBIN0001234"
            />
          </div>

          <div>
            <label className="form-label">
              Assessed Amount (₹) *
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.assessedAmount || ""}
              onChange={(event) =>
                updateForm(
                  "assessedAmount",
                  Number(event.target.value)
                )
              }
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="form-label">
              Approved Amount (₹)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.approvedAmount ?? ""}
              onChange={(event) =>
                updateForm(
                  "approvedAmount",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value)
                )
              }
              className="form-input"
              placeholder="Optional"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">
              Remarks
            </label>

            <textarea
              rows={3}
              value={form.remarks || ""}
              onChange={(event) =>
                updateForm(
                  "remarks",
                  event.target.value
                )
              }
              className="form-input resize-none"
              placeholder="Enter remarks if required"
            />
          </div>

          <div className="md:col-span-2 flex justify-end border-t border-slate-200 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Compensation"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Current Session Records"
        description="Compensation records created during this browser session."
      >
        {records.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No compensation records created in this session.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              The backend documentation does not provide a
              compensation listing endpoint, so this table only
              contains records created through this page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    ID
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Beneficiary
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Project
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Parcel
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Assessed
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      #{record.id}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {record.beneficiaryName}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {record.projectId}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {record.parcelId}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-700">
                      ₹
                      {record.assessedAmount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={record.paymentStatus}
                      />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRecord(record)
                        }
                        className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {selectedRecord && (
        <SectionCard
          title={`Compensation Record #${selectedRecord.id}`}
          description="Review the record and perform the next permitted action."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Beneficiary
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {selectedRecord.beneficiaryName}
              </p>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Assessed Amount
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                ₹
                {selectedRecord.assessedAmount.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Payment Status
              </p>
              <div className="mt-2">
                <StatusBadge
                  status={selectedRecord.paymentStatus}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {selectedRecord.paymentStatus === "PENDING" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleApprove(selectedRecord.id)
                }
                className="rounded bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
              >
                {actionLoading
                  ? "Processing..."
                  : "Approve Compensation"}
              </button>
            )}
          </div>

          {selectedRecord.paymentStatus === "APPROVED" && (
            <form
              onSubmit={handleMarkPaid}
              className="mt-6 border-t border-slate-200 pt-6"
            >
              <h3 className="text-base font-semibold text-slate-900">
                Record Payment
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="form-label">
                    Paid Amount (₹) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={paymentForm.paidAmount || ""}
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        paidAmount: Number(
                          event.target.value
                        ),
                      }))
                    }
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Payment Date *
                  </label>

                  <input
                    type="date"
                    required
                    value={paymentForm.paymentDate}
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        paymentDate: event.target.value,
                      }))
                    }
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Transaction Reference *
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      paymentForm.transactionReference
                    }
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        transactionReference:
                          event.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="Transaction reference"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Payment Mode *
                  </label>

                  <select
                    required
                    value={paymentForm.paymentMode}
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        paymentMode: event.target.value,
                      }))
                    }
                    className="form-input"
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">
                    Remarks
                  </label>

                  <textarea
                    rows={3}
                    value={paymentForm.remarks || ""}
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        remarks: event.target.value,
                      }))
                    }
                    className="form-input resize-none"
                    placeholder="Payment remarks"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded bg-green-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Mark Payment as Paid"}
                </button>
              </div>
            </form>
          )}

          {selectedRecord.paymentStatus === "DISBURSED" && (
            <div className="mt-6 border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">
                Payment Disbursed
              </p>

              <p className="mt-1 text-sm text-green-700">
                Transaction Reference:{" "}
                {selectedRecord.transactionReference ||
                  "Not available"}
              </p>

              {selectedRecord.paymentDate && (
                <p className="mt-1 text-sm text-green-700">
                  Payment Date:{" "}
                  {selectedRecord.paymentDate}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">
            Current status:{" "}
            {formatStatus(selectedRecord.paymentStatus)}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default CompensationPage;
