"use client";

import { format, parseISO } from "date-fns";
import { Lead, LeadStatus } from "@/types/lead";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  deletingLeadId: string | null;
}

const statusClasses: Record<LeadStatus, string> = {
  New: "bg-slate-100 text-slate-700",
  Engaged: "bg-blue-100 text-blue-700",
  "Proposal Sent": "bg-amber-100 text-amber-700",
  "Closed-Won": "bg-emerald-100 text-emerald-700",
  "Closed-Lost": "bg-red-100 text-red-700",
};

const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return format(date, "dd MMM yyyy");
};

export default function LeadsTable({
  leads,
  isLoading,
  error,
  onEdit,
  onDelete,
  deletingLeadId,
}: LeadsTableProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading leads...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (leads.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
        No leads yet. Click Create to add your first lead.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Created At
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{lead.name}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{lead.email}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[lead.status]}`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                {formatDate(lead.createdAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(lead._id)}
                    disabled={deletingLeadId === lead._id}
                    className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingLeadId === lead._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
